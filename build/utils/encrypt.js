"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkPassword = exports.hashPassword = void 0;

var _bcrypt = _interopRequireDefault(require("bcrypt"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var hashPassword =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(password) {
    var hashedPassword;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _bcrypt["default"].hash(password, 10);

          case 2:
            hashedPassword = _context.sent;
            return _context.abrupt("return", hashedPassword);

          case 4:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function hashPassword(_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.hashPassword = hashPassword;

var checkPassword =
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(plaintextPassword, hashPass) {
    var match;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return _bcrypt["default"].compare(plaintextPassword, hashPass);

          case 2:
            match = _context2.sent;
            return _context2.abrupt("return", match);

          case 4:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function checkPassword(_x2, _x3) {
    return _ref2.apply(this, arguments);
  };
}();

exports.checkPassword = checkPassword;
//# sourceMappingURL=encrypt.js.map