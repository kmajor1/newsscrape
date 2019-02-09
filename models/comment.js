import mongoose from 'mongoose'

const Schema = mongoose.Schema

const commentSchema = new Schema({
  title: {
    type: String,
    required: true 
  },
  body: {
    type: String, 
    required: true 
  }
})

const Comment = mongoose.model('Comment',commentSchema)

export default Comment 
