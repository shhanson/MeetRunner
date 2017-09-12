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

const adminCredentials = {
  email: 'sarah@email.com',
  password: 'coolgirl',
};

const authenticatedUser = request.agent(app);
const adminUser = request.agent(app);

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


  // describe('POST /users/login', () => {
  //
  // });

  describe('PUT /users/logout', () => {
    xit('should allow the user to logout and redirect to index', (done) => {
      authenticatedUser.put('/users/logout')
        .end((err, res) => {
          should.not.exist(err);
          res.should.have.status(302);
        });
    });
  });

  describe('GET /users/:id', () => {
    it('should return the users\'s profile information', (done) => {
      authenticatedUser.get('/users/1')
        .end((err, res) => {
          should.not.exist(err);
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
          should.not.exist(err);
          res.should.have.status(401);
          done();
        });
    });
    it('should return a 401 if a logged in user tries to access another user\'s profile', (done) => {
      authenticatedUser.get('/users/2')
        .end((err, res) => {
          should.not.exist(err);
          res.should.have.status(401);
          done();
        });
    });
  });

  describe('GET /users/:id/events', () => {
    it('should return the user\'s events', (done) => {
      authenticatedUser.get('/users/1/events')
        .end((err, res) => {
          should.not.exist(err);
          res.body.should.be.an('array');
          expect(res.body).to.have.lengthOf(2);
          done();
        });
    });
    it('should not let the user see another user\'s events', (done) => {
      authenticatedUser.get('/users/2/events')
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });
    it('should not let an anonymous user see a user\'s events', (done) => {
      request(app).get('/users/1/events')
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });
  });

  describe('PUT /users/:id/edit', () => {

  });


  describe('POST /users/new (new user registration)', () => {
    it('should allow a new user to register', (done) => {
      request(app)
        .post('/users/new')
        .send({
          email: 'newUser@test.com',
          first_name: 'Test',
          last_name: 'User',
          password: 'testpass',
        })
        .end((err, res) => {
          should.not.exist(err);
          res.should.have.status(302);
        });
      done();
    });
  });

  describe('GET /users (admin task)', () => {
    it('should allow the admin to view all registered users', (done) => {
      adminUser.get('/users')
        .end((err, res) => {
          res.should.have.status(200);
          should.not.exist(err);
          res.body.should.be.an('array');
          expect(res.body).to.have.lengthOf(2);
          done();
        });
    });

    it('should not allow non-admin users to view all users', (done) => {
      authenticatedUser.get('/users')
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });

    it('should not allow anonymous users to view all users', (done) => {
      request(app).get('/users')
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });
  });

  describe('DELETE /users/:id (admin task)', () => {
    it('should allow an admin user to delete another user', (done) => {
      adminUser.delete('/users/1')
        .end(() => {
          adminUser.get('/users')
            .end((err, res) => {
              should.not.exist(err);
              res.should.have.status(200);
              res.body.should.be.an('array');
              expect(res.body).to.have.lengthOf(1);
              done();
            });
        });
    });
    it('should not allow a non-admin user to delete users', (done) => {
      authenticatedUser.delete('/users/2')
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });
    it('should not allow an anonymous user to delete users', (done) => {
      request(app).delete('/users/2')
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });
  });
});
