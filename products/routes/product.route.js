const express = require('express');
const productController = require('../controllers/product.controller');

const route = express.Router();

route.get('/', productController.getFromcache, (req, res) => {
  productController.getProducts(req, res);
});

route.get('/:id', (req, res) => {
  productController.getProductDetail(req, res);
});

route.post('/', productController.isAdmin, (req, res) => {
  productController.createProduct(req, res);
});

route.put('/:id', productController.isAdmin, (req, res) => {
  productController.updateProduct(req, res);
});

route.delete('/:id', productController.isAdmin, (req, res) => {
  productController.deleteProduct(req, res);
});

module.exports = route;
