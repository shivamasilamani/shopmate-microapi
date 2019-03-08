const Sequelize = require('sequelize');
const dbConfig = require('../config/db.config');

const sequelizeInstance = dbConfig.dbInstance;

module.exports = {
  Shopping_Cart: sequelizeInstance.define('seq_shopping_cart', {
    item_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: Sequelize.STRING(100),
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    product_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    quantity: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    buy_now: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
  }),
};
