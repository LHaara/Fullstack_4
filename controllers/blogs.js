const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')


/* const formatBlog = (blog) => {
  const formattedBlog = { ...blog._doc}
  delete formattedBlog.__v
  return formattedBlog 

} */

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1})
  response.json(blogs.map(Blog.format))

})

blogsRouter.get('/:id', async (request, response) => {
  try {
    const blog = await Blog.findById(request.params.id)
    if (blog) {
      response.json(Blog.format(blog))
    } else {
      response.status(404).end()
    }

  } catch (exception) {
    console.log(exception)
    response.status(400).send({ error: 'malformatted id' })
  }

})


blogsRouter.delete('/:id', async (request, response) => {
  try {

    // JsonWebTokenError antaa hyvät ilmoitukset järkevillä statuskoodeilla
    if(request.token === null){
      return response.status(401).json({ error: 'token missing' })
    }
      
    const decodedToken = jwt.verify(request.token, process.env.SECRET)

    const blog = await Blog.findById(request.params.id)


    if ( blog.user.toString() === decodedToken.id ){
      await Blog.deleteOne(blog)
      response.status(204).end()
    }
    else
    response.status(401).json({ error: 'insufficient permissions' })



    } catch (exception) {
      if (exception.name === 'JsonWebTokenError' ) {
        response.status(401).json({ error: exception.message })
      } 
      else {   
        console.log(exception)
        response.status(400).json({ error: 'malformatted id' })
      }
    }
})

/* const getTokenFrom = (request) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
} */

blogsRouter.post('/', async (request, response) => {

  const body = request.body

  try {     
    const decodedToken = jwt.verify(request.token, process.env.SECRET)

    if (!request.token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    if (body.title === undefined && body.url === undefined) {
      return response.status(400).json({ error: 'Both title and url are missing' })
    }

    const user = await User.findById(decodedToken.id)

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes === undefined || body.likes === '' ? 0 : body.likes,
      _id: body._id,
      user: user._id
    })

    const savedBlog = await blog.save()

    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.json(Blog.format(savedBlog))
  } catch (exception) {
    if (exception.name === 'JsonWebTokenError' ) {
      response.status(401).json({ error: exception.message })
    } else {    
      console.log(exception)
      response.status(500).json({ error: 'something went wrong...' })
    }
  }
})

blogsRouter.put('/:id', async (request, response) => {
  try {
    const blog = request.body

/*     const blog = {
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes
    } */

    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    response.json(Blog.format(updatedBlog))

  } catch (exception) {
    console.log(exception)
    response.status(400).send({ error: 'malformatted id' })
  }   

})





module.exports = blogsRouter
