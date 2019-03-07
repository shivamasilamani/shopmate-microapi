const dbConfig = require('./db.config');
const log = require('./log.config');
const cartModel = require('../models/cart.model');
const orderModel = require('../models/order.model');

dbConfig.login()
  .then(() => {
    log.info('Login Successfull!!');
    log.info('Syncing');

    cartModel.Shopping_Cart.sync({ force: true });

    orderModel.Audit.sync();
    orderModel.Order_Detail.sync();
    orderModel.Orders.sync();
    orderModel.Shipping.sync();
    orderModel.Shipping_Region.sync();
    orderModel.Tax.sync();
  })
  .catch((err) => {
    log.info(err);
  });
