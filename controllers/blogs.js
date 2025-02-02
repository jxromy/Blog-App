const express = require('express')
const Blog = require('../models/blog')

const blogRouter = express.Router()

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
	response.json(blogs)
})

blogRouter.post('/', async (request, response) => {
  const { title, author, url, likes } = request.body

	if (!title || !url) {
		return response.status(400).json({ error: 'Title and URL are required' })
	}

	const blog = new Blog({
		title: title,
		author: author,
		url: url,
		likes: likes || 0
	})
	
	const savedBlog = await blog.save()
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