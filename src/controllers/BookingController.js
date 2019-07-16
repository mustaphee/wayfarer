/* eslint-disable class-methods-use-this */
/* eslint-disable consistent-return */
/* eslint-disable no-else-return */
import Joi from '@hapi/joi';
import 'dotenv/config';
import { query } from '../db';

class BookingController {
  async bookASeat(req, res) {
    console.log('<<<<<<<============BOOK A SEAT ENDPOINT========>>>>>>>>>');
    console.log(req.body);
    console.log(req.token);
    const data = req.body;
    const schema = Joi.object().keys({
      Authorization: Joi.string(),
      token: Joi.string(),
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
      const { id, details } = req.decoded;
      const { rows } = await query('SELECT * FROM trips WHERE id = $1;', [req.body.trip_id]);
      const con = [id, value.trip_id, rows[0].bus_id,
        details.first_name, details.last_name, details.email, rows[0].trip_date];
      const result = await query('INSERT INTO bookings(user_id, trip_id, bus_id, first_name, last_name, email, trip_date) VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING *', con);
      const returnData = {
        booking_id: result.rows[0].id,
        user_id: result.rows[0].user_id,
        trip_id: result.rows[0].trip_id,
        bus_id: result.rows[0].bus_id,
        trip_date: result.rows[0].trip_date,
        seat_number: result.rows[0].seat_number,
        first_name: result.rows[0].first_name,
        last_name: result.rows[0].last_name,
        email: result.rows[0].email,
      };
      res.status(201).send({ status: 'success', data: returnData });
    } catch (err) {
      return res.status(400).json({ status: 'error', error: err });
    }
  }

  async getBookings(req, res) {
    console.log('<<<<<<<============GET ALL BOOKING ENDPOINT========>>>>>>>>>');
    console.log(req.body);
    console.log(req.token);
    const data = req.body;
    const schema = Joi.object().keys({
      token: Joi.string(),
      Authorization: Joi.string(),
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
      if (req.decoded.isAdmin) {
        const { rows } = await query('SELECT * from bookings');
        return res.status(200).send({ status: 'success', data: rows });
      } else {
        const { rows } = await query('SELECT * from bookings WHERE id = $1', [req.decoded.id]);
        if (!rows[0]) return res.status(200).json({ status: 'success', data: [] });
        res.status(200).send({ status: 'success', data: rows });
      }
    } catch (err) {
      return res.status(400).json({ status: 'error', error: err });
    }
  }
}
module.exports = new BookingController();
