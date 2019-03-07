const dbConfig = require('./db.config');
const log = require('./log.config');
const cartModel = require('../models/cart.model');

dbConfig.login()
  .then(() => {
    log.info('Login Successfull!!');
    log.info('Syncing');

    cartModel.Shopping_Cart.sync();
  })
  .catch((err) => {
    log.info(err);
  });
