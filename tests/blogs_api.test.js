const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const Blog = require('../models/blog')
const helper = require('./test_helper')
const User = require('../models/user')


describe('Tests for GET operator: ', () => {

  beforeAll(async () => {
    await Blog.remove({})
  
    const blogObjects = helper.initialBlogs.map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
  })

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
  test('individual blogs are returned as json by GET /api/blogs/:id', async () => {
    const blogsInDatabase = await helper.blogsInDb()
    const aBlog = blogsInDatabase[0]

    const response = await api
      .get(`/api/blogs/${aBlog._id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body).toEqual(aBlog)
  })

  test('404 returned by GET /api/blogs/:id with nonexisting valid id', async () => {
    const validNonexistingId = await helper.nonExistingId()

    const response = await api
      .get(`/api/blogs/${validNonexistingId}`)
      .expect(404)
  })

  test('400 is returned by GET /api/blogs/:id with invalid id', async () => {
    const invalidId = "7"

    const response = await api
      .get(`/api/blogs/${invalidId}`)
      .expect(400)
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
})

describe('deletion of a blog', async () => {
  let addedBlog

  beforeAll(async () => {
    await Blog.remove({})

    addedBlog = new Blog({
      title: "Tosi outo blogi",
      author: "Tosi outo tyyppi",
      url: "https://localhost:3003/api/blogs"
    })
    await addedBlog.save()
  })


  test('DELETE /api/blogs/:id succeeds with proper statuscode', async () => {
    const blogsAtStart = await helper.blogsInDb()


    await api
      .delete(`/api/blogs/${addedBlog._id}`)
      .expect(204)

    const blogsAfterOperation = await helper.blogsInDb()

    const titles = blogsAfterOperation.map(r => r.title)

    expect(titles).not.toContain(addedBlog.title) 
    expect(blogsAtStart).not.toEqual(blogsAfterOperation)
    expect(blogsAfterOperation.length).toBe(blogsAtStart.length - 1)
  })
})

describe('updating a blog', async () => {
  let addedBlog

  beforeAll(async () => {
    await Blog.remove({})
  
    const blogObjects = helper.initialBlogs.map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
  })

  test('increasing likes by one', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogBefore = blogsAtStart[0]

    const blogEdit = {    
      title: blogBefore.title,
      author: blogBefore.author,
      url: blogBefore.url,
      likes: blogBefore.likes + 1,
    }
    await api
      .put(`/api/blogs/${blogBefore._id}`)
      .send(blogEdit)
      .expect(200)

    const blogsAfterOperation = await helper.blogsInDb()
    const blogAfter = blogsAfterOperation[0]

    expect(blogAfter.likes).toBe(blogBefore.likes+1)
  })
})

describe.only('when there is initially one user at db', async () => {
  beforeEach(async () => {
    await User.remove({})
    const user = new User({ username: 'root', password: 'sekret' })
    await user.save()
  })

  test('POST /api/users succeeds with a fresh username', async () => {
    const usersBeforeOperation = await helper.usersInDb()

    const newUser = {
      username: 'Tester',
      name: 'Tero Ester',
      adult: true,
      password: 'salainen'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const usersAfterOperation = await helper.usersInDb()
    expect(usersAfterOperation.length).toBe(usersBeforeOperation.length+1)
    const usernames = usersAfterOperation.map(u=>u.username)
    expect(usernames).toContain(newUser.username)
  })
  test('POST /api/users fails with proper statuscode and message if username already taken', async () => {
    const usersBeforeOperation = await helper.usersInDb()
  
    const newUser = {
      username: 'root',
      name: 'Superuser',
      adult: false,
      password: 'salainen'
    }
  
    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
  
    expect(result.body).toEqual({ error: 'username must be unique'})
  
    const usersAfterOperation = await helper.usersInDb()
    expect(usersAfterOperation.length).toBe(usersBeforeOperation.length)
  })
  test('POST /api/users fails with proper statuscode and message if password is too short', async () => {
    const usersBeforeOperation = await helper.usersInDb()
  
    const newUser = {
      username: 'Maikki',
      name: 'Marja-Liisa Kirvesniemi',
      adult: true,
      password: 'sa'
    }
  
    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(412)
      .expect('Content-Type', /application\/json/)
  
    expect(result.body).toEqual({ error: 'password must be at least 3 characters'})
  
    const usersAfterOperation = await helper.usersInDb()
    expect(usersAfterOperation.length).toBe(usersBeforeOperation.length)
  })
  test('POST /api/users succeeds and sets the adult field as true if it is not defined by user', async () => {
    const usersBeforeOperation = await helper.usersInDb()
  
    const newUser = {
      username: 'Maikki',
      name: 'Marja-Liisa Kirvesniemi',
      password: 'salasana'
    }
  
    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

  
    const usersAfterOperation = await helper.usersInDb()
    expect(usersAfterOperation.length).toBe(usersBeforeOperation.length+1)
    const usernames = usersAfterOperation.map(u=>u.username)
    expect(usernames).toContain(newUser.username)
    expect(result.body.adult).toBe(true)
  })

})

afterAll(() => {
  server.close()
})