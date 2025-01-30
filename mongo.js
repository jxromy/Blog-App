const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://jeromy:${password}@cluster0.xjht5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)
mongoose.connect(url).then(() => {
  const blogSchema = new mongoose.Schema({
    title: String,
    author: String,
    url: String,
    likes: Number
  })
  
  const Blog = mongoose.model('Blog', blogSchema)
  
  // const blog = new Blog({
  //   title: "Test",
  //   author: "Terri",
  //   url: "xyz.com",
  //   likes: 500
  // })
  
  // blog.save().then(result => {
  //   console.log('blog saved!')
  //   mongoose.connection.close()
  // })
  

  Blog.find({}).then(result => {
    result.forEach(blog => {
      console.log(blog)
    })
    mongoose.connection.close()
  })
})