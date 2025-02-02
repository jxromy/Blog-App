const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const helper = require('./test_helper')

const Blog = require('../models/blog')

describe('when there is initially some blogs saved', () => {

  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
  })

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('there are two blogs in the beginning', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, 2)
  })

  test('blogs contain a unique id property named "id"', async () => {
    const response = await api.get('/api/blogs')
    const blog_ids = response.body.map(blog => blog.id)

    response.body.forEach(blog => {
        assert('id' in blog)
    })
    const uniqueIds = new Set(blog_ids)
    assert.strictEqual(uniqueIds.size, blog_ids.length)
  })

  describe('addition of a new blog', () => {

    test('a valid blog can be added', async () => {
      const newBlog = {
        title: "this is a valid blog",
        author: "Morgan",
        url: "morgan.com",
        likes: 141
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const response = await api.get('/api/blogs')
      const titles = response.body.map(blog => blog.title)
      assert.strictEqual(response.body.length, helper.initialBlogs.length + 1)
      assert(titles.includes('this is a valid blog'))
    })
    
    test('blog without likes can be added', async () => {
      const newBlog = {
        title: "Blog with missing likes",
        author: "May",
        url: "may.com"
      }
    
      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
    
      const response = await api.get('/api/blogs')
      const likes = response.body.map(blog => blog.likes)
      assert.strictEqual(response.body.length, helper.initialBlogs.length + 1)
      assert(likes.includes(0))
    })
    
    test('blog without title fails with code 400', async () => {
      const newBlog = {
        author: "May",
        url: "may.com",
        likes: 100
      }
    
      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
    })
    
    test('blog without url fails with code 400', async () => {
      const newBlog = {
        title: "Blog without url",
        author: "May",
        likes: 100
      }
    
      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
    })

  })

  describe('deletion of a blog', () => {

    test('a valid blog can be deleted', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]
  
      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
  
      const titles = blogsAtEnd.map(blog => blog.title)
      assert(!titles.includes(blogToDelete.title))
    })
  })

  describe('updating a blog', () => {

    test('a valid blog can be updated', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]
  
      const updatedBlog = {
        title: "Updated blog",
        author: blogToUpdate.author,
        url: blogToUpdate.url,
        likes: 100
      }

      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedBlog)
        .expect(200)

      const blogsAtEnd = await helper.blogsInDb()
      const updatedBlogAtEnd = blogsAtEnd.find(blog => blog.id === blogToUpdate.id)
      const response = await api.get('/api/blogs')

      assert.strictEqual(response.body.length, helper.initialBlogs.length)
      assert.strictEqual(updatedBlogAtEnd.likes, updatedBlog.likes)
      assert.strictEqual(updatedBlogAtEnd.title, updatedBlog.title)
      assert.strictEqual(updatedBlogAtEnd.author, updatedBlog.author)
      assert.strictEqual(updatedBlogAtEnd.url, updatedBlog.url)
    })

  })

})


after(async () => {
  await mongoose.connection.close()
})