process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const request = require('supertest');

const app = require('../app');
const knex = require('../knex');
const testAttempts = require('../tools/testData').attempts;


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

describe('routes : attempts', () => {
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

  describe('GET /api/events/:event_id/athletes/:athlete_id/attempts', () => {
    it('should allow the user to view all of an athlete\'s attempts', (done) => {
      authenticatedUser.get('/api/events/1/athletes/1/attempts')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('array');
          expect(res.body).to.have.lengthOf(6);
          done();
        });
    });

    it('should not allow a user to view attempts within an event the user does not own', (done) => {
      authenticatedUser.get('/api/events/3/athletes/3/attempts')
        .end((err, res) => {
          res.should.have.status(401);
          expect(res.body).to.have.property('error');
          done();
        });
    });

    it('should not allow an anonymous user to view attempts', (done) => {
      request(app).get('/api/events/3/athletes/3/attempts')
        .end((err, res) => {
          res.should.have.status(401);
          expect(res.body).to.have.property('error');
          done();
        });
    });
  });

  describe('GET /api/events/:event_id/athletes/:athlete_id/attempts/:attempt_id', () => {
    it('should allow a user to view a single attempt', (done) => {
      authenticatedUser.get('/api/events/1/athletes/1/attempts/21')
        .end((err, res) => {
          res.should.have.status(200);
          expect(res.body).to.have.property('weight').eql(testAttempts[19].weight);
          expect(res.body).to.have.property('id').eql(21);
          expect(res.body).to.have.all.keys('id', 'weight', 'attempt_num', 'created_at', 'updated_at', 'athlete_id', 'type', 'attempted', 'success');
          done();
        });
    });

    it('should not allow a user to view an attempt in an event the user does not own', (done) => {
      authenticatedUser.get('/api/events/3/athletes/3/attempts/7')
        .end((err, res) => {
          res.should.have.status(401);
          expect(res.body).to.have.property('error');
          done();
        });
    });

    it('should not allow an anonymous user to view an attempt', (done) => {
      request(app).get('/api/events/3/athletes/3/attempts/7')
        .end((err, res) => {
          res.should.have.status(401);
          expect(res.body).to.have.property('error');
          done();
        });
    });
  });

  describe('POST /api/events/:event_id/athletes/:athlete_id/attempts/new', () => {
    it('should allow a user to create a new attempt for an athlete', (done) => {
      authenticatedUser.post('/api/events/2/athletes/2/attempts/new')
        .send({ type: 'snatch', athlete_id: 2, attempt_num: 3, weight: 60 })
        .end((err, res) => {
          res.should.have.status(200);
          expect(res.body).to.have.property('type').eql('snatch');
          expect(res.body).to.have.all.keys('id', 'weight', 'attempt_num', 'created_at', 'updated_at', 'athlete_id', 'type', 'attempted', 'success');
          done();
        });
    });

    it('should not allow a user to create an attempt within an event the user does not own', (done) => {
      authenticatedUser.post('/api/events/3/athletes/3/attempts/new')
        .send({ type: 'jerk', athlete_id: 3, attempt_num: 2, weight: 100 })
        .end((err, res) => {
          res.should.have.status(401);
          expect(res.body).to.have.property('error');
          done();
        });
    });

    it('should not allow an anonymous user to create an attempt', (done) => {
      request(app).post('/api/events/3/athletes/3/attempts/new')
        .send({ type: 'jerk', athlete_id: 3, attempt_num: 2, weight: 100 })
        .end((err, res) => {
          res.should.have.status(401);
          expect(res.body).to.have.property('error');
          done();
        });
    });
  });

  describe('PUT /api/events/:event_id/athletes/:athlete_id/attempts/:attempt_id/edit', () => {
    it('should allow a user to edit some information of an attempt', (done) => {
      authenticatedUser.put('/api/events/2/athletes/2/attempts/2/edit')
        .send({ weight: 61, attempted: true })
        .end((err, res) => {
          res.should.have.status(200);
          expect(res.body).to.have.property('weight').eql(61);
          expect(res.body).to.have.property('attempted').eql(true);
          expect(res.body).to.have.property('success').eql(false);
          expect(res.body).to.have.property('type').eql('snatch');
          expect(res.body).to.have.all.keys('id', 'weight', 'attempt_num', 'created_at', 'updated_at', 'athlete_id', 'type', 'attempted', 'success');
          done();
        });
    });

    it('should not allow a user to edit an attempt within an event the user does not own', (done) => {
      authenticatedUser.put('/api/events/3/athletes/3/attempts/9/edit')
        .send({ weight: 61 })
        .end((err, res) => {
          res.should.have.status(401);
          expect(res.body).to.have.property('error');
          done();
        });
    });

    it('should not allow an anonymous user to edit an attempt', (done) => {
      request(app).put('/api/events/3/athletes/3/attempts/9/edit')
        .send({ weight: 61 })
        .end((err, res) => {
          res.should.have.status(401);
          expect(res.body).to.have.property('error');
          done();
        });
    });
  });

  describe('DELETE /api/events/:event_id/athletes/:athlete_id/attempts/:attempt_id/delete', () => {
    it('should allow a user to delete an attempt', (done) => {
      authenticatedUser.delete('/api/events/2/athletes/2/attempts/5/delete')
        .end((err, res) => {
          res.should.have.status(200);
          authenticatedUser.get('/api/events/2/athletes/2')
            .end((err2, res2) => {
              res2.should.have.status(200);
              expect(res2.body).to.have.property('id').eql(2);
              done();
            });
        });
    });

    it('should not allow a user to delete an attempt within an event the user does not own', (done) => {
      authenticatedUser.delete('/api/events/3/athletes/3/attempts/9/delete')
        .end((err, res) => {
          res.should.have.status(401);
          expect(res.body).to.have.property('error');
          done();
        });
    });

    it('should not allow an anonymous user to delete an attempt', (done) => {
      request(app).delete('/api/events/3/athletes/3/attempts/9/delete')
        .end((err, res) => {
          res.should.have.status(401);
          expect(res.body).to.have.property('error');
          done();
        });
    });
  });
});
