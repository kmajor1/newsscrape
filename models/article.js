import mongoose from 'mongoose';

const Schema = mongoose.Schema

const articleSchema = new Schema({
  headline: {
    type: String,
    required: true 
  },
  summary: {
    type: String,
    required: true 
  },
  URL: {
    type: String,
    required: true
  },
  comment: {
    type: Schema.Types.ObjectId,
    ref: 'Article'
  }
})

const Article = mongoose.model('Article', articleSchema)

export default Article