import mongoose from 'mongoose'
import express from 'express'
import logger from 'morgan'

import db from './models'
import cheerio from 'cheerio'
import axios from 'axios'



const PORT = process.env.PORT || 3000

// initialize express 
const app = express()

// use morgan for logging 
app.use(logger('dev'))
// Parse request body as JSON
app.use(express.urlencoded({extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));


// connect to mongodb 
// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/newsscraper";

//mongoose.connect(MONGODB_URI);

// root path
app.get('/', (req,res) => {
  res.send('News Scraper Root')
})

// route for scraper 
app.get('/scraper',(req,res) => {
  axios.get('https://www.echojs.com/')
    .then((response => {
      // store response parsed by cheerio
      const $ = cheerio.load(response.data)
      
      $("article h2").each((index, element) => {
        const result = {}
        result.title = $(this)
      })

    }))

  res.send('All Done')
})

// function to start server 
app.listen(PORT, () => {
  console.log(`Server running on PORT:${PORT}`)
})

