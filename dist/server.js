'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _models = require('./models');

var db = _interopRequireWildcard(_models);

var _cheerio = require('cheerio');

var _cheerio2 = _interopRequireDefault(_cheerio);

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

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

// connect to mongodb 
// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/newsscraper";

_mongoose2.default.connect(MONGODB_URI);

// root path
app.get('/', function (req, res) {
  res.send('News Scraper Root');
});

// route for scraper 
app.get('/scraper', function (req, res) {
  _axios2.default.get('https://www.newyorktimes.com/').then(function (response) {
    // store response parsed by cheerio
    var $ = _cheerio2.default.load(response.data);

    $("article a").each(function (i, element) {
      if ($(this).children('div').text() && $(this).children('div').children('h2').text() !== '') {
        var result = {};
        result.headline = $(this).children('div').children('h2').text();
        result.summary = $(this).children('p').text() || 'No Summary Available';
        result.URLref = 'https://www.newyorktimes.com' + $(this).attr('href');
        console.log(result);
      }
      // create entry for each headline 
      db.Article.create(result).then(function (dbResult) {
        return console.log(dbResult);
      }).catch(function (err) {
        return console.log(err);
      });
    });

    // create an entry to the DB 

  });

  res.send('All Done');
});

// function to start server 
app.listen(PORT, function () {
  console.log('Server running on PORT:' + PORT);
});