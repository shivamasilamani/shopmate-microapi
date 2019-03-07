const cartModel = require('../models/cart.model');
const crudUtil = require('../utils/crud.util');

module.exports = {
  addProductToCart: async (req, res) => {
    if (req) {
      try {
        const cartItem = req.body;
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
