const express = require('express');
const clearCartJob = require('../jobs/clearcart.job');

const route = express.Router();

route.get('/clearcart', (req, res) => {
  clearCartJob.clearCart(req, res);
});

module.exports = route;
