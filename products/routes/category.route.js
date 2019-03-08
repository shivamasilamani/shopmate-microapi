const express = require('express');
const categoryController = require('../controllers/category.controller');

const route = express.Router();

route.get('/', (req, res) => {
  categoryController.getCategories(req, res);
});

route.get('/:id', (req, res) => {
  categoryController.getCategoryDetail(req, res);
});

route.post('/', categoryController.isAdmin, (req, res) => {
  categoryController.createCategory(req, res);
});

route.put('/:id', categoryController.isAdmin, (req, res) => {
  categoryController.updateCategory(req, res);
});

route.delete('/:id', categoryController.isAdmin, (req, res) => {
  categoryController.deleteCategory(req, res);
});

module.exports = route;
