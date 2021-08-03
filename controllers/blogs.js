const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')  

blogRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs.map((blog) => blog.toJSON()));
  })
  
blogRouter.get('/:id', async (request, response) => {
    try {
        const blog = await Blog.findById(request.params.id)
        response.json(blog.toJSON())
    } catch (exception) {
        response.status(404).end()
    }
  })
    
blogRouter.post('/', async (request, response, next) => {
    const { title, author, url, comments, likes, parent, visited, liked, opcode } = request.body
    if (!request.token || !request.decodedToken) {
        return response.status(401).json({ error: 'missing or invalid token' })
    }
    if (!title || !url) {
        response.status(400).end()
    }
    
    const user = await User.findById(request.decodedToken.id)
    const blog = new Blog({
        title,
        author, 
        url,
        comments,
        likes: likes || 0,
        user: user._id,
        parent,
    })    
    try {
        const savedBlog = await blog.save()
        if (opcode === 100) {
          user.blogs = user.blogs.concat(savedBlog._id)
        } else if (opcode === 200) {
          user.visited = user.visited.concat(savedBlog._id)
        }
        await user.save()      
        response.status(201).json(savedBlog)    
    } catch (exception){
        next(exception)
    }
})
  

blogRouter.delete('/:id', async (request, response) => {
    if (!request.token || !request.decodedToken) {
        return response.status(401).json({ error: 'missing or invalid token' })
      }
      const blog = await Blog.findById(request.params.id)
      const userId = request.decodedToken.id
    
      if (blog.user.toString() !== userId.toString()) {
        response.status(400).end()
      }
    
      await Blog.findByIdAndRemove(request.params.id)
      response.status(204).end()
    })

blogRouter.put('/:id', async (request, response) => {
    if (!request.token || !request.decodedToken) {
      return response.status(401).json({ error: 'missing or invalid token' })
    }
  
    const blogObject = {
      comments: request.body.comments,
      likes: request.body.likes,
      liked: request.body.liked,
      visited: request.body.visited
    }
  
    const updatedBlog = await Blog.findByIdAndUpdate(
      request.params.id,
      blogObject,
      { new: true }
    )
  
    // Populate user field on the returned blog
    const populatedBlog = await updatedBlog
      .populate('user', { username: 1, name: 1 })
      .execPopulate()
  
    response.json(populatedBlog.toJSON())
  })
  

  
module.exports = blogRouter
