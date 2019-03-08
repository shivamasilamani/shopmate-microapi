process.env.NODE_ENV = 'test';

const jwt = require('jsonwebtoken');
const chai = require('chai');
const chaiHttp = require('chai-http');
const dbConfig = require('../config/db.config');
const config = require('../config.json');
const crudUtil = require('../utils/crud.util');
const userModel = require('../models/user.model');
const app = require('../index');

// Configure chai
chai.use(chaiHttp);
chai.should();

describe('user', () => {
  let token = '';

  // Create a test user for testing
  // This will be deleted after the test run
  before(async () => {
    await dbConfig.login();

    const payload = {
      email: 'integration2@test.com',
      salt: 'kjgkjkjhkj',
      hash: 'ykjhkjhj',
    };
    await crudUtil.create(userModel.User, payload);

    // Generate a valid JWT token for testing
    const jwtObject = {
      email: 'integration2@test.com',
      name: 'integration',
    };
    token = jwt.sign(jwtObject, config.JWT_SECRET, { expiresIn: '12h' });
  });

  // User registration tests
  describe('Registration /', () => {
    // Test the user registration
    // API should create user and return status 201
    const reqBodyRegistration = {
      email: 'integration@test.com',
      password: '123456',
    };

    it('should create a new user', (done) => {
      chai.request(app)
        .post('/user/signup')
        .send(reqBodyRegistration)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          done();
        });
    });

    // Test the user registration
    // Pass an invalid email
    // API should return status 400
    const reqBodyEmailValidation = {
      email: 'integration.com',
      password: '123456',
    };

    it('should throw email validation error', (done) => {
      chai.request(app)
        .post('/user/signup')
        .send(reqBodyEmailValidation)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          done();
        });
    });

    // Test the user registration
    // Pass an invalid password. Length less than 5
    // API should return status 400
    const reqBodyPasswordValidation = {
      email: 'integration@test.com',
      password: '12',
    };

    it('should throw passport validation error', (done) => {
      chai.request(app)
        .post('/user/signup')
        .send(reqBodyPasswordValidation)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          done();
        });
    });
  });

  describe('Update user /', () => {
    // Test the update user API
    // API should return status 204
    const reqBodyUpdate = {
      name: 'integration_updated',
    };

    it('should update user data', (done) => {
      chai.request(app)
        .post('/user/info')
        .set('Authorization', `Bearer ${token}`)
        .send(reqBodyUpdate)
        .end((err, res) => {
          res.should.have.status(204);
          res.body.should.be.a('object');
          done();
        });
    });

    // Test the update user API
    // API should throw error if the payload has email, hash or salt value
    // API should return status 204
    const reqBodyUpdateValidation = {
      email: 'integration2@test.com',
    };

    it('should throw data validation error', (done) => {
      chai.request(app)
        .post('/user/info')
        .set('Authorization', `Bearer ${token}`)
        .send(reqBodyUpdateValidation)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          done();
        });
    });
  });

  describe('Login /', () => {
    // Test the login API
    // API should logs in the user and returns a valid JWT token
    const reqBodyLogin = {
      email: 'integration5@test.com',
      password: '123456',
    };

    it('should generate a token', (done) => {
      chai.request(app)
        .post('/user/signup')
        .send(reqBodyLogin)
        .end(() => {
          chai.request(app)
            .post('/user/login')
            .send(reqBodyLogin)
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              chai.assert.isNotNull(res.body.access_token);
              done();
            });
        });
    });

    // Test the login API
    // API should throw error if invalid credentials are passed
    // API should return status 404
    const reqBodyLoginInvalid = {
      email: 'integration6@test.com',
      password: '123456',
    };
    const reqBodyLoginInvalid1 = {
      email: 'integration6@test.com',
      password: '12345',
    };
    it('should throw invalid credentials error', (done) => {
      chai.request(app)
        .post('/user/signup')
        .send(reqBodyLoginInvalid)
        .end(() => {
          chai.request(app)
            .post('/user/login')
            .send(reqBodyLoginInvalid1)
            .end((err, res) => {
              res.should.have.status(401);
              res.body.should.be.a('object');
              chai.assert.isNotNull(res.body.access_token);
              done();
            });
        });
    });
  });

  after(async () => {
    // Cleanup
    // Delete all the test data which was created
    let whereOption = {
      email: 'integration@test.com',
    };
    await crudUtil.delete(userModel.User, whereOption);

    whereOption = {
      email: 'integration2@test.com',
    };
    await crudUtil.delete(userModel.User, whereOption);

    whereOption = {
      email: 'integration5@test.com',
    };
    await crudUtil.delete(userModel.User, whereOption);

    whereOption = {
      email: 'integration6@test.com',
    };
    await crudUtil.delete(userModel.User, whereOption);
  });
});
