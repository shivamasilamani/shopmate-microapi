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
  getCategoryDetail: async (req, res) => {
    if (req) {
      try {
        const category = await crudUtil.getById(productModel.Category, req.params.id);
        res.status(msgUtil.success_200.status);
        res.json({ category });
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
  createCategory: async (req, res) => {
    if (req) {
      try {
        const payload = req.body;

        const departmentCondition = {
          department_id: req.body.department_id,
        };

        const department = await crudUtil.getOne(productModel.Department, departmentCondition);
        if (!department) {
          res.status(msgUtil.error_400.status);
          res.json(msgUtil.error_400.data);
          return;
        }

        await crudUtil.create(productModel.Category, payload);
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
