/* eslint-disable class-methods-use-this */
/* eslint-disable consistent-return */
import Joi from '@hapi/joi';
import 'dotenv/config';
import { query } from '../db';

class TripController {
  async createATrip(req, res) {
    console.log('<<<<<<<============CREATE A TRIP ENDPOINT========>>>>>>>>>');
    console.log(req.body);
    console.log(req.token);
    const data = req.body;
    const schema = Joi.object().keys({
      Authorization: Joi.string(),
      token: Joi.string(),
      bus_id: Joi.number().integer().required(),
      origin: Joi.string().required().max(150),
      trip_date: Joi.string(),
      destination: Joi.string().required().max(150),
      fare: Joi.number().required(),
      status: Joi.string().max(10),
    });
    const { error, value } = Joi.validate(data, schema);
    if (error) {
      return res.status(422).send({
        status: 'error',
        error: error.message,
      });
    }
    try {
      // const pool = new Pool({ connectionString: DATABASE_URL });
      if (!value.status) value.status = 'active';
      if (!value.trip_date) value.trip_date = new Date().toISOString();
      const con = [value.bus_id, value.origin, value.destination,
        value.trip_date, value.fare, value.status];
      const result = await query('INSERT INTO trips(bus_id, origin, destination, trip_date, fare, status) VALUES($1,$2,$3,$4,$5, $6) RETURNING *', con);
      const returnData = {
        id: result.rows[0].id,
        trip_id: result.rows[0].id,
        bus_id: result.rows[0].bus_id,
        origin: result.rows[0].origin,
        destination: result.rows[0].destination,
        trip_date: result.rows[0].trip_date,
        fare: result.rows[0].fare,
        status: result.rows[0].status,
      };
      res.status(201).send({ status: 'success', data: returnData });
    } catch (err) {
      return res.status(400).json({ status: 'error', error: err });
    }
  }

  async getAllTrips(req, res) {
    console.log('<<<<<<<============GET ALL TRIP ENDPOINT========>>>>>>>>>');
    console.log(req.body);
    console.log(req.token);
    const data = req.body;
    const schema = Joi.object().keys({
      token: Joi.string(),
      Authorization: Joi.string(),
      // user_id: Joi.number(),
      // is_admin: Joi.boolean(),
    });
    const { error } = Joi.validate(data, schema);
    if (error) {
      return res.status(422).send({
        status: 'error',
        error: error.message,
      });
    }
    try {
      const { rows } = await query('SELECT * from trips');
      if (!rows[0]) return res.status(200).json({ status: 'success', data: [] });
      res.status(200).send({ status: 'success', data: rows });
    } catch (err) {
      return res.status(400).json({ status: 'error', error: err });
    }
  }

  async cancelTrip(req, res) {
    console.log('<<<<<<<============CANCEL TRIP ENDPOINT========>>>>>>>>>');
    console.log(req.body);
    console.log(req.token);
    const data = { trip_id: parseInt(req.params.tripId) };
    const schema = Joi.object().keys({
      token: Joi.string(),
      user_id: Joi.number(),
      is_admin: Joi.boolean(),
      trip_id: Joi.number().integer().required(),
    });
    const { error, value } = Joi.validate(data, schema);
    if (error) {
      return res.status(422).send({
        status: 'error',
        error: error.message,
      });
    }
    try {
      const { rows } = await query('SELECT * FROM trips WHERE id = $1;', [value.trip_id]);
      if (!rows[0]) return res.status(200).json({ status: 'error', error: 'Trip doesnt exists!' });
      await query('UPDATE trips SET status = $1 WHERE id = $2 ', ['cancelled', value.trip_id]);
      res.status(201).send({ status: 'success', data: { message: 'Trip cancelled successfully' } });
    } catch (err) {
      return res.status(400).json({ status: 'error', error: err });
    }
  }

  async filterTripsByDestination(req, res) {
    const data = { token: req.headers.token, destination: req.params.destination };
    const schema = Joi.object().keys({ token: Joi.string(), destination: Joi.string().required() });
    const { error } = Joi.validate(data, schema);
    if (error) return res.status(422).send({ status: 'error', error: error.message });
    try {
      const { rows } = await query('SELECT * from trips WHERE destination is $1', ['data.destination']);
      if (!rows[0]) return res.status(200).json({ status: 'success', data: 'You have no booking for this destination' });
      res.status(200).send({ status: 'success', data: rows });
    } catch (err) {
      return res.status(400).json({ status: 'error', error: err });
    }
  }

  async filterTripsByOrigin(req, res) {
    const data = { token: req.headers.token, origin: req.params.origin };
    const schema = Joi.object().keys({ token: Joi.string(), origin: Joi.string().required() });
    const { error } = Joi.validate(data, schema);
    if (error) return res.status(422).send({ status: 'error', error: error.message });
    try {
      const { rows } = await query('SELECT * from trips WHERE origin is $1', ['data.destination']);
      if (!rows[0]) return res.status(200).json({ status: 'success', data: 'You have no booking for this origin' });
      res.status(200).send({ status: 'success', data: rows });
    } catch (err) {
      return res.status(400).json({ status: 'error', error: err });
    }
  }
}
module.exports = new TripController();
