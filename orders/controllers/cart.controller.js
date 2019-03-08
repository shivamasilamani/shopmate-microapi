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
        res.status(err.status);
        res.send(err.data);
      }
    }
  },
  getItemDetailInCart: async (req, res) => {
    if (req.user) {
      res.status(200);
    }
  },
  addProductToCart: async (req, res) => {
    if (req.user) {
      try {
        if (req.body.email) {
          res.status(400);
          res.send('Bad Request');
        }
        const cartItem = req.body;
        cartItem.email = req.user.email;
        await crudUtil.create(cartModel.Shopping_Cart, cartItem);
        res.status(201);
        res.send('Created');
      } catch (err) {
        res.status(400);
        res.send('Bad Request');
      }
    }
  },
};
