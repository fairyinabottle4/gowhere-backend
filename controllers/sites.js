const siteRouter = require('express').Router()
const Site = require('../models/site')
const User = require('../models/user')
const jwt = require('jsonwebtoken')  

siteRouter.get('/', async (request, response) => {
    const sites = await Site.find({}).populate('user', { username: 1, name: 1 })
    response.json(sites.map((site) => site.toJSON()));
  })
  
siteRouter.get('/:id', async (request, response) => {
    try {
        const site = await Site.findById(request.params.id)
        response.json(site.toJSON())
    } catch (exception) {
        response.status(404).end()
    }
  })
    
siteRouter.post('/', async (request, response, next) => {
    const { title, author, url, comments, likes, parent, opcode } = request.body
    if (!request.token || !request.decodedToken) {
        return response.status(401).json({ error: 'missing or invalid token' })
    }
    if (!title || !url) {
        response.status(400).end()
    }
    
    const user = await User.findById(request.decodedToken.id)
    const site = new Site({
        title,
        author, 
        url,
        comments,
        likes: likes || 0,
        user: user._id,
        parent,
    })    
    try {
        const savedSite = await site.save()
        if (opcode === 100) {
          user.liked = user.liked.concat(savedSite._id)
        } else if (opcode === 200) {
          user.visited = user.visited.concat(savedSite._id)
        }
        await user.save()      
        response.status(201).json(savedSite)    
    } catch (exception){
        next(exception)
    }
})
  

siteRouter.delete('/:id', async (request, response) => {
    if (!request.token || !request.decodedToken) {
        return response.status(401).json({ error: 'missing or invalid token' })
      }
      const site = await Site.findById(request.params.id)
      const userId = request.decodedToken.id
    
      if (site.user.toString() !== userId.toString()) {
        response.status(400).end()
      }
    
      await Site.findByIdAndRemove(request.params.id)
      response.status(204).end()
    })

siteRouter.put('/:id', async (request, response) => {
    if (!request.token || !request.decodedToken) {
      return response.status(401).json({ error: 'missing or invalid token' })
    }
  
    const siteObject = {
      comments: request.body.comments,
      userLiked: request.body.userLiked,
      userVisited: request.body.userVisited,
      visited: request.body.visited
    }
  
    const updatedSite = await Site.findByIdAndUpdate(
      request.params.id,
      siteObject,
      { new: true }
    )
  
    // Populate user field on the returned site
    const populatedSite = await updatedSite
      .populate('user', { username: 1, name: 1 })
      .execPopulate()
  
    response.json(populatedSite.toJSON())
  })
  

  
module.exports = siteRouter
