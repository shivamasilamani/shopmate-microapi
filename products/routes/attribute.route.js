const express = require('express');
const attributeController = require('../controllers/attribute.controller');

const route = express.Router();

route.get('/', (req, res) => {
  attributeController.getAttributes(req, res);
});

route.get('/:id', (req, res) => {
  attributeController.getAttributeDetail(req, res);
});

route.post('/', (req, res) => {
  attributeController.createAttribute(req, res);
});

route.put('/:id', (req, res) => {
  attributeController.updateAttribute(req, res);
});

route.delete('/:id', (req, res) => {
  attributeController.deleteAttribute(req, res);
});

module.exports = route;
