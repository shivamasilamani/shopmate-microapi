const Express = require('express');
const os = require('os');
const bodyParser = require('body-parser');
const googleTraceAgent = require('@google-cloud/trace-agent');
const googleDebugAgent = require('@google-cloud/debug-agent');
const passport = require('passport');
const compression = require('compression');
const log = require('./config/log.config');
const dbConfig = require('./config/db.config');
const productRoute = require('./routes/product.route');
const departmentRoute = require('./routes/department.route');
const categoryRoute = require('./routes/category.route');
const attributeRoute = require('./routes/attribute.route');
const cartRoute = require('./routes/cart.route');
require('./config/passport.config')(passport);

const app = new Express();

// Login to database and establish connection
dbConfig.login();

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
app.use('/products/items', passport.authenticate('jwt', { session: false }), productRoute);
app.use('/products/department', passport.authenticate('jwt', { session: false }), departmentRoute);
app.use('/products/category', passport.authenticate('jwt', { session: false }), categoryRoute);
app.use('/products/attribute', passport.authenticate('jwt', { session: false }), attributeRoute);
app.use('/products/cart', passport.authenticate('jwt', { session: false }), cartRoute);

app.get('/products', (req, res) => {
  res.send(`Products service is running on ${os.cpus().length} CPUs...`);
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
const port = process.env.PORT || 8001;
app.listen(port, () => {
  log.info('App is running...');
});

// Export app for testing
module.exports = app;