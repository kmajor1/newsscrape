const mongoose = require('mongoose')
const express = require('express')
import logger from 'morgan'

const db = require('./models')

const axios = require('axios')
const cheerio = require('cheerio')

const PORT = 3000

// initialize express 
const app = express()

// use morgan for logging 
app.use(logger('dev'))
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));


// connect to mongodb 
// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/newsscraper";

mongoose.connect(MONGODB_URI);

