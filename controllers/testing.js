const router = require('express').Router()
const Site = require('../models/site')
const User = require('../models/user')

router.post('/reset', async (request, response) => {
  await Site.deleteMany({})
  await User.deleteMany({})

  response.status(204).end()
})

module.exports = router
