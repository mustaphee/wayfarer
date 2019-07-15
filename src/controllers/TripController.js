/* eslint-disable class-methods-use-this */
/* eslint-disable consistent-return */
import Joi from '@hapi/joi';
import 'dotenv/config';
import { query } from '../db';

class TripController {
  async createATrip(req, res) {
    const data = req.body;
    const schema = Joi.object().keys({
      bus_id: Joi.number().integer().required(),
      origin: Joi.string().required().max(150),
      trip_date: Joi.date(),
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
    const data = req.body;
    const schema = Joi.object().keys({
      token: Joi.string(),
      user_id: Joi.number(),
      is_admin: Joi.boolean(),
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
      if (!rows) return res.status(200).json({ status: 'success', data: [] });
      res.status(200).send({ status: 'success', data: rows });
    } catch (err) {
      return res.status(400).json({ status: 'error', error: err });
    }
  }
}
module.exports = new TripController();
