const dbConfig = require('./db.config');
const log = require('./log.config');
const productModel = require('../models/product.model');

dbConfig.login()
  .then(() => {
    log.info('Login Successfull!!');
    log.info('Syncing');

    productModel.Product.sync({ force: true });
    productModel.Department.sync({ force: true });
    productModel.Category.sync({ force: true });
    productModel.Attribute.sync({ force: true });
    productModel.Attribute_Value.sync({ force: true });
    productModel.Product_Attribute.sync({ force: true });
    productModel.Review.sync({ force: true });
  })
  .catch((err) => {
    log.info(err);
  });
