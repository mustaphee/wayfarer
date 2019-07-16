"use strict";

var _joi = _interopRequireDefault(require("@hapi/joi"));

require("dotenv/config");

var _db = require("../db");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var TripController =
/*#__PURE__*/
function () {
  function TripController() {
    _classCallCheck(this, TripController);
  }

  _createClass(TripController, [{
    key: "createATrip",
    value: function () {
      var _createATrip = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee(req, res) {
        var data, schema, _Joi$validate, error, value, con, result, returnData;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                data = req.body;
                schema = _joi["default"].object().keys({
                  bus_id: _joi["default"].number().integer().required(),
                  origin: _joi["default"].string().required().max(150),
                  trip_date: _joi["default"].date(),
                  destination: _joi["default"].string().required().max(150),
                  fare: _joi["default"].number().required(),
                  status: _joi["default"].string().max(10)
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
                // const pool = new Pool({ connectionString: DATABASE_URL });
                if (!value.status) value.status = 'active';
                if (!value.trip_date) value.trip_date = new Date().toISOString();
                con = [value.bus_id, value.origin, value.destination, value.trip_date, value.fare, value.status];
                _context.next = 11;
                return (0, _db.query)('INSERT INTO trips(bus_id, origin, destination, trip_date, fare, status) VALUES($1,$2,$3,$4,$5, $6) RETURNING *', con);

              case 11:
                result = _context.sent;
                returnData = {
                  trip_id: result.rows[0].id,
                  bus_id: result.rows[0].bus_id,
                  origin: result.rows[0].origin,
                  destination: result.rows[0].destination,
                  trip_date: result.rows[0].trip_date,
                  fare: result.rows[0].fare,
                  status: result.rows[0].status
                };
                res.status(201).send({
                  status: 'success',
                  data: returnData
                });
                _context.next = 19;
                break;

              case 16:
                _context.prev = 16;
                _context.t0 = _context["catch"](5);
                return _context.abrupt("return", res.status(400).json({
                  status: 'error',
                  error: _context.t0
                }));

              case 19:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[5, 16]]);
      }));

      function createATrip(_x, _x2) {
        return _createATrip.apply(this, arguments);
      }

      return createATrip;
    }()
  }, {
    key: "getAllTrips",
    value: function () {
      var _getAllTrips = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee2(req, res) {
        var data, schema, _Joi$validate2, error, _ref, rows;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                data = req.body;
                schema = _joi["default"].object().keys({
                  token: _joi["default"].string(),
                  user_id: _joi["default"].number(),
                  is_admin: _joi["default"]["boolean"]()
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
                return (0, _db.query)('SELECT * from trips');

              case 8:
                _ref = _context2.sent;
                rows = _ref.rows;

                if (rows[0]) {
                  _context2.next = 12;
                  break;
                }

                return _context2.abrupt("return", res.status(200).json({
                  status: 'success',
                  data: []
                }));

              case 12:
                res.status(200).send({
                  status: 'success',
                  data: rows
                });
                _context2.next = 18;
                break;

              case 15:
                _context2.prev = 15;
                _context2.t0 = _context2["catch"](5);
                return _context2.abrupt("return", res.status(400).json({
                  status: 'error',
                  error: _context2.t0
                }));

              case 18:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, null, [[5, 15]]);
      }));

      function getAllTrips(_x3, _x4) {
        return _getAllTrips.apply(this, arguments);
      }

      return getAllTrips;
    }()
  }, {
    key: "cancelTrip",
    value: function () {
      var _cancelTrip = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee3(req, res) {
        var data, schema, _Joi$validate3, error, value, _ref2, rows;

        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                data = {
                  trip_id: parseInt(req.params.tripId)
                };
                schema = _joi["default"].object().keys({
                  token: _joi["default"].string(),
                  user_id: _joi["default"].number(),
                  is_admin: _joi["default"]["boolean"](),
                  trip_id: _joi["default"].number().integer().required()
                });
                _Joi$validate3 = _joi["default"].validate(data, schema), error = _Joi$validate3.error, value = _Joi$validate3.value;

                if (!error) {
                  _context3.next = 5;
                  break;
                }

                return _context3.abrupt("return", res.status(422).send({
                  status: 'error',
                  error: error.message
                }));

              case 5:
                _context3.prev = 5;
                _context3.next = 8;
                return (0, _db.query)('SELECT * FROM trips WHERE id = $1;', [value.trip_id]);

              case 8:
                _ref2 = _context3.sent;
                rows = _ref2.rows;

                if (rows[0]) {
                  _context3.next = 12;
                  break;
                }

                return _context3.abrupt("return", res.status(200).json({
                  status: 'error',
                  error: 'Trip doesnt exists!'
                }));

              case 12:
                _context3.next = 14;
                return (0, _db.query)('UPDATE trips SET status = $1 WHERE id = $2 ', ['cancelled', value.trip_id]);

              case 14:
                res.status(201).send({
                  status: 'success',
                  data: {
                    message: 'Trip cancelled successfully'
                  }
                });
                _context3.next = 20;
                break;

              case 17:
                _context3.prev = 17;
                _context3.t0 = _context3["catch"](5);
                return _context3.abrupt("return", res.status(400).json({
                  status: 'error',
                  error: _context3.t0
                }));

              case 20:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, null, [[5, 17]]);
      }));

      function cancelTrip(_x5, _x6) {
        return _cancelTrip.apply(this, arguments);
      }

      return cancelTrip;
    }()
  }]);

  return TripController;
}();

module.exports = new TripController();
//# sourceMappingURL=TripController.js.map