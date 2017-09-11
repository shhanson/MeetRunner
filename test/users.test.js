process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const request = require('supertest');

const app = require('../app');
const knex = require('../knex');
const testUsers = require('../tools/testData').users;

const should = chai.should();
const expect = chai.expect;

chai.use(chaiHttp);

const userCredentials = {
  email: 'david@email.com',
  password: 'abc123',
};

const authenticatedUser = request.agent(app);

describe('routes : users', () => {
  beforeEach((done) => {
    knex.migrate.rollback()
      .then(() => {
        knex.migrate.latest()
          .then(() => {
            knex.seed.run()
              .then(() => {
                done();
              });
          });
      });
  });

  beforeEach((done) => {
    authenticatedUser
      .post('/users/login')
      .send(userCredentials)
      .end((err, response) => {
        should.not.exist(err);
        expect(response.statusCode).to.equal(302);
        done();
      });
  });

  afterEach((done) => {
    knex.migrate.rollback()
      .then(() => {
        done();
      });
  });

  describe('GET /users/:id', () => {
    it('should return the users\'s profile information', (done) => {
      authenticatedUser.get('/users/1')
        // .expect(200, done);
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('first_name').eql(testUsers[0].first_name);
          res.body.should.have.property('last_name').eql(testUsers[0].last_name);
          done();
        });
    });
    it('should return a 401 error if the user is not logged in', (done) => {
      request(app)
        .get('/users/1')
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });
    it('should return a 401 if a logged in user tries to access another user\'s profile', (done) => {
      authenticatedUser.get('/users/2')
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });
  });
});
