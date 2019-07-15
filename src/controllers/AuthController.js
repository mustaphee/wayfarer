/* eslint-disable class-methods-use-this */
/* eslint-disable consistent-return */
import Joi from '@hapi/joi';
// import query from '../db';
import { Pool } from 'pg';
import 'dotenv/config';
import { hashPassword, checkPassword } from '../utils/encrypt';
import generateToken from '../utils/generateToken';

const { DATABASE_URL } = process.env;

class AuthController {
  async signUp(req, res) {
    const data = req.body;
    const schema = Joi.object().keys({
      first_name: Joi.string().required().max(30),
      last_name: Joi.string().required().max(30),
      email: Joi.string().email().required().max(50),
      password: Joi.string().regex(/^[a-zA-Z0-9]{5,30}$/).required(),
      is_admin: Joi.boolean(),
    });
    const { error, value } = Joi.validate(data, schema);
    if (error) {
      return res.status(422).send({
        status: 'error',
        error: error.message,
      });
    }
    try {
      const pool = new Pool({ connectionString: DATABASE_URL });
      const { rows } = await pool.query('SELECT * FROM users WHERE email = $1;', [req.body.email]);
      if (rows[0]) return res.status(400).json({ status: 'error', error: 'User already exists' });
      value.password = await hashPassword(req.body.password);
      if (!value.is_admin) value.is_admin = false;
      const con = [value.first_name, value.last_name, value.email, value.password, value.is_admin];
      const result = await pool.query('INSERT INTO users(first_name, last_name, email, password, is_admin) VALUES($1,$2,$3,$4,$5) RETURNING *', con);
      const returnData = {
        user_id: result.rows[0].id,
        is_admin: result.rows[0].is_admin,
        token: await generateToken(result.rows[0].id, result.rows[0].email),
        email: result.rows[0].email,
      };
      res.status(201).send({ status: 'success', data: returnData });
    } catch (err) {
      return res.status(400).json({ status: 'error', error: err });
    }
  }

  async signIn(req, res) {
    const data = req.body;
    const schema = Joi.object().keys({
      email: Joi.string().email().required().max(50),
      password: Joi.string().regex(/^[a-zA-Z0-9]{5,30}$/).required(),
    });
    const { error } = Joi.validate(data, schema);
    if (error) {
      return res.status(422).send({
        status: 'error',
        error: error.message,
      });
    } try {
      const pool = new Pool({ connectionString: DATABASE_URL });
      const { rows } = await pool.query('SELECT * FROM users WHERE email = $1;', [req.body.email]);
      if (!rows[0]) {
        return res.status(200).json({ status: 'error', error: 'User does not exist!' });
      // eslint-disable-next-line no-else-return
      } else {
        const userHash = await checkPassword(req.body.password, rows[0].password);
        if (userHash) {
          const returnData = {
            user_id: rows[0].id,
            is_admin: rows[0].is_admin,
            token: await generateToken(rows[0].id, rows[0].email),
            email: rows[0].email,
          };
          res.status(200).send({ status: 'success', data: returnData });
        } else {
          return res.status(401).json({ status: 'error', error: 'Please check your user details' });
        }
      }
    } catch (err) {
      return res.status(400).json({ status: 'error', error: err });
    }
  }
}
module.exports = new AuthController();
