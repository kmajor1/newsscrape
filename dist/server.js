'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _models = require('./models');

var _models2 = _interopRequireDefault(_models);

var _cheerio = require('cheerio');

var _cheerio2 = _interopRequireDefault(_cheerio);

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PORT = process.env.PORT || 3000;

// initialize express 
var app = (0, _express2.default)();

// use morgan for logging 
app.use((0, _morgan2.default)('dev'));
// Parse request body as JSON
app.use(_express2.default.urlencoded({ extended: true }));
app.use(_express2.default.json());
// Make public a static folder
app.use(_express2.default.static("public"));

app.get('/', function (req, res) {
  res.send('test');
});

app.listen(PORT, function () {
  console.log('listening on PORT ' + PORT);
});