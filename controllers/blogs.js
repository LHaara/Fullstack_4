const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

const formatBlog = (blog) => {
  const formattedBlog = { ...blog._doc}
  delete formattedBlog.__v
  return formattedBlog
}

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs.map(formatBlog))

})

blogsRouter.get('/:id', async (request, response) => {
  try {
    const blog = await Blog.findById(request.params.id)
    if (blog) {
      response.json(formatBlog(blog))
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
    await Blog.findByIdAndRemove(request.params.id)

    response.status(204).end()
  } catch (exception) {
    console.log(exception)
    response.status(400).json({ error: 'malformatted id' })
  }
})


blogsRouter.post('/', async (request, response) => {
  try {
    const body = request.body

    if (body.title === undefined && body.url === undefined) {
      return response.status(400).json({ error: 'Both title and url are missing' })
    }

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes === undefined || body.likes === '' ? 0 : body.likes,
      _id: body._id
    })

    const savedBlog = await blog.save()
    response.json(formatBlog(savedBlog))

  } catch (exception) {
    console.log(exception)
    response.status(500).json({ error: 'something went wrong...' })
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
    response.json(formatBlog(updatedBlog))

  } catch (exception) {
    console.log(exception)
    response.status(400).send({ error: 'malformatted id' })
  }   

})





module.exports = blogsRouter