const blogRouter = require('express').Router()

const Blog = require('../models/blog')

blogRouter.get('/', (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
    })
})

blogRouter.post('/', (request, response) => {
  const blog = new Blog(request.body)

  blog
    .save()
    .then(result => {
      response.status(201).json(result)
    })
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