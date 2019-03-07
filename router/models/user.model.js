const Sequelize = require('sequelize');
const crypto = require('crypto');
const dbConfig = require('../config/db.config');

const sequelizeInstance = dbConfig.dbInstance;

const User = sequelizeInstance.define('seq_users', {
  customer_id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  email: {
    type: Sequelize.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  hash: {
    type: Sequelize.STRING(5000),
    allowNull: false,
  },
  salt: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  name: {
    type: Sequelize.STRING(100),
  },
  credit_card: {
    type: Sequelize.STRING(100),
    validate: {
      isCreditCard: true,
    },
  },
  address_1: {
    type: Sequelize.STRING(100),
  },
  address_2: {
    type: Sequelize.STRING(100),
  },
  city: {
    type: Sequelize.STRING(100),
  },
  region: {
    type: Sequelize.STRING(100),
  },
  postal_code: {
    type: Sequelize.STRING(100),
  },
  country: {
    type: Sequelize.STRING(100),
  },
  shioping_region_id: {
    type: Sequelize.INTEGER,
  },
  day_phone: {
    type: Sequelize.STRING(100),
  },
  eve_phone: {
    type: Sequelize.STRING(100),
  },
  mob_phone: {
    type: Sequelize.STRING(100),
  },
});

User.prototype.setHashAndSalt = function setHashAndSalt(password) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

User.prototype.validatePassword = function validatePassword(password) {
  const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
  return this.hash === hash;
};

module.exports = {
  User,
};
