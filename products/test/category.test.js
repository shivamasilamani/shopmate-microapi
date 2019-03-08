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

describe('products', () => {
  let token = '';
  let adminToken = '';

  before(async () => {
    await dbConfig.login();

    // Create a test department for testing
    // This will be deleted after the test run
    const departmentPayload = {
      department_id: 500000,
      name: 'test_department',
      description: 'test_department',
    };
    await crudUtil.create(productModel.Department, departmentPayload);

    // Create a test category for testing
    // This will be deleted after the test run
    const categoryPayload = {
      category_id: 500000,
      department_id: 500000,
      name: 'test_category',
      description: 'test_category',
    };
    await crudUtil.create(productModel.Category, categoryPayload);

    // Generate a valid JWT token for testing
    const jwtObject = {
      email: 'integration2@test.com',
      name: 'integration',
      admin: 'user',
    };

    token = jwt.sign(jwtObject, config.JWT_SECRET, { expiresIn: '12h' });

    // Generate a valid JWT token for testing
    const jwtObjectAdmin = {
      email: 'integration3@test.com',
      name: 'integration',
      role: 'admin',
    };

    adminToken = jwt.sign(jwtObjectAdmin, config.JWT_SECRET, { expiresIn: '12h' });
  });

  // All category endpoint test
  describe('Categories /', () => {
    // Test the category API
    // API should return status 200
    // API should return at least one result
    it('should read all categories', (done) => {
      chai.request(app)
        .get('/products/category')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          done();
        });
    });

    // Test the category API's detail feature
    // API should return status 200
    // API should return the specific category which was queried with ID
    // Result should contain the exact category which was queried
    it('should read category details', (done) => {
      chai.request(app)
        .get('/products/category/500000')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          chai.assert.equal(500000, res.body.category.category_id);
          done();
        });
    });

    // Test the category API's create feature WITHOUT admin credentials
    // API should return status 401
    // Category should not be created
    it('should create a category', (done) => {
      const reqBodyCreateInavlid = {
        product_id: 500001,
        department_id: 500000,
        name: 'test_category',
        description: 'test category',
      };

      chai.request(app)
        .post('/products/category')
        .send(reqBodyCreateInavlid)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.a('object');
          done();
        });
    });

    // Test the category API's create feature
    // API should return status 201
    // Category should be created with given payload
    it('should create a category', (done) => {
      const reqBodyCreate = {
        product_id: 500001,
        department_id: 500000,
        name: 'test_category',
        description: 'test category',
      };

      chai.request(app)
        .post('/products/category')
        .send(reqBodyCreate)
        .set('Authorization', `Bearer ${adminToken}`)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          done();
        });
    });

    // Test the category API's create feature
    // API should return status 201
    // Category should be updated with given payload
    it('should update a category', (done) => {
      const reqBodyUpdate = {
        name: 'test_category_updated',
      };

      chai.request(app)
        .put('/products/category/500000')
        .send(reqBodyUpdate)
        .set('Authorization', `Bearer ${adminToken}`)
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
      category_id: 500000,
    };
    await crudUtil.delete(productModel.Category, whereOption);

    whereOption = {
      category_id: 500001,
    };
    await crudUtil.delete(productModel.Category, whereOption);

    whereOption = {
      department_id: 500000,
    };
    await crudUtil.delete(productModel.Department, whereOption);
  });
});
