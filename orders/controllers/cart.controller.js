const cartModel = require('../models/cart.model');
const crudUtil = require('../utils/crud.util');
const msgUtil = require('../utils/message.util');

module.exports = {
  getItemsInCart: async (req, res) => {
    if (req.user) {
      try {
        const query = {
          email: req.user.email,
        };
        const items = await crudUtil.getAll(cartModel.Shopping_Cart, query);
        res.status(msgUtil.success_200.status);
        res.json({
          items: items.rows,
          count: items.count,
        });
      } catch (err) {
        if (err.status) {
          res.status(err.status);
          res.json(err.data);
        } else {
          res.status(msgUtil.error_500.status);
          res.json(msgUtil.error_500.data);
        }
      }
    }
  },
  addItemToCart: async (req, res) => {
    if (req.user) {
      try {
        if (req.body.email) {
          res.status(msgUtil.error_400.status);
          msgUtil.error_400.data.long_text = 'Email should not be in payload';
          res.json(msgUtil.success_400.data);
        }
        const cartItem = req.body;
        cartItem.email = req.user.email;
        await crudUtil.create(cartModel.Shopping_Cart, cartItem);
        res.status(msgUtil.success_201.status);
        res.json(msgUtil.success_201.data);
      } catch (err) {
        if (err.status) {
          res.status(err.status);
          res.json(err.data);
        } else {
          res.status(msgUtil.error_500.status);
          res.json(msgUtil.error_500.data);
        }
      }
    }
  },
  removeItemFromCart: async (req, res) => {
    if (req.user) {
      try {
        if (!req.params.id) {
          res.status(msgUtil.error_400.status);
          res.json(msgUtil.error_400.data);
        }
        const option = {
          item_id: req.params.id,
        };
        await crudUtil.delete(cartModel.Shopping_Cart, option);
        res.status(msgUtil.success_204.status);
        res.json(msgUtil.success_204.data);
      } catch (err) {
        if (err.status) {
          res.status(err.status);
          res.json(err.data);
        } else {
          res.status(msgUtil.error_500.status);
          res.json(msgUtil.error_500.data);
        }
      }
    }
  },
};
