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
        status: 'fail',
        error: error.message,
      });
    }
    try {
      const pool = new Pool({ connectionString: DATABASE_URL });
      const { rows } = await pool.query('SELECT * FROM users WHERE email = $1;', [req.body.email]);
      if (rows[0]) return res.status(400).json({ status: 'fail', error: 'User already exists' });
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
      return res.status(400).json({ status: 'fail', error: err });
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
        status: 'fail',
        error: error.message,
      });
    } try {
      const pool = new Pool({ connectionString: DATABASE_URL });
      const { rows } = await pool.query('SELECT * FROM users WHERE email = $1;', [req.body.email]);
      if (!rows[0]) {
        return res.status(404).json({ status: 'fail', error: 'User does not exist!' });
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
          return res.status(401).json({ status: 'fail', error: 'Please check your user details' });
        }
      }
    } catch (err) {
      return res.status(400).json({ status: 'fail', error: err });
    }
  }
}
module.exports = new AuthController();
// export default new AuthController;

// class AuthController {

//   async register (req, res) {
//     const data = req.body;
//     const schema = Joi.object().keys({
//             name: Joi.string().required(),
//             email: Joi.string().email().required(),
//             password: Joi.string().regex(/^[a-zA-Z0-9]{5,30}$/).required()
//         })
//         const {
//             error,
//             value
//         } = Joi.validate(data, schema)
//         if (error) {
//             return res.status(422).send({
//                 status: "fail",
//                 error: error.message,
//                 message: 'Unable to fufill your request'
//             })
//         } else {
//             if (Users.find(user => {
//                     return user.email === data.email
//                 })) {
//                 return res.status(400).send({
//                     status: "fail",
//                     error: 'Email address should be unique',
//                     message: 'Unable to fufill your request'
//                 })
//             }
//             let newUser = {
//                 id: Users.length + 1,
//                 name: data.name,
//                 email: data.email,
//                 password: await bcrypt.hashSync(data.password, 10)
//             }
//             await Users.push(newUser);
//             return res.status(200).json({
//                 status: 'success',
//                 message: `${newUser.name} has been registered successfully!`,
//                 data: {
//                     id: newUser.id,
//                     name: newUser.name,
//                     email: newUser.email
//                 }
//             })
//         };
//     }

//     async login(req, res) {
//         const schema = Joi.object().keys({
//             email: Joi.string().email().required(),
//             password: Joi.string().required().regex(/^[a-zA-Z0-9]{5,30}$/).required()
//         })
//         const {
//             error,
//             value
//         } = Joi.validate({
//             email: req.body.email,
//             password: req.body.password
//         }, schema)
//         if (error) return res.status(422).send({
//             status: "fail",
//             error: error.message,
//             message: 'Email or password cannot be blank'
//         })
//         const user = Users.find(user => {
//             return user.email === req.body.email
//         });
//         if (!user) {
//             res.status(401).json({
//                 status: 'fail',
//                 message: 'There was no user with that login id found'
//             });
//         } else {
//             bcrypt.compare(req.body.password, user.password, function (err, resp) {
//                 if (err) throw err;
//                 if (!resp) {
//                     res.status(401).send({
//                         status: 'fail',
//                         message: 'Your Password is incorrect'
//                     })
//                 } else {
//                     const payload = {
//                         _id: user._id,
//                         name: user.name,
//                         email: user.email
//                     };
//                     let token = jwt.sign(payload, NOT_SO_SECRET_KEY, {
//                         expiresIn: '48h' //2days expiry
//                     });

//                     res.send({
//                         status: 'success',
//                         message: 'Bearer token generated!',
//                         expiry: 17280,
//                         token: token,
//                         data: payload
//                     })
//                 }
//             })
//         }
//     }

//     async isAuthenticated(req, res, next) {
//         let token = await req.body.token || req.query.token || req.headers['authorization'];

//         if (token) {
//             jwt.verify(token, NOT_SO_SECRET_KEY, function (err, decoded) {
//                 if (err) {
//                     return res.status(401).json({
//                         status: '401',
//                         error: 'Authentication failed',
//                         message: 'Failed to authenticate token.'
//                     });
//                 } else {
//                     // if everything is good, save to request for use in other routes
//                     req.decoded = decoded;
//                     next();
//                 }
//             })
//         } else {
//             return res.status(403).send({
//                 status: "forbidden",
//                 error: "access to resources forbidden",
//                 message: 'You can not access this resources without a token.'
//             });
//         }
//     }
// }

// module.exports = new AuthController;
