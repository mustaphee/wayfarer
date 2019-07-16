/* eslint-disable no-undef */
import '@babel/polyfill';
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../server';

// Configure chai
chai.use(chaiHttp);
chai.should();
let token;
let tripId;

describe('Trips', () => {
  beforeEach(async () => {
    const { body } = await chai.request(app)
      .post('/api/v1/auth/signin')
      .set('Content-Type', 'application/json')
      .send({
        email: 'officialwebdev@gmail.com',
        password: 'admin123',
      });
    /* eslint-disable prefer-destructuring */
    token = await body.data.token;

    const resb = await chai.request(app)
      .post('/api/v1/trips')
      .set('Content-Type', 'application/json')
      .set('token', token)
      .send({
        bus_id: 5,
        origin: 'GRA, Lokoja',
        destination: 'Gwagwalada, Abuja',
        trip_date: new Date().toISOString(),
        fare: 4205.34,
        status: 'active',
      });
    tripId = await (resb.body.data.trip_id).toString();
  });
  describe('POST /trips/', () => {
    // Test to create a trip
    it('should create a trip', async () => {
      const res = await chai.request(app)
        .post('/api/v1/trips')
        .set('Content-Type', 'application/json')
        .set('token', token)
        .send({
          bus_id: 3,
          origin: 'Tanke, Ilorin',
          destination: 'Gaa Odota, Ilorin',
          trip_date: new Date().toISOString(),
          fare: 270.5,
          status: 'active',
        });
      expect(res.status).to.equal(201);
      // eslint-disable-next-line no-unused-expressions
      expect(res.body).should.have.property('status');
      expect(res.body.data).should.be.an('object');
      expect(res.body.status).to.equal('success');
      expect(res.body.data.fare).to.equal('270.5');
      expect(res.body.data.destination).to.equal('Gaa Odota, Ilorin');
      expect(res.body.data.origin).to.equal('Tanke, Ilorin');
    });
  });
  describe('POST /trips/', () => {
    // Test to not create a trip
    it('should not create a trip', async () => {
      const res = await chai.request(app)
        .post('/api/v1/trips')
        .set('Content-Type', 'application/json')
        .set('token', 'dfgdfgdffdssdadsdf')
        .send({
          bus_id: 3,
          origin: 'Tanke, Ilorin',
          destination: 'Gaa Odota, Ilorin',
          trip_date: new Date().toISOString(),
          fare: 270.5,
          status: 'active',
        });
      expect(res.status).to.equal(401);
      expect(res.body).should.have.property('status');
      expect(res.body.status).to.equal('error');
      expect(res.body.error).to.equal('Failed to authenticate token.');
    });
  });
  describe('GET /trips', () => {
    // Test to get all trips
    it('should get all trips', async () => {
      const res = await chai.request(app)
        .get('/api/v1/trips')
        .set('Content-Type', 'application/json')
        .set('token', token);
      expect(res.status).to.equal(200);
      // eslint-disable-next-line no-unused-expressions
      expect(res.body).should.have.property('status');
      expect(res.body.status).to.equal('success');
      expect(res.body.data[0].fare).to.equal('4205.34');
      expect(res.body.data[0].destination).to.equal('Gwagwalada, Abuja');
      expect(res.body.data[0].origin).to.equal('GRA, Lokoja');
    });
  });
  describe('GET /trips', () => {
    // Test to NOT get all trips
    it('should NOt get all trips', async () => {
      const res = await chai.request(app)
        .get('/api/v1/trips')
        .set('Content-Type', 'application/json')
        .set('token', 'dsfdfjfgvdfgdf');
      expect(res.status).to.equal(401);
      expect(res.body).should.have.property('status');
      expect(res.body.status).to.equal('error');
      expect(res.body.error).to.equal('Failed to authenticate token.');
    });
  });
  describe('PATCH /trips/:tripId', () => {
    // Test to cancel trip
    it('should cancel trip', async () => {
      const res = await chai.request(app)
        .patch('/api/v1/trips/'+ tripId)
        .set('Content-Type', 'application/json')
        .set('token', token);
      expect(res.status).to.equal(201);
      expect(res.body).should.have.property('status');
      expect(res.body.status).to.equal('success');
      expect(res.body.data.message).to.equal('Trip cancelled successfully');
    });
  });

  describe('PATCH /trips/:tripId', () => {
    // Test to NOT cancel trips
    it('should NOt cancel trip', async () => {
      const res = await chai.request(app)
        .patch('/api/v1/trips/'+ tripId)
        .set('Content-Type', 'application/json')
        .set('token', 'dsfdfjfgvdfgdf');
      expect(res.status).to.equal(401);
      expect(res.body).should.have.property('status');
      expect(res.body.status).to.equal('error');
      expect(res.body.error).to.equal('Failed to authenticate token.');
    });
  });

  describe('PATCH /trips/:tripId', () => {
    // Test to NOT get all trips
    it('should NOt cancel trips', async () => {
      const res = await chai.request(app)
        .patch('/api/v1/trips/' + '0')
        .set('Content-Type', 'application/json')
        .set('token', token);
      expect(res.status).to.equal(200);
      expect(res.body).should.have.property('status');
      expect(res.body.status).to.equal('error');
      expect(res.body.error).to.equal('Trip doesnt exists!');
    });
  });


});
