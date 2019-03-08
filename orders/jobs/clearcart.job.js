const op = require('sequelize').Op;
const cartModel = require('../models/cart.model');
const crudUtil = require('../utils/crud.util');
const msgUtil = require('../utils/message.util');
const dbConfig = require('../config/db.config');

module.exports = {
  clearCart: async (req, res) => {
    try {
      await dbConfig.login();
      const option = {
        createdAt: {
          [op.lt]: new Date(new Date() - 48 * 60 * 60 * 1000),
        },
      };
      await crudUtil.delete(cartModel.Shopping_Cart, option);
      res.status(msgUtil.success_204.status);
      res.send(msgUtil.success_204.data);
    } catch (err) {
      res.status(msgUtil.error_500.status);
      res.send(msgUtil.error_500.data);
    }
  },
};
