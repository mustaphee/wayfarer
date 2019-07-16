"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

require("@babel/polyfill");

var _express = _interopRequireDefault(require("express"));

var _morgan = _interopRequireDefault(require("morgan"));

require("dotenv/config");

var _index = _interopRequireDefault(require("./routes/index"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var app = (0, _express["default"])();
var PORT = process.env.PORT || 3000; // Basic config

app.use((0, _morgan["default"])('combined'));
app.use(_express["default"].json());
app.use(_express["default"].urlencoded({
  extended: true
}));
app.get('/', function (req, res) {
  return res.send('Hello World!');
});
app.use('/api/v1/', _index["default"]); // eslint-disable-next-line no-console

app.listen(PORT, function () {
  return console.log("Super Wayfarer app listening on  ".concat(PORT, "!"));
});
var _default = app;
exports["default"] = _default;
//# sourceMappingURL=index.js.map