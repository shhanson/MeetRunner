process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const request = require('supertest');

const app = require('../app');
const knex = require('../knex');
// const testUsers = require('../tools/testData').users;
const testEvents = require('../toosl/testData').events;

const should = chai.should();
const expect = chai.expect;

chai.use(chaiHttp);

const userCredentials = {
  email: 'david@email.com',
  password: 'abc123',
};

const adminCredentials = {
  email: 'sarah@email.com',
  password: 'coolgirl',
};

const authenticatedUser = request.agent(app);
const adminUser = request.agent(app);

describe('routes : events', () => {
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

  beforeEach((done) => {
    adminUser
      .post('/users/login')
      .send(adminCredentials)
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

  describe('GET /api/events', () => {
    it('should allow anonymous users to view all events in the system', (done) => {
      done();
    });

    it('should allow logged in users to view all events in the system', (done) => {
      done();
    });
  });

  describe('GET /api/events/:id', () => {
    it('should allow anonymous users to view a single event\'s info', (done) => {
      done();
    });

    it('should allow logged in users to view a single event\'s info', (done) => {
      done();
    });
  });

  describe('POST /api/events/', () => {
    it('should allow a logged-in user to create a new event', (done) => {
      done();
    });

    it('should not allow an event to be created with incomplete information', (done) => {
      done();
    });

    it('should not allow an anonymous user to create a new event', (done) => {
      done();
    });
  });

  describe('PUT /api/events/:id', () => {
    it('should allow a user to edit all of an event\'s info', (done) => {
      done();
    });

    it('should allow a user to edit some of an event\'s info', (done) => {
      done();
    });

    it('should not allow a user to edit another user\'s event', (done) => {
      done();
    });

    it('should not allow an anonymous user to edit an event', (done) => {
      done();
    });
  });

  describe('DELETE /api/events/:id/delete', () => {
    it('should allow a user to delete an event', (done) => {
      done();
    });

    it('should not allow a user to delete another user\'s event', (done) => {
      done();
    });

    it('should not allow an anonymous user to delete an event', (done) => {
      done();
    });
  });
});
