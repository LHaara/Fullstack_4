const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const Blog = require('../models/blog')

const initialBlogs =[
  {
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
  },
  {
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
  },
  {
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
  }
]

beforeAll(async () => {
  await Blog.remove({})

  const blogObjects = initialBlogs.map(blog => new Blog(blog))
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
    const response = await api
      .get('/api/blogs')

    expect(response.body.length).toBe(initialBlogs.length)
  })

  test('a specific blog is within the returned blogs', async () => {
    const response = await api
      .get('/api/blogs')
    
/*     const formattedBlogs = response.body
    formattedBlogs.forEach(function (blog){
      delete blog.id
    }) */

    const formattedBlogs = response.body.map(blog => {
      delete blog.id
      return blog
    })

    const testblog =   {
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5
    }

    expect(formattedBlogs).toContainEqual(testblog)

  })

  test('a valid blog can be added ', async () => {
    const newBlog = {
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
  
    const response = await api
      .get('/api/blogs')
  
    const titles = response.body.map(r => r.title)
  
    expect(response.body.length).toBe(initialBlogs.length + 1)
    expect(titles).toContain('First class tests')
  })

  test('blog without title is not added ', async () => {
    const newBlog = {
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
      likes: 10
    }
  
    const initialBlogs = await api
      .get('/api/blogs')
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
  
    const response = await api
      .get('/api/blogs')
  
    expect(response.body.length).toBe(initialBlogs.body.length)
  })


  afterAll(() => {
    server.close()
  })
})