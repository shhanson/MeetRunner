process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const request = require('supertest');

const app = require('../app');
const knex = require('../knex');
const testEvents = require('../tools/testData').events;


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

const testEvent = {
  title: 'Test title',
  organizer: 'Test user',
  sanction_id: 'test_id',
  start_date: '2018-01-01',
  end_date: '2018-01-01',
  street_address: '123 Test Address',
  city: 'Test city',
  state: 'TX',
  zip_code: '55555',
  phone: '1234567890',
  email: 'test@email.com',
  description: 'TEST EVENT DETAIL!',
  entry_fee_cents: 4500,
};

const editedEvent = {
  title: 'Edited Test title',
  organizer: 'Edited Test user',
  sanction_id: 'Edited test_id',
  start_date: '2018-05-01',
  end_date: '2018-05-02',
  street_address: '123 Edit Address',
  city: 'Edited city',
  state: 'NM',
  zip_code: '44444',
  phone: '0123456789',
  email: 'edited@email.com',
  description: 'EDITED TEST EVENT DETAIL!',
  entry_fee_cents: 6500,
};

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
        expect(res.body).to.have.property('loggedIn').eql(false);
        done();
      });
  });

  afterEach((done) => {
    authenticatedUser.put('/users/logout')
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body).to.have.property('loggedIn').eql(false);
        done();
      });
  });

  describe('GET /api/events', () => {
    it('should allow anonymous users to view all events in the system', (done) => {
      request(app).get('/api/events')
        .end((err, res) => {
          should.not.exist(err);
          res.should.have.status(200);
          res.body.should.be.an('array');
          expect(res.body).to.have.lengthOf(3);
          done();
        });
    });

    it('should allow logged in users to view all events in the system', (done) => {
      authenticatedUser.get('/api/events')
        .end((err, res) => {
          should.not.exist(err);
          res.should.have.status(200);
          res.body.should.be.an('array');
          expect(res.body).to.have.lengthOf(3);
          done();
        });
    });
  });

  describe('GET /api/events/:id', () => {
    it('should allow anonymous users to view a single event\'s info', (done) => {
      request(app).get('/api/events/2')
        .end((err, res) => {
          should.not.exist(err);
          res.should.have.status(200);
          res.body.should.have.property('title').eql('Naturally Fit Games');
          expect(res.body).to.have.all.keys('id', 'title', 'organizer', 'sanction_id', 'start_date', 'end_date', 'street_address', 'city', 'zip_code', 'email', 'phone', 'description', 'entry_fee_cents', 'state', 'updated_at', 'created_at');
          done();
        });
    });

    it('should allow logged in users to view a single event\'s info', (done) => {
      authenticatedUser.get('/api/events/2')
        .end((err, res) => {
          should.not.exist(err);
          res.should.have.status(200);
          res.body.should.have.property('title').eql('Naturally Fit Games');
          expect(res.body).to.have.all.keys('id', 'title', 'organizer', 'sanction_id', 'start_date', 'end_date', 'street_address', 'city', 'zip_code', 'email', 'phone', 'description', 'entry_fee_cents', 'state', 'updated_at', 'created_at');
          done();
        });
    });
  });

  describe('POST /api/events/new', () => {
    it('should allow a logged-in user to create a new event', (done) => {
      authenticatedUser.post('/api/events/new')
        .send(testEvent)
        .end((err, res) => {
          should.not.exist(err);
          res.should.have.status(200);
          expect(res.body).to.have.property('title').eql(testEvent.title);
          expect(res.body).to.have.all.keys('id', 'title', 'organizer', 'sanction_id', 'start_date', 'end_date', 'street_address', 'city', 'zip_code', 'email', 'phone', 'description', 'entry_fee_cents', 'state', 'updated_at', 'created_at');
          done();
        });
    });

    it('should not allow an event to be created with incomplete information', (done) => {
      authenticatedUser.post('/api/events/new')
        .send({ title: 'Bad event', description: 'Incomplete data!' })
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });

    it('should not allow an anonymous user to create a new event', (done) => {
      request(app).post('/api/events/new')
        .send(testEvent)
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });
  });

  describe('PUT /api/events/:id/edit', () => {
    it('should allow a user to edit all of an event\'s info', (done) => {
      authenticatedUser.put('/api/events/1/edit')
        .send(editedEvent)
        .end((err, res) => {
          res.should.have.status(200);
          expect(res.body).to.have.property('title').eql(editedEvent.title);
          expect(res.body).to.have.all.keys('id', 'title', 'organizer', 'sanction_id', 'start_date', 'end_date', 'street_address', 'city', 'zip_code', 'email', 'phone', 'description', 'entry_fee_cents', 'state', 'updated_at', 'created_at');
          done();
        });
    });

    it('should allow a user to edit some of an event\'s info', (done) => {
      authenticatedUser.put('/api/events/1/edit')
        .send({ zip_code: '22334', description: 'new description', organizer: 'Hyde Park Gym' })
        .end((err, res) => {
          res.should.have.status(200);
          expect(res.body).to.have.property('description').eql('new description');
          expect(res.body).to.have.property('street_address').eql(testEvents[0].street_address);
          expect(res.body).to.have.all.keys('id', 'title', 'organizer', 'sanction_id', 'start_date', 'end_date', 'street_address', 'city', 'zip_code', 'email', 'phone', 'description', 'entry_fee_cents', 'state', 'updated_at', 'created_at');
          done();
        });
    });

    it('should not allow a user to edit another user\'s event', (done) => {
      authenticatedUser.put('/api/events/3/edit')
        .send(editedEvent)
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });

    it('should not allow an anonymous user to edit an event', (done) => {
      request(app).put('/api/events/1/edit')
        .send(editedEvent)
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });
  });

  describe('DELETE /api/events/:id/delete', () => {
    it('should allow a user to delete an event', (done) => {
      authenticatedUser.delete('/api/events/2/delete')
        .end(() => {
          authenticatedUser.get('/users/1/events')
            .end((err, res) => {
              should.not.exist(err);
              res.should.have.status(200);
              res.body.should.be.an('array');
              expect(res.body).to.have.lengthOf(1);
              expect(res.body[0]).to.have.property('id').eql(1);
              done();
            });
        });
    });

    it('should not allow a user to delete another user\'s event', (done) => {
      authenticatedUser.delete('/api/events/3/delete')
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });

    it('should not allow an anonymous user to delete an event', (done) => {
      request(app).delete('/api/events/3/delete')
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });
  });
});
