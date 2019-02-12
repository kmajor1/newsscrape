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
  URLref: {
    type: String,
    required: true
  },
  comment: {
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  }
})

const Article = mongoose.model('Article', articleSchema)

export default Article