process.env.NODE_ENV = 'test';

const jwt = require('jsonwebtoken');
const chai = require('chai');
const chaiHttp = require('chai-http');
const dbConfig = require('../config/db.config');
const config = require('../config.json');
const crudUtil = require('../utils/crud.util');
const productModel = require('../models/product.model');
const app = require('../index');

// Configure chai
chai.use(chaiHttp);
chai.should();

describe('user', () => {
  let token = '';

  before(async () => {
    await dbConfig.login();

    // Create a test product for testing
    // This will be deleted after the test run
    const payload = {
      product_id: 500000,
      name: 'test_product',
      description: 'test product',
      category_id: 500,
      department_id: 500,
      price: 10.10,
      discounted_price: 10.10,
      display: 2,
    };
    await crudUtil.create(productModel.Product, payload);

    // Generate a valid JWT token for testing
    const jwtObject = {
      email: 'integration2@test.com',
      name: 'integration',
    };

    token = jwt.sign(jwtObject, config.JWT_SECRET, { expiresIn: '12h' });
  });

  // All product endpoint test
  describe('Products /', () => {
    // Test the products API
    // API should return status 200
    // API should return at least one result
    it('should read all products', (done) => {
      chai.request(app)
        .get('/products/item')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          done();
        });
    });

    // Test the products API's search feature
    // API should return status 200
    // API should return at least one result as a search result
    // Result item should match the search pattern
    it('search should get results', (done) => {
      chai.request(app)
        .get('/products/item?search=\'product\'')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          chai.assert.equal('test_product', res.body.products[0].name);
          done();
        });
    });

    // Test the products API's filter feature
    // API should return status 200
    // API should return at least one result as a filter result
    // Result item should match the filter pattern
    it('filter should get results', (done) => {
      chai.request(app)
        .get('/products/item?category=500')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          chai.assert.equal(500, res.body.products[0].category_id);
          done();
        });
    });

    // Test the products API's detail feature
    // API should return status 200
    // API should return the specific product which was queried with ID
    // Result should contain the exact product which was queried
    it('should read product details', (done) => {
      chai.request(app)
        .get('/products/item/500000')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          chai.assert.equal(500000, res.body.product.product_id);
          done();
        });
    });

    // Test the products API's create feature
    // API should return status 201
    // Product should be created with given payload
    it('should create a product', (done) => {
      const reqBody = {
        product_id: 500001,
        name: 'test_product',
        description: 'test product',
        category_id: 1,
        department_id: 1,
        price: 10.10,
        discounted_price: 10.10,
        display: 2,
      };

      chai.request(app)
        .post('/products/item')
        .send(reqBody)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          done();
        });
    });

    // Test the products API's create feature
    // API should return status 201
    // Product should be updated with given payload
    it('should update a product', (done) => {
      const reqBody = {
        name: 'test_product_updated',
      };

      chai.request(app)
        .put('/products/item/500000')
        .send(reqBody)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(204);
          res.body.should.be.a('object');
          done();
        });
    });
  });

  after(async () => {
    // Cleanup
    // Delete all the test data which was created
    let whereOption = {
      product_id: 500000,
    };
    await crudUtil.delete(productModel.Product, whereOption);

    whereOption = {
      product_id: 500001,
    };
    await crudUtil.delete(productModel.Product, whereOption);
  });
});
