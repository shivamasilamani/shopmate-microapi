const productModel = require('../models/product.model');
const crudUtil = require('../utils/crud.util');
const msgUtil = require('../utils/message.util');

module.exports = {
  getCategories: async (req, res) => {
    if (req) {
      try {
        const categories = await crudUtil.getAll(productModel.Category, req.query);
        res.status(msgUtil.success_200.status);
        res.json({
          categories: categories.rows,
          count: categories.count,
        });
      } catch (err) {
        res.status(err.status);
        res.json(err.error);
      }
    }
  },
  getCategoryDetail: async (req, res) => {
    if (req) {
      try {
        const category = await crudUtil.getById(productModel.Category, req.params.id);
        res.status(msgUtil.success_200.status);
        res.json({ category });
      } catch (err) {
        res.status(err.status);
        res.json(err.error);
      }
    }
  },
  createCategory: async (req, res) => {
    if (req) {
      try {
        const payload = req.body;
        await crudUtil.create(productModel.Category, payload);
        res.status(msgUtil.success_201.status);
        res.json(msgUtil.success_201.data);
      } catch (err) {
        res.status(err.status);
        res.json(err.error);
      }
    }
  },
  updateCategory: async (req, res) => {
    if (req) {
      try {
        if (!req.params.id) {
          throw new Error(msgUtil.error_400);
        }
        const payload = req.body;
        const whereOption = {
          category_id: req.params.id,
        };
        await crudUtil.update(productModel.Category, payload, whereOption);
        res.status(msgUtil.success_204.status);
        res.json(msgUtil.success_200.data);
      } catch (err) {
        res.status(err.status);
        res.json(err.error);
      }
    }
  },
  deleteCategory: async (req, res) => {
    if (req) {
      try {
        if (!req.params.id) {
          throw new Error(msgUtil.error_400);
        }
        const whereOption = {
          category_id: req.params.id,
        };
        await crudUtil.delete(productModel.Category, whereOption);
        res.status(msgUtil.success_204.status);
        res.send(msgUtil.success_204.status);
      } catch (err) {
        res.status(err.status);
        res.json(err.error);
      }
    }
  },
};
