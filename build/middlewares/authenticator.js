"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isUserAuthenticated = exports.isAdminAuthenticated = void 0;

require("@babel/polyfill");

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

require("dotenv/config");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/* eslint-disable no-else-return */

/* eslint-disable consistent-return */
var SECRET_KEY = process.env.SECRET_KEY;

var isAdminAuthenticated = function isAdminAuthenticated(req, res, next) {
  var token = req.query.token || req.headers.token;

  if (token) {
    _jsonwebtoken["default"].verify(token, SECRET_KEY, function (err, decoded) {
      if (err) {
        return res.status(401).json({
          status: 'error',
          error: 'Failed to authenticate token.'
        });
      } else if (decoded.isAdmin !== true) {
        return res.status(403).send({
          status: 'error',
          message: 'You do not have access to this resource'
        });
      } else if (decoded.isAdmin === true) {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return res.status(403).send({
      status: 'error',
      error: 'You can not access this resources without a token.'
    });
  }
};

exports.isAdminAuthenticated = isAdminAuthenticated;

var isUserAuthenticated = function isUserAuthenticated(req, res, next) {
  var token = req.query.token || req.headers.token;

  if (token) {
    _jsonwebtoken["default"].verify(token, SECRET_KEY, function (err, decoded) {
      if (err) {
        return res.status(401).json({
          status: 'error',
          error: 'Failed to authenticate token.'
        });
      } else if (decoded) {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return res.status(403).send({
      status: 'error',
      error: 'You can not access this resources without a token.'
    });
  }
};

exports.isUserAuthenticated = isUserAuthenticated;
//# sourceMappingURL=authenticator.js.map