process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index');

// Configure chai
chai.use(chaiHttp);
chai.should();

describe('product', () => {
  describe('GET /', () => {
    // Test to get all students record
    it('should get all products', (done) => {
      chai.request(app)
        .get('/profile')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          done();
        });
    });
  });
});
