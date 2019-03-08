const productModel = require('../models/product.model');
const crudUtil = require('../utils/crud.util');
const msgUtil = require('../utils/message.util');

module.exports = {
  getDepartments: async (req, res) => {
    if (req) {
      try {
        const departments = await crudUtil.getAll(productModel.Department, req.query);
        res.status(msgUtil.success_200.status);
        res.json({
          departments: departments.rows,
          count: departments.count,
        });
      } catch (err) {
        res.status(err.status);
        res.json(err.error);
      }
    }
  },
  getDepartmentDetail: async (req, res) => {
    if (req) {
      try {
        const department = await crudUtil.getById(productModel.Department, req.params.id);
        res.status(msgUtil.success_200.status);
        res.json({ department });
      } catch (err) {
        res.status(err.status);
        res.json(err.error);
      }
    }
  },
  createDepartment: async (req, res) => {
    if (req) {
      try {
        const payload = req.body;
        await crudUtil.create(productModel.Department, payload);
        res.status(msgUtil.success_201.status);
        res.send(msgUtil.success_201.data);
      } catch (err) {
        res.status(err.status);
        res.json(err.error);
      }
    }
  },
  updateDepartment: async (req, res) => {
    if (req) {
      try {
        if (!req.params.id) {
          throw new Error(msgUtil.error_400);
        }
        const payload = req.body;
        const whereOption = {
          department_id: req.params.id,
        };
        await crudUtil.update(productModel.Department, payload, whereOption);
        res.status(msgUtil.success_204.status);
        res.send(msgUtil.success_204.data);
      } catch (err) {
        res.status(err.status);
        res.json(err.error);
      }
    }
  },
  deleteDepartment: async (req, res) => {
    if (req) {
      try {
        if (!req.params.id) {
          throw new Error(msgUtil.error_400);
        }
        const whereOption = {
          department_id: req.params.id,
        };
        await crudUtil.delete(productModel.Department, whereOption);
        res.status(msgUtil.success_204.status);
        res.send(msgUtil.success_204.status);
      } catch (err) {
        res.status(err.status);
        res.json(err.error);
      }
    }
  },
};
