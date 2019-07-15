/* eslint-disable no-undef */
import '@babel/polyfill';
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../server';

// Configure chai
chai.use(chaiHttp);
chai.should();


describe('Users', () => {
  describe('POST /auth/signup/', () => {
    // Test to register a user
    it('should create a user account', async () => {
      const res1 = await chai.request(app)
        .post('/api/v1/auth/signup/')
        .set('Content-Type', 'application/json')
        .send({
          first_name: 'Rita',
          last_name: 'Achebe',
          email: 'ritfog@testingdevs.com',
          password: 'admin',
        });
      expect(res1.status).to.equal(201);
      // eslint-disable-next-line no-unused-expressions
      expect(res1.body).should.have.property('status');
      expect(res1.body.data).should.be.an('object');
      expect(res1.body.status).to.equal('success');
      expect(res1.body.data.is_admin).to.equal(false);
      expect(res1.body.data.email).to.equal('ritfog@testingdevs.com');
      expect(res1.body.data).not.to.have.property('password');
    });
  });
  describe('POST /auth/signup', () => {
    // Test to fail at registering user
    it('should not create a user account', async () => {
      const res2 = await chai.request(app)
        .post('/api/v1/auth/signup/')
        .set('Content-Type', 'application/json')
        .send({
          first_name: 'Rita',
          last_name: 'Achebe',
          email: '',
          password: 'adadsd',
        });
      expect(res2.status).to.equal(422);
      // eslint-disable-next-line no-unused-expressions
      expect(res2.body).should.be.an('object');
      expect(res2.body).should.have.property('status');
      expect(res2.body.status).to.equal('error');
      expect(res2.body).not.to.have.property('data');
    });
  });
  describe('POST /auth/signup', () => {
    // Test to check user already exists
    // I will test using the default admin email
    it('should not create a user account', async () => {
      const res3 = await chai.request(app)
        .post('/api/v1/auth/signup/')
        .set('Content-Type', 'application/json')
        .send({
          first_name: 'Rita',
          last_name: 'Achebe',
          email: 'officialwebdev@gmail.com',
          password: 'adadsd',
        });
      expect(res3.status).to.equal(400);
      // eslint-disable-next-line no-unused-expressions
      expect(res3.body).should.be.an('object');
      expect(res3.body).should.have.property('status');
      expect(res3.body.status).to.equal('error');
      expect(res3.body).not.to.have.property('data');
    });
  });
  describe('POST /auth/signin/', () => {
    // Test to register a user
    it('should sign in a user', async () => {
      const res1 = await chai.request(app)
        .post('/api/v1/auth/signin/')
        .set('Content-Type', 'application/json')
        .send({
          email: 'officialwebdev@gmail.com',
          password: 'admin123',
        });
      expect(res1.status).to.equal(200);
      // eslint-disable-next-line no-unused-expressions
      expect(res1.body).should.have.property('status');
      expect(res1.body.data).should.be.an('object');
      expect(res1.body.status).to.equal('success');
      expect(res1.body.data.is_admin).to.equal(true);
      expect(res1.body.data.email).to.equal('officialwebdev@gmail.com');
      expect(res1.body.data).not.to.have.property('password');
    });
  });
  describe('POST /auth/signin', () => {
    // Test to sign in with wrong password
    it('should not create a user account', async () => {
      const res2 = await chai.request(app)
        .post('/api/v1/auth/signin/')
        .set('Content-Type', 'application/json')
        .send({
          email: 'officialwebdev@gmail.com',
          password: 'adminerr',
        });
      expect(res2.status).to.equal(401);
      // eslint-disable-next-line no-unused-expressions
      expect(res2.body).should.be.an('object');
      expect(res2.body).should.have.property('status');
      expect(res2.body.status).to.equal('error');
      expect(res2.body.error).to.equal('Please check your user details');
      expect(res2.body).not.to.have.property('data');    
    });
  });
  describe('POST /auth/signin', () => {
    // Test to check if user exists already exists
    it('should not create a user account', async () => {
      const res3 = await chai.request(app)
        .post('/api/v1/auth/signin/')
        .set('Content-Type', 'application/json')
        .send({
          email: 'officialwebdever@gmail.com',
          password: 'adadsd',
        });
      expect(res3.status).to.equal(200);
      // eslint-disable-next-line no-unused-expressions
      expect(res3.body).should.be.an('object');
      expect(res3.body).should.have.property('status');
      expect(res3.body.status).to.equal('error');
      expect(res3.body.error).to.equal('User does not exist!');
      expect(res3.body).not.to.have.property('data');
    });
  });


});
