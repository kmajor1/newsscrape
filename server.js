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
app.get('/scraper',function(req,res) {
  axios.get('https://www.newyorktimes.com/')
    .then((function(response) {
      // store response parsed by cheerio
      console.log(response.data)
      const $ = cheerio.load(response.data)
      

      $("article a").each(function(i, element){
        if ($(this).children('div').text() && ($(this).children('div').children('h2').text())!=='') {
          let result = {}
          result.headline =  $(this).children('div').children('h2').text()
          result.URLref = 'https://www.newyorktimes.com' +  $(this).attr('href')
          result.summary = $(this).children('p').text()
          console.log(result)
        }
        // create entry for each headline 
        
      })

      // create an entry to the DB 

     

    }))

  res.send('All Done')
})

// function to start server 
app.listen(PORT, () => {
  console.log(`Server running on PORT:${PORT}`)
})

