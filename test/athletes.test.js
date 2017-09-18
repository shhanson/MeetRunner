process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const request = require('supertest');

const app = require('../app');
const knex = require('../knex');
const testAthletes = require('../tools/testData').athletes;


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

const testAthlete = {
  email: 'test@email.com',
  first_name: 'Test',
  last_name: 'User',
  usaw_id: '3334444',
  year_of_birth: '2006',
  gender_id: 1,
  division_id: 1,
  entry_total: 50,
};

describe('routes : athletes', () => {
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
        expect(response.statusCode).to.equal(200);
        done();
      });
  });

  beforeEach((done) => {
    adminUser
      .post('/users/login')
      .send(adminCredentials)
      .end((err, response) => {
        should.not.exist(err);
        expect(response.statusCode).to.equal(200);
        done();
      });
  });

  afterEach((done) => {
    knex.migrate.rollback()
      .then(() => {
        done();
      });
  });

  afterEach((done) => {
    adminUser.put('/users/logout')
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });

  afterEach((done) => {
    authenticatedUser.put('/users/logout')
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });

  describe('GET /api/events/:event_id/athletes', () => {
    it('should allow an authenticated user to view all athletes registered for a specified event', (done) => {
      authenticatedUser.get('/api/events/1/athletes')
        .end((err, res) => {
          should.not.exist(err);
          res.should.have.status(200);
          res.body.should.be.an('array');
          expect(res.body).to.have.lengthOf(2);
          done();
        });
    });

    it('should not allow a user to view athletes in an event that the user does not own', (done) => {
      authenticatedUser.get('/api/events/3/athletes')
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });

    it('should not allow an anonymous user to view athletes', (done) => {
      request(app).get('/api/events/2/athletes')
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });
  });

  describe('POST /api/events/:event_id/athletes/new', () => {
    it('should allow a user to add an athlete to an event', (done) => {
      authenticatedUser.post('/api/events/1/athletes/new')
        .send(testAthlete)
        .end((err, res) => {
          res.should.have.status(200);
          expect(res.body).to.have.property('usaw_id').eql(testAthlete.usaw_id);
          expect(res.body).to.have.all.keys('id', 'email', 'first_name', 'last_name', 'usaw_id', 'lot_num', 'division_id', 'gender_id', 'category_id', 'total', 'entry_total', 'bodyweight_grams', 'year_of_birth');
          done();
        });
    });

    it('should not allow a user to add an athlete with incomplete info', (done) => {
      authenticatedUser.post('/api/events/1/athletes/new')
        .send({
          first_name: 'TestUser',
          last_name: 44,
          email: 'test@email.com',
        })
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });

    it('should not allow a user to add an athlete to an event the user does not own', (done) => {
      authenticatedUser.post('/api/events/3/athletes/new')
        .send(testAthlete)
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });

    it('should not allow an anonymous user to add an athlete', (done) => {
      request(app).post('/api/events/3/athletes/new')
        .send(testAthlete)
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });
  });

  describe('GET /api/events/:event_id/athletes/:athlete_id', () => {
    it('should allow a user to view an athlete', (done) => {
      authenticatedUser.get('/api/events/2/athletes/2')
        .end((err, res) => {
          res.should.have.status(200);
          expect(res.body).to.have.property('first_name').eql('Angie');
          expect(res.body).to.have.all.keys('id', 'email', 'first_name', 'last_name', 'usaw_id', 'lot_num', 'division_id', 'gender_id', 'category_id', 'total', 'entry_total', 'bodyweight_grams', 'year_of_birth');
          done();
        });
    });

    it('should not allow a user to view an athlete from an event the user does not own', (done) => {
      authenticatedUser.get('/api/events/3/athletes/3')
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });

    it('should not allow anonymous users to view an athlete', (done) => {
      request(app).get('/api/events/3/athletes/3')
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });
  });

  describe('PUT /api/events/:event_id/athletes/:athlete_id/edit', () => {
    it('should allow a user to edit all of an athlete\'s info', (done) => {
      authenticatedUser.put('/api/events/2/athletes/5/edit')
        .send(testAthlete)
        .end((err, res) => {
          res.should.have.status(200);
          expect(res.body).to.have.property('last_name').eql(testAthlete.last_name);
          expect(res.body).to.have.all.keys('id', 'email', 'first_name', 'last_name', 'usaw_id', 'lot_num', 'division_id', 'gender_id', 'category_id', 'total', 'entry_total', 'bodyweight_grams', 'year_of_birth');
          done();
        });
    });

    it('should allow a user to edit some of an athlete\'s info', (done) => {
      authenticatedUser.put('/api/events/2/athletes/2/edit')
        .send({
          first_name: testAthlete.first_name,
          last_name: testAthlete.last_name,
          division_id: 4,
          entry_total: testAthlete.entry_total,
        })
        .end((err, res) => {
          res.should.have.status(200);
          expect(res.body).to.have.property('first_name').eql(testAthlete.first_name);
          expect(res.body).to.have.property('last_name').eql(testAthlete.last_name);
          expect(res.body).to.have.property('entry_total').eql(testAthlete.entry_total);
          expect(res.body).to.have.property('division_id').eql(4);
          expect(res.body).to.have.property('email').eql(testAthletes[1].email);
          expect(res.body).to.have.property('usaw_id').eql(testAthletes[1].usaw_id);
          done();
        });
    });

    it('should not allow a user to edit an athlete in an event the user does not own', (done) => {
      authenticatedUser.put('/api/events/3/athletes/6/edit')
        .send(testAthlete)
        .end((err, res) => {
          res.should.have.status(401);
          expect(res.body).to.have.property('error');
          done();
        });
    });

    it('should not allow anonymous users to edit athletes', (done) => {
      request(app).put('/api/events/3/athletes/6/edit')
        .send(testAthlete)
        .end((err, res) => {
          res.should.have.status(401);
          expect(res.body).to.have.property('error');
          done();
        });
    });
  });

  describe('DELETE /api/events/:event_id/athletes/:athlete_id/delete', () => {
    it('should allow a user to remove an athlete from an event', (done) => {
      authenticatedUser.delete('/api/events/2/athletes/2/delete')
        .end(() => {
          authenticatedUser.get('/api/events/2/athletes')
            .end((err, res) => {
              res.should.have.status(200);
              expect(res.body).to.have.lengthOf(1);
              done();
            });
        });
    });

    it('should not allow a user to remove an athlete from an event the user does not own', (done) => {
      authenticatedUser.delete('/api/events/3/athletes/6/delete')
        .end((err, res) => {
          res.should.have.status(401);
          expect(res.body).to.have.property('error');
          done();
        });
    });

    it('should not allow an anonymous user to remove an athlete', (done) => {
      request(app).delete('/api/events/2/athletes/2/delete')
        .end((err, res) => {
          res.should.have.status(401);
          expect(res.body).to.have.property('error');
          done();
        });
    });
  });
});
