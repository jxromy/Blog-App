const express = require('express')
const Blog = require('../models/blog')
const { userExtractor } = require('../utils/middleware')
const User = require('../models/user')
// const jwt = require('jsonwebtoken')

const blogRouter = express.Router()

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { blogs: 0 })
	response.json(blogs)
})

blogRouter.post('/', userExtractor, async (request, response) => {
  const { title, author, url, likes } = request.body;
	const user = await User.findById(request.user.id);
	
  if (!user) {
    return res.status(401).json({ error: 'token missing or invalid' });
  }

	if (!title || !url) {
		return response.status(400).json({ error: 'Title and URL are required' })
	}
	
	const blog = new Blog({
		url: url,
		title: title,
		author: author,
		user: user._id,
		likes: likes || 0
	})

	const savedBlog = await blog.save()
	user.blogs = user.blogs.concat(savedBlog._id)
	await user.save()

	response.status(201).json(savedBlog)
})

blogRouter.delete('/:id', userExtractor, async (request, response) => {
	const user = request.user
	const blog = await Blog.findById(request.params.id)

  if (!blog) {
    return response.status(403).json({ error: 'No blogs found with given id' })
  }

  if (blog.user.toString() === user.id.toString()) {
    await Blog.findByIdAndDelete(blog)
    response.status(204).end()
  } else {
    response.status(401).json({ error: 'User does not have authorization to delete this instance' })
  }
})

blogRouter.put('/:id', userExtractor, async (request, response) => {
	const { title, author, url, likes } = request.body
	const user = await User.findById(request.user.id)

	const blog = {
		title: title,
		author: author,
		url: url,
		likes: likes || 0,
		user: user._id
	}

	const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {new: true})
	response.json(updatedBlog)
})

module.exports = blogRouter