const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
    title: {
      type: String
    },
    author: String,
    url: {
      type: String
    },
    comments: Array,
    userLiked: Array,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'  
    },
    description: String,
    imageUrl: String,
    liked: Boolean,
    parent: {
      title: {
        type: String
      },
      userLiked: Array,
      author: String,
      url: {
        type: String
      },
      likes: Number,
      comments: Array,
      user: {
        username: String,
        name: String,
        id: String  
      },
      description: String,
      imageUrl: String,
      liked: Boolean,
      visited: Boolean,
      id: String
    }, 
    visited: Boolean
})
  
blogSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
})
  
const Blog = mongoose.model('Blog', blogSchema)
module.exports = Blog
