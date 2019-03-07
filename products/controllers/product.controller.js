const productModel = require('../models/product.model');
const crudUtil = require('../utils/crud.util');
const msgUtil = require('../utils/message.util');

module.exports = {
  getProducts: async (req, res) => {
    if (req) {
      try {
        const products = await crudUtil.getAll(productModel.Product, req.query);
        res.status(msgUtil.success_200.status);
        res.json({
          products: products.rows,
          count: products.count,
        });
      } catch (err) {
        res.status(err.status);
        res.json(err.error);
      }
    }
  },
  getProductDetail: async (req, res) => {
    if (req) {
      try {
        const product = await crudUtil.getById(productModel.Product, req.params.id);
        res.status(msgUtil.success_200.status);
        res.json({ product });
      } catch (err) {
        res.status(err.status);
        res.json(err.error);
      }
    }
  },
  createProduct: async (req, res) => {
    if (req) {
      try {
        const payload = req.body;
        await crudUtil.create(productModel.Product, payload);
        res.status(msgUtil.success_201.status);
        res.send(msgUtil.success_201.data);
      } catch (err) {
        res.status(err.status);
        res.json(err.error);
      }
    }
  },
  updateProduct: async (req, res) => {
    if (req) {
      try {
        if (!req.params.id) {
          throw new Error(msgUtil.error_400);
        }
        const payload = req.body;
        const whereOption = {
          product_id: req.params.id,
        };
        await crudUtil.update(productModel.Product, payload, whereOption);
        res.status(msgUtil.success_204.status);
        res.send(msgUtil.success_204.data);
      } catch (err) {
        res.status(err.status);
        res.json(err.error);
      }
    }
  },
  deleteProduct: async (req, res) => {
    if (req) {
      try {
        if (!req.params.id) {
          throw new Error(msgUtil.error_400);
        }
        const whereOption = {
          product_id: req.params.id,
        };
        await crudUtil.delete(productModel.Product, whereOption);
        res.status(msgUtil.success_204.status);
        res.send(msgUtil.success_204.status);
      } catch (err) {
        res.status(err.status);
        res.json(err.error);
      }
    }
  },
};
