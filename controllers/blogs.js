const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

const formatBlog = (blog) => {
  const formattedBlog = { ...blog._doc, id: blog._id }
  delete formattedBlog._id
  delete formattedBlog.__v
  return formattedBlog
}

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs.map(formatBlog))

})
  
blogsRouter.post('/', async (request, response) => {
  try {
    const body = request.body

    if (body.title === undefined) {
      return response.status(400).json({ error: 'title missing' })
    }
    console.log(body.likes)
    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes === undefined || body.likes === '' ? 0 : body.likes
    })

    const savedBlog = await blog.save()
    response.json(formatBlog(savedBlog))

  } catch (exception) {
    console.log(exception)
    response.status(500).json({ error: 'something went wrong...' })
  }

})


module.exports = blogsRouter