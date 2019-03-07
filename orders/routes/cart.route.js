const express = require('express');
const cartController = require('../controllers/cart.controller');

const route = express.Router();

route.post('/', (req, res) => {
  cartController.addProductToCart(req, res);
});

module.exports = route;
