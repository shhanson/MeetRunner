process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');

const app = require('../../app');
const knex = require('../../knex');
const testUsers = require('../../tools/testData').users;

const should = chai.should();

chai.use(chaiHttp);

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

  afterEach((done) => {
    knex.migrate.rollback()
      .then(() => {
        done();
      });
  });

  describe('GET /users/:id', () => {
    it('should return all of the given user\'s events and return a success response', (done) => {
      chai.request(app)
        .get('/users/1')
        .end((err, res) => {
          should.not.exist(err);
          res.status.should.equal(200);
          done();
        });
    });
  });
});
