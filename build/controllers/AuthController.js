"use strict";

var _joi = _interopRequireDefault(require("@hapi/joi"));

require("dotenv/config");

var _encrypt = require("../utils/encrypt");

var _generateToken = _interopRequireDefault(require("../utils/generateToken"));

var _db = require("../db");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var AuthController =
/*#__PURE__*/
function () {
  function AuthController() {
    _classCallCheck(this, AuthController);
  }

  _createClass(AuthController, [{
    key: "signUp",
    value: function () {
      var _signUp = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee(req, res) {
        var data, schema, _Joi$validate, error, value, _ref, rows, con, result, user, returnData;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                data = req.body;
                schema = _joi["default"].object().keys({
                  first_name: _joi["default"].string().required().max(30),
                  last_name: _joi["default"].string().required().max(30),
                  email: _joi["default"].string().email().required().max(50),
                  password: _joi["default"].string().regex(/^[a-zA-Z0-9]{5,30}$/).required(),
                  is_admin: _joi["default"]["boolean"]()
                });
                _Joi$validate = _joi["default"].validate(data, schema), error = _Joi$validate.error, value = _Joi$validate.value;

                if (!error) {
                  _context.next = 5;
                  break;
                }

                return _context.abrupt("return", res.status(422).send({
                  status: 'error',
                  error: error.message
                }));

              case 5:
                _context.prev = 5;
                _context.next = 8;
                return (0, _db.query)('SELECT * FROM users WHERE email = $1;', [req.body.email]);

              case 8:
                _ref = _context.sent;
                rows = _ref.rows;

                if (!rows[0]) {
                  _context.next = 12;
                  break;
                }

                return _context.abrupt("return", res.status(400).json({
                  status: 'error',
                  error: 'User already exists'
                }));

              case 12:
                _context.next = 14;
                return (0, _encrypt.hashPassword)(req.body.password);

              case 14:
                value.password = _context.sent;
                if (!value.is_admin) value.is_admin = false;
                con = [value.first_name, value.last_name, value.email, value.password, value.is_admin];
                _context.next = 19;
                return (0, _db.query)('INSERT INTO users(first_name, last_name, email, password, is_admin) VALUES($1,$2,$3,$4,$5) RETURNING *', con);

              case 19:
                result = _context.sent;
                user = result.rows[0];
                _context.t0 = user.id;
                _context.t1 = user.is_admin;
                _context.next = 25;
                return (0, _generateToken["default"])(user.id, user.is_admin, user.email);

              case 25:
                _context.t2 = _context.sent;
                _context.t3 = user.email;
                returnData = {
                  user_id: _context.t0,
                  is_admin: _context.t1,
                  token: _context.t2,
                  email: _context.t3
                };
                res.status(201).send({
                  status: 'success',
                  data: returnData
                });
                _context.next = 34;
                break;

              case 31:
                _context.prev = 31;
                _context.t4 = _context["catch"](5);
                return _context.abrupt("return", res.status(400).json({
                  status: 'error',
                  error: _context.t4
                }));

              case 34:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[5, 31]]);
      }));

      function signUp(_x, _x2) {
        return _signUp.apply(this, arguments);
      }

      return signUp;
    }()
  }, {
    key: "signIn",
    value: function () {
      var _signIn = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee2(req, res) {
        var data, schema, _Joi$validate2, error, _ref2, rows, userHash, returnData;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                data = req.body;
                schema = _joi["default"].object().keys({
                  email: _joi["default"].string().email().required().max(50),
                  password: _joi["default"].string().regex(/^[a-zA-Z0-9]{5,30}$/).required()
                });
                _Joi$validate2 = _joi["default"].validate(data, schema), error = _Joi$validate2.error;

                if (!error) {
                  _context2.next = 5;
                  break;
                }

                return _context2.abrupt("return", res.status(422).send({
                  status: 'error',
                  error: error.message
                }));

              case 5:
                _context2.prev = 5;
                _context2.next = 8;
                return (0, _db.query)('SELECT * FROM users WHERE email = $1;', [req.body.email]);

              case 8:
                _ref2 = _context2.sent;
                rows = _ref2.rows;

                if (rows[0]) {
                  _context2.next = 14;
                  break;
                }

                return _context2.abrupt("return", res.status(200).json({
                  status: 'error',
                  error: 'User does not exist!'
                }));

              case 14:
                _context2.next = 16;
                return (0, _encrypt.checkPassword)(req.body.password, rows[0].password);

              case 16:
                userHash = _context2.sent;

                if (!userHash) {
                  _context2.next = 28;
                  break;
                }

                _context2.t0 = rows[0].id;
                _context2.t1 = rows[0].is_admin;
                _context2.next = 22;
                return (0, _generateToken["default"])(rows[0].id, rows[0].is_admin, rows[0].email);

              case 22:
                _context2.t2 = _context2.sent;
                _context2.t3 = rows[0].email;
                returnData = {
                  user_id: _context2.t0,
                  is_admin: _context2.t1,
                  token: _context2.t2,
                  email: _context2.t3
                };
                res.status(200).send({
                  status: 'success',
                  data: returnData
                });
                _context2.next = 29;
                break;

              case 28:
                return _context2.abrupt("return", res.status(401).json({
                  status: 'error',
                  error: 'Please check your user details'
                }));

              case 29:
                _context2.next = 34;
                break;

              case 31:
                _context2.prev = 31;
                _context2.t4 = _context2["catch"](5);
                return _context2.abrupt("return", res.status(400).json({
                  status: 'error',
                  error: _context2.t4
                }));

              case 34:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, null, [[5, 31]]);
      }));

      function signIn(_x3, _x4) {
        return _signIn.apply(this, arguments);
      }

      return signIn;
    }()
  }]);

  return AuthController;
}();

module.exports = new AuthController();
//# sourceMappingURL=AuthController.js.map