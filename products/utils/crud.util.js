const Sequelize = require('sequelize');
const log = require('../config/log.config');
const msgUtil = require('./message.util');

const op = Sequelize.Op;

module.exports = {
  // Queries a DB table to find all records which matches the given condition
  getAll: (model, query) => {
    const getPromise = new Promise((resolve, reject) => {
      const options = {
        where: {},
      };
      if (query.skip && query.top) {
        options.offset = parseInt(query.skip, 10);
        options.limit = parseInt(query.top, 10);
      }
      if (query.search) {
        options.where = Sequelize.literal(`MATCH (name, description) AGAINST(${query.search} IN NATURAL LANGUAGE MODE)`);
      }
      if (query.category) {
        options.where.category_id = {
          [op.eq]: query.category,
        };
      }
      if (query.department) {
        options.where.department_id = {
          [op.eq]: query.department,
        };
      }
      model.findAndCountAll(options)
        .then((items) => {
          if (items) {
            resolve(items);
          } else {
            resolve({
              rows: [],
              count: 0,
            });
          }
        })
        .catch((err) => {
          log.error(JSON.stringify(err));
          reject(msgUtil.error_400);
        });
    });
    return getPromise;
  },
  // Queries a DB table to find one row with the given ID
  getById: (model, id) => {
    const getByIdPromise = new Promise((resolve, reject) => {
      model.findByPk(id)
        .then((item) => {
          if (item) {
            resolve(item);
          } else {
            reject(msgUtil.error_404);
          }
        })
        .catch((err) => {
          log.error(JSON.stringify(err));
          reject(msgUtil.error_400);
        });
    });
    return getByIdPromise;
  },
  // Queries a DB table to find one row with the given condition
  getOne: (model, whereOption) => {
    const getByIdPromise = new Promise((resolve, reject) => {
      model.findOne({ where: whereOption })
        .then((item) => {
          if (item) {
            resolve(item);
          } else {
            reject(msgUtil.error_404);
          }
        })
        .catch((err) => {
          log.error(JSON.stringify(err));
          reject(msgUtil.error_400);
        });
    });
    return getByIdPromise;
  },
  // Creates an entry in DB table with the given payload
  create: (model, payload) => {
    const createPromise = new Promise((resolve, reject) => {
      model.create(payload)
        .then((item) => {
          resolve(item);
        })
        .catch((err) => {
          log.error(JSON.stringify(err));
          reject(msgUtil.error_400);
        });
    });
    return createPromise;
  },
  // Updates an entry in DB table with the given payload
  update: (model, payload, whereOption) => {
    const updatePromise = new Promise((resolve, reject) => {
      model.update(payload, { where: whereOption })
        .then((item) => {
          resolve(item);
        })
        .catch((err) => {
          log.error(JSON.stringify(err));
          reject(msgUtil.error_400);
        });
    });
    return updatePromise;
  },
  // Deletes an entry from DB table
  delete: (model, whereOption) => {
    const destroyPromise = new Promise((resolve, reject) => {
      model.destroy({ where: whereOption })
        .then((item) => {
          resolve(item);
        })
        .catch((err) => {
          log.error(JSON.stringify(err));
          reject(msgUtil.error_400);
        });
    });
    return destroyPromise;
  },
};
