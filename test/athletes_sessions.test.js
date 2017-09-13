process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const request = require('supertest');

const app = require('../app');
const knex = require('../knex');
// const testAthletes = require('../tools/testData').athletes;


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

describe('routes : athletes_sessions', () => {
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

  describe('GET /api/events/:event_id/sessions/:session_id/athletes', () => {
    it('should allow a user to view all athletes in a session', (done) => {
      authenticatedUser.get('/api/events/1/sessions/1/athletes')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('array');
          expect(res.body).to.have.lengthOf(1);
          done();
        });
    });

    it('should not allow a user to view athletes in a session the user does not own', (done) => {
      authenticatedUser.get('/api/events/3/sessions/5/athletes')
        .end((err, res) => {
          res.should.have.status(401);
          expect(res.body).to.have.property('error');
          done();
        });
    });

    it('should not allow an anonymous user to view athletes in a session', (done) => {
      request(app).get('/api/events/3/sessions/5/athletes')
        .end((err, res) => {
          res.should.have.status(401);
          expect(res.body).to.have.property('error');
          done();
        });
    });
  });

  describe('DELETE /api/events/:event_id/sessions/:session_id/athletes/:athlete_id/remove', () => {
    it('should allow a user to remove an athlete from a session without removing the athlete from the event', (done) => {
      authenticatedUser.delete('/api/events/1/sessions/1/athletes/1/remove')
        .end((err, res) => {
          res.should.have.status(200);
          authenticatedUser.get('/api/events/1/sessions/1/athletes')
            .end((err2, res2) => {
              res2.should.have.status(200);
              res2.body.should.be.an('array');
              expect(res2.body).to.have.lengthOf(0);
              authenticatedUser.get('/api/events/1/athletes')
                .end((err3, res3) => {
                  res3.should.have.status(200);
                  res3.body.should.be.an('array');
                  expect(res3.body).to.have.lengthOf(2);
                  done();
                });
            });
        });
    });

    it('should not allow a user to remove an athlete from another user\'s session', (done) => {
      authenticatedUser.delete('/api/events/3/sessions/6/athletes/6/remove')
        .end((err, res) => {
          res.should.have.status(401);
          expect(res.body).to.have.property('error');
          done();
        });
    });

    it('should not allow an anonymous user to remove an athlete from a session', (done) => {
      request(app).delete('/api/events/3/sessions/6/athletes/6/remove')
        .end((err, res) => {
          res.should.have.status(401);
          expect(res.body).to.have.property('error');
          done();
        });
    });
  });

  describe('PUT /api/events/:event_id/sessions/:session_id/athletes/:athlete_id/edit', () => {
    it('should allow a user to edit an athlete\'s session', (done) => {
      authenticatedUser.put('/api/events/2/sessions/4/athletes/5/edit')
        .send({
          session_id: 3,
        })
        .end((err, res) => {
          res.should.have.status(200);
          expect(res.body).to.have.property('session_id', 3);
          expect(res.body).to.have.property('athlete_id', 5);
          done();
        });
    });
  });
});
