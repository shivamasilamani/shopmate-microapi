process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index');

// Configure chai
chai.use(chaiHttp);
chai.should();

describe('user', () => {
  describe('POST /', () => {
    // Test to get all students record
    it('should create new user', (done) => {
      chai.request(app)
        .post('/signup')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          done();
        });
    });
  });

  describe('POST /', () => {
    // Test to get all students record
    it('should create new user', (done) => {
      chai.request(app)
        .post('/signup')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          done();
        });
    });
  });

  describe('POST /', () => {
    // Test to get all students record
    it('should create new user', (done) => {
      chai.request(app)
        .post('/signup')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          done();
        });
    });
  });
});
