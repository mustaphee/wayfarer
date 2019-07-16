/* eslint-disable class-methods-use-this */
/* eslint-disable consistent-return */
import Joi from '@hapi/joi';
import 'dotenv/config';
import { hashPassword, checkPassword } from '../utils/encrypt';
import generateToken from '../utils/generateToken';
import { query } from '../db';

class AuthController {
  async signUp(req, res) {
    console.log('<<<<<<<============SIGN UP ENDPOINT========>>>>>>>>>');
    console.log(req.body);
    console.log(req.token);
    const data = req.body;
    const schema = Joi.object().keys({
      first_name: Joi.string().required().max(30),
      last_name: Joi.string().required().max(30),
      email: Joi.string().email().required().max(50),
      password: Joi.string().required(),
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
      const { rows } = await query('SELECT * FROM users WHERE email = $1;', [req.body.email]);
      if (rows[0]) return res.status(400).json({ status: 'error', error: 'User already exists' });
      value.password = await hashPassword(req.body.password);
      if (!value.is_admin) value.is_admin = false;
      const con = [value.first_name, value.last_name, value.email, value.password, value.is_admin];
      const result = await query('INSERT INTO users(first_name, last_name, email, password, is_admin) VALUES($1,$2,$3,$4,$5) RETURNING *', con);
      const user = result.rows[0];
      const returnData = {
        user_id: user.id,
        is_admin: user.is_admin,
        token: await generateToken(user.id, user.is_admin,
          { email: user.email, first_name: user.first_name, last_name: user.last_name }),
        email: user.email,
      };
      res.status(201).send({ status: 'success', data: returnData });
    } catch (err) {
      return res.status(400).json({ status: 'error', error: err });
    }
  }

  async signIn(req, res) {
    console.log('<<<<<<<============SIGN IN ENDPOINT========>>>>>>>>>');
    console.log(req.body);
    console.log(req.token);
    const data = req.body;
    const schema = Joi.object().keys({
      email: Joi.string().email().required().max(50),
      password: Joi.string().required(),
    });
    const { error } = Joi.validate(data, schema);
    if (error) {
      return res.status(422).send({
        status: 'error',
        error: error.message,
      });
    } try {
      const { rows } = await query('SELECT * FROM users WHERE email = $1;', [req.body.email]);
      if (!rows[0]) {
        return res.status(200).json({ status: 'error', error: 'User does not exist!' });
      // eslint-disable-next-line no-else-return
      } else {
        const userHash = await checkPassword(req.body.password, rows[0].password);
        if (userHash) {
          const returnData = {
            user_id: rows[0].id,
            is_admin: rows[0].is_admin,
            token: await generateToken(rows[0].id, rows[0].is_admin,
              { email: rows[0].email, first_name: rows[0].first_name, last_name: rows[0].last_name }),
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
