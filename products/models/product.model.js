const Sequelize = require('sequelize');
const dbConfig = require('../config/db.config');

const sequelizeInstance = dbConfig.dbInstance;

module.exports = {
  Department: sequelizeInstance.define('seq_department', {
    department_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.STRING(100),
      allowNull: false,
    },
    description: {
      type: Sequelize.STRING(1000),
    },
  }),
  Category: sequelizeInstance.define('seq_category', {
    category_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    department_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    name: {
      type: Sequelize.STRING(100),
      allowNull: false,
    },
    description: {
      type: Sequelize.STRING(1000),
    },
  }),
  Product: sequelizeInstance.define('seq_product', {
    product_id: {
      type: Sequelize.INTEGER(11),
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.STRING(100),
      allowNull: false,
    },
    description: {
      type: Sequelize.STRING(1000),
    },
    price: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
    },
    discounted_price: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
    },
    image: {
      type: Sequelize.STRING(150),
    },
    image_2: {
      type: Sequelize.STRING(150),
    },
    thumbnail: {
      type: Sequelize.STRING(150),
    },
    display: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  },
  {
    indexes: [
      {
        name: 'idx_ft_product_name_description',
        type: 'FULLTEXT',
        fields: ['name', 'description'],
      },
    ],
  }),
  Product_Category: sequelizeInstance.define('seq_product_category', {
    product_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
    category_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
  }),
  Attribute: sequelizeInstance.define('seq_attribute', {
    attribute_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.STRING(100),
      allowNull: false,
    },
  }),
  Attribute_Value: sequelizeInstance.define('seq_attribute_value', {
    attribute_value_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    attribute_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    value: {
      type: Sequelize.STRING(100),
      allowNull: false,
    },
  }),
  Product_Attribute: sequelizeInstance.define('seq_product_attribute', {
    product_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
    attribute_value_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
  }),
  Review: sequelizeInstance.define('seq_review', {
    review_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    customer_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    product_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    review: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    rating: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  }),
};
