const mongoose = require('mongoose')

const siteSchema = new mongoose.Schema({
    title: {
      type: String
    },
    country: String,
    url: {
      type: String
    },
    userLiked: Array,
    userVisited: Array,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'  
    },
    description: String,
    imageUrl: String,
    parent: {
      title: {
        type: String
      },
      userLiked: Array,
      userVisited: Array,
      country: String,
      url: {
        type: String
      },
      likes: Number,
      user: {
        username: String,
        name: String,
        id: String  
      },
      description: String,
      imageUrl: String,
      id: String
    }, 
})
  
siteSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
})
  
const Site = mongoose.model('Blog', siteSchema)
module.exports = Site
