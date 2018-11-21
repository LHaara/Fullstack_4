const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const Blog = require('../models/blog')
const helper = require('./test_helper')


beforeEach(async () => {
  await Blog.remove({})

  const blogObjects = helper.initialBlogs.map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
})


describe('Tests for GET operator: ', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {    
    const blogs = await helper.blogsInDb()
    expect(blogs.length).toBe(helper.initialBlogs.length)
    expect(blogs).toEqual(helper.initialBlogs)
  })

  test('a specific blog is within the returned blogs', async () => {
    const blogs = await helper.blogsInDb()
    const testblog = 
    {
      _id: "5a422aa71b54a676234d17f8",
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5,
    }
    expect(blogs).toContainEqual(testblog)
  })
})

describe('Tests for POST operator: ', () => {
  test('a valid blog can be added ', async () => {

    const blogsBefore = await helper.blogsInDb()

    const newBlog = {
      _id: "5a422b891b54a676234d17fa",
      title: "First class tests",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
      likes: 10
    }
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  
    const blogsAfter = await helper.blogsInDb()

    expect(blogsAfter.length).toBe(blogsBefore.length+1)
    expect(blogsAfter).toContainEqual(newBlog)
  })

  test('blog without title and url is not added ', async () => {
    const newBlog = {
      author: "Joku joka ei osaa laittaa otsikkoa eikä urlia",
      likes: 10
    }
  
    const blogsBefore = await helper.blogsInDb()
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
  
      const blogsAfter = await helper.blogsInDb()
  
    expect(blogsAfter.length).toBe(blogsBefore.length)
  })

  test('blog without value for likes gets 0 likes ', async () => {
    const newBlog = {
      title: "Tosi outo blogi",
      author: "Tosi outo tyyppi",
      url: "https://localhost:3003/api/blogs",
      //likes: ''
    }
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  
    const blogsAfter = await helper.blogsInDb()
    
    const newBlogReply = blogsAfter.find(blog => blog.title === 'Tosi outo blogi')
    expect(newBlogReply.likes).toBe(0)
  })



  afterAll(() => {
    server.close()
  })
})