const dbConfig = require('./db.config');
const log = require('./log.config');
const userModel = require('../models/user.model');

dbConfig.login()
  .then(() => {
    log.info('Login Successfull!!');
    log.info('Syncing');

    userModel.User.sync({ force: true });
  })
  .catch((err) => {
    log.info(err);
  });
