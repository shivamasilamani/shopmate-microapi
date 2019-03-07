const Sequelize = require('sequelize');
const dbConfig = require('../config/db.config');

const sequelizeInstance = dbConfig.dbInstance;

module.exports = {
  Orders: sequelizeInstance.define('seq_orders', {
    order_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    total_amount: {
      type: Sequelize.DECIMAL(10, 2),
      defaultValue: 0.00,
      allowNull: false,
    },
    created_on: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    shipped_on: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    status: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    comments: {
      type: Sequelize.STRING(255),
    },
    customer_id: {
      type: Sequelize.INTEGER,
    },
    auth_code: {
      type: Sequelize.STRING(50),
    },
    reference: {
      type: Sequelize.STRING(50),
    },
    shipping_id: {
      type: Sequelize.INTEGER,
    },
    tax_id: {
      type: Sequelize.INTEGER,
    },
  }),
  Order_Detail: sequelizeInstance.define('seq_order_detail', {
    item_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    order_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    product_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    attribs: {
      type: Sequelize.STRING(1000),
      allowNull: false,
    },
    product_name: {
      type: Sequelize.STRING(100),
      defaultValue: 0,
      allowNull: false,
    },
    quantity: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    unit_cost: {
      type: Sequelize.DECIMAL(10, 2),
    },
  }),
  Shipping_Region: sequelizeInstance.define('seq_shipping_region', {
    shipping_region_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    shipping_region: {
      type: Sequelize.STRING(100),
      allowNull: false,
    },
  }),
  Shipping: sequelizeInstance.define('seq_shipping', {
    shipping_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    shipping_type: {
      type: Sequelize.STRING(100),
      allowNull: false,
    },
    shipping_cost: {
      type: Sequelize.NUMERIC(10, 2),
      allowNull: false,
    },
    shipping_region_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  }),
  Tax: sequelizeInstance.define('seq_tax', {
    tax_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    tax_type: {
      type: Sequelize.STRING(100),
      allowNull: false,
    },
    tax_percentage: {
      type: Sequelize.NUMERIC(10, 2),
      allowNull: false,
    },
  }),
  Audit: sequelizeInstance.define('seq_audit', {
    audit_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    order_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    created_on: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    message: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    code: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  }),
};
