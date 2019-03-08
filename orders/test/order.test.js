process.env.NODE_ENV = 'test';

const jwt = require('jsonwebtoken');
const chai = require('chai');
const chaiHttp = require('chai-http');
const dbConfig = require('../config/db.config');
const config = require('../config.json');
const crudUtil = require('../utils/crud.util');
const cartModel = require('../models/cart.model');
const app = require('../index');

// Configure chai
chai.use(chaiHttp);
chai.should();

describe('orders', () => {
  let token = '';

  before(async () => {
    await dbConfig.login();

    // Create a test cart item for testing
    // This will be deleted after the test run
    const payload = {
      item_id: 500000,
      email: 'integration2@test.com',
      product_id: 500000,
      quantity: 10,
    };
    await crudUtil.create(cartModel.Shopping_Cart, payload);

    // Generate a valid JWT token for testing
    const jwtObject = {
      email: 'integration2@test.com',
      name: 'integration',
    };
    token = jwt.sign(jwtObject, config.JWT_SECRET, { expiresIn: '12h' });
  });

  // All Cart endpoint test
  describe('Shopping Cart /', () => {
    // Test the cart API
    // API should return status 200
    // API should return at least one result
    it('should read all items in cart', (done) => {
      chai.request(app)
        .get('/orders/cart')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          done();
        });
    });

    // Test the cart API's create feature
    // API should return status 201
    // Item should be added with given payload
    it('should add an item to cart', (done) => {
      const reqBody = {
        product_id: 500001,
        quantity: 10,
      };

      chai.request(app)
        .post('/orders/cart')
        .send(reqBody)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          done();
        });
    });

    // Test the cart API's create feature
    // API should return status 201
    // Item should be removed from the cart
    it('should remove an item from cart', (done) => {
      chai.request(app)
        .delete('/orders/cart/500000')
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
    const whereOption = {
      email: 'integration2@test.com',
    };
    await crudUtil.delete(cartModel.Shopping_Cart, whereOption);
  });
});
