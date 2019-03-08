const express = require('express');
const cartController = require('../controllers/cart.controller');

const route = express.Router();

route.get('/', (req, res) => {
  cartController.getItemsInCart(req, res);
});

route.get('/:id', (req, res) => {
  cartController.getItemDetailInCart(req, res);
});

route.post('/', (req, res) => {
  cartController.addProductToCart(req, res);
});

module.exports = route;
