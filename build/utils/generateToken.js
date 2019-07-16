"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _dotenv = _interopRequireDefault(require("dotenv"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_dotenv["default"].config();

var SECRET_KEY = process.env.SECRET_KEY;

var generateToken = function generateToken(id, isAdmin, email) {
  return _jsonwebtoken["default"].sign({
    id: id,
    isAdmin: isAdmin,
    email: email
  }, SECRET_KEY, {
    expiresIn: '1 day'
  });
};

var _default = generateToken;
exports["default"] = _default;
//# sourceMappingURL=generateToken.js.map