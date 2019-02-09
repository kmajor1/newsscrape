import mongoose from 'mongoose'
import express from 'express'

import db from './models'

import axios from 'axios'
import cheerio from 'cheerio'

const PORT = 3000

// initialize express 
const app = express()
