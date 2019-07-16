"use strict";

require("@babel/polyfill");

var _pg = require("pg");

require("dotenv/config");

var _encrypt = require("./utils/encrypt");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

// import 'make-runnable';
var DATABASE_URL = process.env.DATABASE_URL;
var pool = new _pg.Pool({
  connectionString: DATABASE_URL
});
pool.on('connect', function () {
  console.log('connected to the db');
});
var tripTableSQL = "\n  CREATE TABLE IF NOT EXISTS trips (\n    id SERIAL PRIMARY KEY,\n    bus_id INTEGER NOT NULL,\n    origin VARCHAR(150) NOT NULL,\n    destination VARCHAR(150) NOT NULL,\n    trip_date TEXT NOT NULL,\n    fare NUMERIC NOT NULL, \n    status VARCHAR(10) NOT NULL,\n    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n    )\n  ";
var userTableSQL = "\n  CREATE TABLE IF NOT EXISTS users (\n    id SERIAL PRIMARY KEY,\n    email VARCHAR(50) NOT NULL UNIQUE,\n    first_name VARCHAR(30) NOT NULL,\n    last_name VARCHAR(30) NOT NULL,\n    is_admin BOOL  DEFAULT 'f' NOT NULL,\n    password TEXT NOT NULL, \n    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n    )\n  ";

var createTripTable =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2() {
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return pool.query('DROP TABLE IF EXISTS trips');

          case 2:
            _context2.next = 4;
            return pool.query(tripTableSQL).then(
            /*#__PURE__*/
            _asyncToGenerator(
            /*#__PURE__*/
            regeneratorRuntime.mark(function _callee() {
              return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      // Create table now
                      console.log('Trip Table created successfully');

                    case 1:
                    case "end":
                      return _context.stop();
                  }
                }
              }, _callee);
            })))["catch"](function (error) {
              throw error;
            });

          case 4:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function createTripTable() {
    return _ref.apply(this, arguments);
  };
}();

var adminData = ['Yusuff', 'Mustapha', 'officialwebdev@gmail.com', true];

var createUserTable =
/*#__PURE__*/
function () {
  var _ref3 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee4() {
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return pool.query('DROP TABLE IF EXISTS users');

          case 2:
            _context4.next = 4;
            return pool.query(userTableSQL).then(
            /*#__PURE__*/
            _asyncToGenerator(
            /*#__PURE__*/
            regeneratorRuntime.mark(function _callee3() {
              var _ref5, rows;

              return regeneratorRuntime.wrap(function _callee3$(_context3) {
                while (1) {
                  switch (_context3.prev = _context3.next) {
                    case 0:
                      _context3.next = 2;
                      return pool.query('SELECT * FROM users WHERE email = $1;', ['officialwebdev@gmail.com']);

                    case 2:
                      _ref5 = _context3.sent;
                      rows = _ref5.rows;

                      if (rows[0]) {
                        _context3.next = 14;
                        break;
                      }

                      _context3.t0 = adminData;
                      _context3.next = 8;
                      return (0, _encrypt.hashPassword)('admin123');

                    case 8:
                      _context3.t1 = _context3.sent;

                      _context3.t0.push.call(_context3.t0, _context3.t1);

                      _context3.next = 12;
                      return pool.query('INSERT INTO users(first_name, last_name, email, is_admin, password)VALUES($1,$2,$3,$4,$5) RETURNING *', adminData).then(function () {
                        return console.log('Admin created successfully');
                      })["catch"](function (error) {
                        throw error;
                      });

                    case 12:
                      _context3.next = 15;
                      break;

                    case 14:
                      console.log('Admin already exists');

                    case 15:
                    case "end":
                      return _context3.stop();
                  }
                }
              }, _callee3);
            })))["catch"](function (err) {
              throw err;
            });

          case 4:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function createUserTable() {
    return _ref3.apply(this, arguments);
  };
}();

var createAllTables =
/*#__PURE__*/
function () {
  var _ref6 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee5() {
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return createUserTable();

          case 2:
            _context5.next = 4;
            return createTripTable();

          case 4:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));

  return function createAllTables() {
    return _ref6.apply(this, arguments);
  };
}();

module.exports = {
  query: function query(text, params) {
    return pool.query(text, params);
  },
  createAllTables: createAllTables
};

require('make-runnable');
//# sourceMappingURL=db.js.map