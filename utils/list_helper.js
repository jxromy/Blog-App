const dummy = (blogs) => {
  return 1;
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0);
}

const favoriteBlog = (blogs) => {
  return blogs.reduce((prev, current) => (prev.likes > current.likes) ? prev : current, NaN);
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
      return {}
  }
  let authors = []
  blogs.forEach(blog => {
      const author = authors.find(a => a.author === blog.author)
      if (author === undefined) {
          const newAuthor = {
              author: blog.author,
              blogs: 1
          }
          authors.push(newAuthor)
      } else {
          const changedAuthor = {...author, blogs: author.blogs + 1}
          authors = authors.map(a => a.author !== author.author ? a : changedAuthor)
      }
  })
  let topAuthor = authors[0]
  return authors.reduce((prev, current) => (prev.blogs > current.blogs) ? prev : current, topAuthor);
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
      return {}
  }
  let authors = []
  blogs.forEach(blog => {
      const author = authors.find(a => a.author === blog.author)
      if (author === undefined) {
          const newAuthor = {
              author: blog.author,
              likes: blog.likes
          }
          authors.push(newAuthor)
      } else {
          const changedAuthor = {...author, likes: author.likes + blog.likes}
          authors = authors.map(a => a.author !== author.author ? a : changedAuthor)
      }
  })
  let topAuthor = authors[0]
  return authors.reduce((prev, current) => (prev.likes > current.likes) ? prev : current, topAuthor);
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}