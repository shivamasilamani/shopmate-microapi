const Express = require('express');
const os = require('os');
const bodyParser = require('body-parser');
const googleTraceAgent = require('@google-cloud/trace-agent');
const googleDebugAgent = require('@google-cloud/debug-agent');
const passport = require('passport');
const compression = require('compression');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const log = require('./config/log.config');
const dbConfig = require('./config/db.config');
const userRoute = require('./routes/user.route');
require('./config/passport.config')(passport);

const app = new Express();

// Login to database and establish connection
if (process.env.NODE_ENV !== 'test') {
  dbConfig.login();
}

// Set various http headers which enhances security
app.use(helmet());

// Set request limit for a single client
// In 15 mins, if a single client sends more than 500 requests, block the subsequent requests
if (process.env.NODE_ENV === 'production') {
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 500,
  });
  app.use(limiter);
}

// Initialize passport
app.use(passport.initialize());

// Setup body parser
const jsonParser = bodyParser.json();
app.use(jsonParser);

// Setup request logger. Using winston logger because gcloud supports this
app.use(log.requestLogger);

// Setup response payload compression
app.use(compression());

// Setup routes
app.use('/user', userRoute);

app.get('/', (req, res) => {
  res.send(`App is running on ${os.cpus().length} CPUs...`);
});

if (process.env.NODE_ENV === 'production') {
  googleTraceAgent.start();
  googleDebugAgent.start();
}

// Setup error logger. Using winston logger because gcloud supports this
app.use(log.errorLogger);

// Generic 404 Error
app.use((req, res) => {
  res.status(404).send('Not Found');
});

// Generic Error Handler
app.use((err, req, res) => {
  res.status(500).send(err.response || 'Something broke!');
});

// Start the app
const port = process.env.PORT || 8000;
app.listen(port, () => {
  log.info('App is running...');
});

// Export app for testing
module.exports = app;
