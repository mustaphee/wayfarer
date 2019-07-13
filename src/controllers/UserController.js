/* eslint-disable class-methods-use-this */
import Joi from '@hapi/joi';

class UserController {
  async signUp(req, res) {
    const data = req.body;
    const schema = Joi.object().keys({
      first_name: Joi.string().required(),
      last_name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().regex(/^[a-zA-Z0-9]{5,30}$/).required(),
      is_admin: Joi.boolean()
    })
    const {error, value} = Joi.validate(data, schema)
    if (error) {
      return res.status(422).send({
        status: 'fail',
        error: error.message,
      });
    } else {
        
    };
    return data
  }
}
// module.exports = new UserController();
export default UserController;

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

// module.exports = new AuthController
