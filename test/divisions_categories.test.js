process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const request = require('supertest');

const app = require('../app');
const knex = require('../knex');

const should = chai.should();
const expect = chai.expect;

chai.use(chaiHttp);

describe('routes : divisions, categories', () => {
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

  describe('GET /api/divisions/', () => {
    it('should return a list of all divisions', (done) => {
      request(app).get('/api/divisions')
        .end((err, res) => {
          should.not.exist(err);
          res.should.have.status(200);
          res.body.should.be.an('array');
          expect(res.body).to.have.lengthOf(4);
          done();
        });
    });
  });

  describe('GET /api/divisions/:division_id', () => {
    it('should return a specified division', (done) => {
      request(app).get('/api/divisions/3')
        .end((err, res) => {
          should.not.exist(err);
          res.should.have.status(200);
          expect(res.body).to.have.property('division').eql('senior');
          done();
        });
    });
  });

  describe('GET /api/categories', () => {
    it('should return a list of all categories', (done) => {
      request(app).get('/api/categories')
        .end((err, res) => {
          should.not.exist(err);
          res.should.have.status(200);
          res.body.should.be.an('array');
          expect(res.body).to.have.lengthOf(19);
          done();
        });
    });
  });

  describe('GET /api/categories/:category_id', () => {
    it('should return a specified category', (done) => {
      request(app).get('/api/categories/11')
        .end((err, res) => {
          should.not.exist(err);
          res.should.have.status(200);
          expect(res.body).to.have.property('category').eql('75+');
          done();
        });
    });
  });

  describe('GET /api/divisions/:division_id/categories/male', () => {
    it('should return all male categories within the given division', (done) => {
      request(app).get('/api/divisions/1/categories/male')
        .end((err, res) => {
          should.not.exist(err);
          res.should.have.status(200);
          res.body.should.be.an('array');
          expect(res.body).to.have.lengthOf(8);
          done();
        });
    });
  });

  describe('GET /api/divisions/:division_id/categories/female', () => {
    it('should return all female categories within the given division', (done) => {
      request(app).get('/api/divisions/1/categories/female')
        .end((err, res) => {
          should.not.exist(err);
          res.should.have.status(200);
          res.body.should.be.an('array');
          expect(res.body).to.have.lengthOf(8);
          done();
        });
    });
  });
});
