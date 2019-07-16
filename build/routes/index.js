"use strict";

var _express = require("express");

var _AuthController = _interopRequireDefault(require("../controllers/AuthController"));

var _TripController = _interopRequireDefault(require("../controllers/TripController"));

var _authenticator = require("../middlewares/authenticator");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var router = (0, _express.Router)(); // Authentication Routes

router.post('/auth/signup', _AuthController["default"].signUp).post('/auth/signin', _AuthController["default"].signIn) // Trips routes
.post('/trips', _authenticator.isAdminAuthenticated, _TripController["default"].createATrip).get('/trips', _authenticator.isUserAuthenticated, _TripController["default"].getAllTrips).patch('/trips/:tripId', _authenticator.isAdminAuthenticated, _TripController["default"].cancelTrip);
module.exports = router;
//# sourceMappingURL=index.js.map