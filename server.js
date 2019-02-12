import mongoose from 'mongoose'
import express from 'express'
import logger from 'morgan'

import * as db from './models'
import cheerio from 'cheerio'
import axios from 'axios'
import path from 'path'



const PORT = process.env.PORT || 3000

// initialize express 
const app = express()

// use morgan for logging 
app.use(logger('dev'))
// Parse request body as JSON
app.use(express.urlencoded({extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static(path.join(__dirname,'public')))


// connect to mongodb 
// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/newsscraper";

mongoose.connect(MONGODB_URI);


// get all articles 
app.get('/articles', (req,res) => {
  db.Article.find({})
    .then((dbArticles) => {
      res.json(dbArticles)
      console.log('Search Complete')
    }
    )
    .catch((err) => console.log(err))
}
)

// route for scraper 
app.get('/scrape',function(req,res) {
  console.log('scrape initiated')
  axios.get('https://www.nytimes.com/')
    .then((function(response) {
      // store response parsed by cheerio
      const $ = cheerio.load(response.data)
      

      $("article a").each(function(i, element){
        if ($(this).children('div').text() && ($(this).children('div').children('h2').text())!=='') {
          var result = {}
          result.headline =  $(this).children('div').children('h2').text()
          result.summary = $(this).children('p').text()  || 'No Summary Available'
          result.URLref = 'https://www.newyorktimes.com' +  $(this).attr('href')
           console.log(result)
        }
        // create entry for each headline 
        db.Article.create(result)
          .then((dbResult) => {
            console.log(dbResult)
            
          })
          .catch((err) => console.log(err))
      })

      // create an entry to the DB 

     res.send(response.data)

    }))

  
})

// route for grabbing a single article 

app.get('/articles/:id',(req,res) => {
  db.Article.findById(req.params.id)
    .populate('comment')
    .then((foundArticle) => {
      //console.log(foundArticle)
      res.json(foundArticle)
    })
})

// route for posting a comment
app.post('/articles/:id', (req,res) => {
  db.Comment.create(req.body)
    .then((dbComment) => {
      console.log('created note')
      return db.Article.findOneAndUpdate({_id:req.params.id}, {comment: dbComment._id}, {new: true}).populate("comment")
    })
    .then((dbArticle) => {
      console.log('found article')
      res.json(dbArticle)
    })
    .catch((err) => console.log('error'))
  })

  // delete comment route
  app.delete('/delete/:id', (req,res) => {
    // find article based on id 
    db.Article.findById(req.params.id)
      .then((dbArticle) => {
        
        return db.Comment.findOneAndDelete({_id: dbArticle.comment})
      })
      .then((dbComment) => res.json(dbComment))
  })

// function to start server 
app.listen(PORT, () => {
  console.log(`Server running on PORT:${PORT}`)
})

