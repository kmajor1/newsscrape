'use strict';

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mongoose = require('mongoose');
var express = require('express');


var db = require('./models');

var axios = require('axios');
var cheerio = require('cheerio');

var PORT = 3000;

// initialize express 
var app = express();

// use morgan for logging 
app.use((0, _morgan2.default)('dev'));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// connect to mongodb 
// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/newsscraper";

mongoose.connect(MONGODB_URI);