const productModel = require('../models/product.model');
const cacheConfig = require('../config/cache.config');
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
  getFromcache: (req, res, next) => {
    if (cacheConfig.isExistInCache(req.url)) {
      const payload = cacheConfig.getFromCache(req.url);
      if (payload) {
        res.status(msgUtil.success_200.status);
        res.json(payload);
        cacheConfig.clearCache();
        return;
      }
      next();
    } else {
      next();
    }
  },
  getProducts: async (req, res) => {
    if (req) {
      try {
        const products = await crudUtil.getAll(productModel.Product, req.query);
        res.set({
          'cache-Control': 'public, max-age=43200000',
        });
        res.status(msgUtil.success_200.status);
        const payload = {
          products: products.rows,
          count: products.count,
        };
        res.json(payload);
        cacheConfig.addToCache(req.url, payload);
      } catch (err) {
        if (err.status) {
          res.status(err.status);
          res.json(err.data);
        } else {
          res.status(msgUtil.error_500.status);
          res.json(msgUtil.error_500.data);
        }
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
        if (err.status) {
          res.status(err.status);
          res.json(err.data);
        } else {
          res.status(msgUtil.error_500.status);
          res.json(msgUtil.error_500.data);
        }
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
          res.json(msgUtil.error_400.data);
          return;
        }
        await crudUtil.create(productModel.Product, payload);
        res.status(msgUtil.success_201.status);
        res.json(msgUtil.success_201.data);
      } catch (err) {
        if (err.status) {
          res.status(err.status);
          res.json(err.data);
        } else {
          res.status(msgUtil.error_500.status);
          res.json(msgUtil.error_500.data);
        }
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
        res.json(msgUtil.success_204.data);
      } catch (err) {
        if (err.status) {
          res.status(err.status);
          res.json(err.data);
        } else {
          res.status(msgUtil.error_500.status);
          res.json(msgUtil.error_500.data);
        }
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
        res.json(msgUtil.success_204.status);
      } catch (err) {
        if (err.status) {
          res.status(err.status);
          res.json(err.data);
        } else {
          res.status(msgUtil.error_500.status);
          res.json(msgUtil.error_500.data);
        }
      }
    }
  },
};
