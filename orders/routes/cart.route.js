const express = require('express');
const cartController = require('../controllers/cart.controller');

const route = express.Router();

route.get('/', (req, res) => {
  cartController.getItemsInCart(req, res);
});

route.post('/', (req, res) => {
  cartController.addItemToCart(req, res);
});

route.delete('/:id', (req, res) => {
  cartController.removeItemFromCart(req, res);
});

module.exports = route;
