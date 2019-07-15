/* eslint-disable no-undef */
import '@babel/polyfill';
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../server';

// Configure chai
chai.use(chaiHttp);
chai.should();


describe('Trips', () => {
  describe('POST /trips/', () => {
    // Test to register a user
    it('should create a user account', async () => {
      const res = await chai.request(app)
        .post('/api/v1/trips')
        .set('Content-Type', 'application/json')
        .send({
          bus_id: 3,
          origin: 'Tanke, Ilorin',
          destination: 'Gaa Odota, Ilorin',
          trip_date: new Date(),
          fare: 270.5,
          status: 'active',
        });
      expect(res.status).to.equal(201);
      // eslint-disable-next-line no-unused-expressions
      expect(res.body).should.have.property('status');
      expect(res.body.data).should.be.an('object');
      expect(res.body.status).to.equal('success');
      expect(res.body.data.fare).to.equal(270.5);
      expect(res.body.data.destiantion).to.equal('Gaa Odota, Ilorin');
      expect(res.body.data.origin).to.equal('Tanke, Ilorin');
    });
  });
});
