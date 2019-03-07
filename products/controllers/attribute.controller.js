const productModel = require('../models/product.model');
const crudUtil = require('../utils/crud.util');
const msgUtil = require('../utils/message.util');

module.exports = {
  getAttributes: async (req, res) => {
    if (req) {
      try {
        const attributes = await crudUtil.getAll(productModel.Attribute, req.query);
        res.status(msgUtil.success_200.status);
        res.json({
          attributes: attributes.rows,
          count: attributes.count,
        });
      } catch (err) {
        res.status(err.status);
        res.json(err.error);
      }
    }
  },
  getAttributeDetail: async (req, res) => {
    if (req) {
      try {
        const Attribute = await crudUtil.getById(productModel.Attribute, req.params.id);
        res.status(200);
        res.json({ Attribute });
      } catch (err) {
        res.status(err.status);
        res.json(err.error);
      }
    }
  },
  createAttribute: async (req, res) => {
    if (req) {
      try {
        const payload = req.body;
        await crudUtil.create(productModel.Attribute, payload);
        res.status(msgUtil.success_201.status);
        res.json(msgUtil.success_201.data);
      } catch (err) {
        res.status(err.status);
        res.json(err.error);
      }
    }
  },
  updateAttribute: async (req, res) => {
    if (req) {
      try {
        if (!req.params.id) {
          throw new Error(msgUtil.error_400);
        }
        const payload = req.body;
        const whereOption = {
          Attribute_id: req.params.id,
        };
        await crudUtil.update(productModel.Attribute, payload, whereOption);
        res.status(msgUtil.success_204.status);
        res.json(msgUtil.success_204.data);
      } catch (err) {
        res.status(err.status);
        res.json(err.error);
      }
    }
  },
  deleteAttribute: async (req, res) => {
    if (req) {
      try {
        if (!req.params.id) {
          throw new Error(msgUtil.error_400);
        }
        const whereOption = {
          Attribute_id: req.params.id,
        };
        await crudUtil.delete(productModel.Attribute, whereOption);
        res.status(msgUtil.success_204.status);
        res.send(msgUtil.success_204.data);
      } catch (err) {
        res.status(err.status);
        res.json(err.error);
      }
    }
  },
};
