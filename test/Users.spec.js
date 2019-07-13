/* eslint-disable no-undef */
import chai from 'chai';
import chaiHttp from 'chai-http';
import uuid from 'uuidv4';
import app from '../server';

// Configure chai
chai.use(chaiHttp);
chai.should();


describe('Users', () => {
  describe('POST /auth/signup', () => {
    // Test to register a user
    it('should create a user account', (done) => {
      chai.request(app)
        .post('/auth/signup')
        .set('Content-Type', 'application/json')
        .send({
          id: uuid(),
          first_name: 'Rita',
          last_name: 'Achebe',
          email: 'ritaa@testingdev.com',
          password: 'admin',
          is_admin: false,
        })
        .end((err, res) => {
          res.should.have.status(201);
          // eslint-disable-next-line no-unused-expressions
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.have.property('status');
          res.body.should.have.property('data');
          res.body.data.should.be.a('object');
          res.body.status.should.equal('success');
          res.body.data.is_admin.to.equal(false);
          res.body.user.data.email.to.equal('ritaa@testingdev.com');
          res.body.not.to.have.property('password');
          done();
        });
    });
    describe('POST /auth/signup', () => {
      // Test to fail at registering user
      it('should create a user account', (done) => {
        chai.request(app)
          .post('/auth/signup')
          .set('Content-Type', 'application/json')
          .send({
            id: uuid(),
            first_name: 'Rita',
            last_name: 'Achebe',
            email: '',
            password: 'admin',
            is_admin: false,
          })
          .end((err, res) => {
            res.should.have.status(422);
            // eslint-disable-next-line no-unused-expressions
            err.should.be.json;
            err.body.should.be.a('object');
            err.body.should.have.property('status');
            err.body.should.have.property('error');
            res.body.data.should.be.a('undefined');
            err.body.status.should.equal('error');
            done();
          });
      });
    });
  });
  describe('POST /auth/signup', () => {
    // Test to fail at registering user
    it('should not create a user account', (done) => {
      chai.request(app)
        .post('/auth/signup')
        .set('Content-Type', 'application/json')
        .send({
          id: uuid(),
          first_name: 'Rita',
          last_name: 'Achebe',
          email: 'ritaa@testingdev.com',
          password: '',
          is_admin: false,
        })
        .end((err, res) => {
          res.should.have.status(422);
          // eslint-disable-next-line no-unused-expressions
          err.should.be.json;
          err.body.should.be.a('object');
          err.body.should.have.property('status');
          err.body.should.have.property('error');
          res.body.data.should.be.a('undefined');
          err.body.status.should.equal('error');
          done();
        });
    });
  });
});
