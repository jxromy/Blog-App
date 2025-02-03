const express = require('express')
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const blogRouter = express.Router()

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { blogs: 0 })
	response.json(blogs)
})

blogRouter.post('/', async (request, response) => {
  const { title, author, url, likes } = request.body

	if (!title || !url) {
		return response.status(400).json({ error: 'Title and URL are required' })
	}

	const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = await User.findById(decodedToken.id)

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

blogRouter.delete('/:id', async (request, response) => {
	const id = request.params.id
	await Blog.findByIdAndDelete(id)
	response.status(204).end()
})

blogRouter.put('/:id', async (request, response) => {
	const id = request.params.id
	const { title, author, url, likes } = request.body

	const blog = {
		title: title,
		author: author,
		url: url,
		likes: likes
	}

	const updatedBlog = await Blog.findByIdAndUpdate(id, blog, {new: true})
	response.json(updatedBlog)
})

module.exports = blogRouter