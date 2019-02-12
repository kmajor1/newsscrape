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

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

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
app.use(_express2.default.static(_path2.default.join(__dirname, 'public')));

// connect to mongodb 
// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/newsscraper";

_mongoose2.default.connect(MONGODB_URI);

// get all articles 
app.get('/articles', function (req, res) {
  db.Article.find({}).then(function (dbArticles) {
    res.json(dbArticles);
    console.log('Search Complete');
  }).catch(function (err) {
    return console.log(err);
  });
});

// route for scraper 
app.get('/scrape', function (req, res) {
  console.log('scrape initiated');
  _axios2.default.get('https://www.nytimes.com/').then(function (response) {
    // store response parsed by cheerio
    var $ = _cheerio2.default.load(response.data);

    $("article a").each(function (i, element) {
      if ($(this).children('div').text() && $(this).children('div').children('h2').text() !== '') {
        var result = {};
        result.headline = $(this).children('div').children('h2').text();
        result.summary = $(this).children('p').text() || 'No Summary Available';
        result.URLref = 'https://www.nytimes.com' + $(this).attr('href');
        console.log(result);
      }
      // create entry for each headline 
      db.Article.create(result).then(function (dbResult) {
        console.log(dbResult);
      }).catch(function (err) {
        return console.log(err);
      });
    });

    // create an entry to the DB 

    res.send(response.data);
  });
});

// route for grabbing a single article 

app.get('/articles/:id', function (req, res) {
  db.Article.findById(req.params.id).populate('comment').then(function (foundArticle) {
    //console.log(foundArticle)
    res.json(foundArticle);
  });
});

// route for posting a comment
app.post('/articles/:id', function (req, res) {
  db.Comment.create(req.body).then(function (dbComment) {
    console.log('created note');
    return db.Article.findOneAndUpdate({ _id: req.params.id }, { comment: dbComment._id }, { new: true }).populate("comment");
  }).then(function (dbArticle) {
    console.log('found article');
    res.json(dbArticle);
  }).catch(function (err) {
    return console.log('error');
  });
});

// delete comment route
app.delete('/delete/:id', function (req, res) {
  // find article based on id 
  db.Article.findById(req.params.id).then(function (dbArticle) {

    return db.Comment.findOneAndDelete({ _id: dbArticle.comment });
  }).then(function (dbComment) {
    return res.json(dbComment);
  });
});

// function to start server 
app.listen(PORT, function () {
  console.log('Server running on PORT:' + PORT);
});