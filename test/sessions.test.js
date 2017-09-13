process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const request = require('supertest');

const app = require('../app');
const knex = require('../knex');
const testSessions = require('../tools/testData').sessions;


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

const testSession = {
  date: '2018-08-08',
  weigh_time: '2018-08-08 13:00:00+06',
  start_time: '2018-08-08 15:00:00+06',
  description: 'Mens Session B',
};

const editedSession = {
  date: '2018-08-09',
  weigh_time: '2018-08-09 14:00:00+06',
  start_time: '2018-08-09 16:00:00+06',
  description: 'Mens Session C',
};

describe('routes : sessions', () => {
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

  describe('GET /api/events/:event_id/sessions', () => {
    it('should allow an anonymous user to view an event\'s sessions', (done) => {
      request(app).get('/api/events/1/sessions')
        .end((err, res) => {
          should.not.exist(err);
          res.should.have.status(200);
          res.body.should.be.an('array');
          expect(res.body).to.have.lengthOf(2);
          done();
        });
    });

    it('should allow an autheticated user to view an event\'s sessions', (done) => {
      authenticatedUser.get('/api/events/2/sessions')
        .end((err, res) => {
          should.not.exist(err);
          res.should.have.status(200);
          res.body.should.be.an('array');
          expect(res.body).to.have.lengthOf(1);
          done();
        });
    });
  });

  describe('POST /api/events/:event_id/sessions/new', () => {
    it('should allow an authenticated user to create a new session for an event', (done) => {
      authenticatedUser.post('/api/events/1/sessions/new')
        .send(testSession)
        .end((err, res) => {
          should.not.exist(err);
          res.should.have.status(200);
          res.body.should.have.property('description').eql(testSession.description);
          expect(res.body).to.have.all.keys('id', 'event_id', 'date', 'start_time', 'weigh_time', 'description', 'created_at', 'updated_at');
          done();
        });
    });

    it('should not allow an authenticated user to add a session to an event they do not own', (done) => {
      authenticatedUser.post('/api/events/3/sessions/new')
        .send(testSession)
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });

    it('should not allow an anonymous user to create a new session', (done) => {
      request(app).post('/api/events/2/sessions/new')
        .send(testSession)
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });
  });

  describe('GET /:event_id/sessions/:session_id', () => {
    it('should allow an anonymous user to view a specified session', (done) => {
      request(app).get('/api/events/1/sessions/1')
        .end((err, res) => {
          should.not.exist(err);
          res.should.have.status(200);
          res.body.should.have.property('date').eql('2017-11-11T06:00:00.000Z');
          expect(res.body).to.have.all.keys('id', 'event_id', 'date', 'start_time', 'weigh_time', 'description', 'created_at', 'updated_at');
          done();
        });
    });

    it('should allow an authenticated user to view a specified session', (done) => {
      authenticatedUser.get('/api/events/1/sessions/1')
        .end((err, res) => {
          should.not.exist(err);
          res.should.have.status(200);
          res.body.should.have.property('date').eql('2017-11-11T06:00:00.000Z');
          expect(res.body).to.have.all.keys('id', 'event_id', 'date', 'start_time', 'weigh_time', 'description', 'created_at', 'updated_at');
          done();
        });
    });
  });

  describe('PUT /:event_id/sessions/:session_id/edit', () => {
    it('should allow a user to edit all of a session\'s info', (done) => {
      authenticatedUser.put('/api/events/2/sessions/3/edit')
        .send(editedSession)
        .end((err, res) => {
          should.not.exist(err);
          res.should.have.status(200);
          res.body.should.have.property('description').eql(editedSession.description);
          expect(res.body).to.have.all.keys('id', 'event_id', 'date', 'start_time', 'weigh_time', 'description', 'created_at', 'updated_at');
          done();
        });
    });

    it('should allow a user to edit only some of a session\'s info', (done) => {
      authenticatedUser.put('/api/events/1/sessions/2/edit')
        .send({ description: 'new description' })
        .end((err, res) => {
          should.not.exist(err);
          res.should.have.status(200);
          res.body.should.have.property('description').eql('new description');
          res.body.should.have.property('start_time').eql('2017-11-11T20:30:00.000Z');
          expect(res.body).to.have.all.keys('id', 'event_id', 'date', 'start_time', 'weigh_time', 'description', 'created_at', 'updated_at');
          done();
        });
    });

    it('should not allow a user to edit a session they do not own', (done) => {
      authenticatedUser.put('/api/events/3/sessions/4/edit')
        .send(editedSession)
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });

    it('should not allow an anonymous user to edit a session', (done) => {
      request(app).put('/api/events/2/sessions/3/edit')
        .send(editedSession)
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });
  });

  describe('DELETE /:event_id/sessions/:session_id/delete', () => {
    it('should allow a user to delete a session', (done) => {
      authenticatedUser.delete('/api/events/1/sessions/2/delete')
        .end(() => {
          authenticatedUser.get('/api/events/1/sessions')
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.an('array');
              expect(res.body).to.have.lengthOf(1);
              done();
            });
        });
    });

    it('should not allow a user to delete a session they do not own', (done) => {
      authenticatedUser.delete('/api/events/3/sessions/4/delete')
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });

    it('should not allow an anonymous user to delete a session', (done) => {
      request(app).delete('/api/events/1/sessions/2/delete')
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });
  });
});
