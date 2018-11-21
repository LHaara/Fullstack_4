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

/*     Blog
      .find({})
      .then(blogs => {
        response.json(blogs)
      }) */
})
  
blogsRouter.post('/', (request, response) => {
    const blog = new Blog(request.body)
  
    blog
      .save()
      .then(result => {
        response.status(201).json(result)
      })
})


module.exports = blogsRouter