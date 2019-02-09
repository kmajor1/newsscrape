import mongoose from 'mongoose'
import express from 'express'
import logger from 'morgan'

import db from './models'
import cheerio from 'cheerio'
import axios from 'axios'



const PORT = 3000

// initialize express 
const app = express()

// use morgan for logging 
app.use(logger('dev'))
// Parse request body as JSON
app.use(express.urlencoded({extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

app.get('/', (req,res) => {
  res.send('test')
})