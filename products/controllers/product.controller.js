const productModel = require('../models/product.model');
const crudUtil = require('../utils/crud.util');
const msgUtil = require('../utils/message.util');

module.exports = {
  isAdmin: (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
      next();
    } else {
      res.status(msgUtil.error_401.status);
      res.json(msgUtil.error_401.data);
    }
  },
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
        res.json(err.data);
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
        res.json(err.data);
      }
    }
  },
  getProductAttributes: async (req, res) => {
    if (req) {
      res.status(200);
    }
  },
  createProduct: async (req, res) => {
    if (req) {
      try {
        const payload = req.body;
        const categoryCondition = {
          category_id: payload.category_id,
          department_id: payload.department_id,
        };

        const category = await crudUtil.getOne(productModel.Category, categoryCondition);
        if (!category) {
          res.status(msgUtil.error_400.status);
          res.send(msgUtil.error_400.data);
          return;
        }
        await crudUtil.create(productModel.Product, payload);
        res.status(msgUtil.success_201.status);
        res.send(msgUtil.success_201.data);
      } catch (err) {
        res.status(err.status);
        res.json(err.data);
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
        res.json(err.data);
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
        res.json(err.data);
      }
    }
  },
};
