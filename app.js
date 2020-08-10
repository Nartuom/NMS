const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const app = express()
const fs = require('fs')
const https = require('https')
require('dotenv').config()

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const url = process.env
const uri = `mongodb+srv://nmsAdmin:${url.ADMINSECRET}@nms2020.mifbo.mongodb.net/nmsblog?retryWrites=true&w=majority`
const db = mongoose.connection

// Create mongoose.Schema
const blogSchema = new mongoose.Schema({
  blogDate: Date,
  blogTitle: String,
  blogPost: String
})
// Create Schema Constructor
const BlogPost = mongoose.model('BlogPost', blogSchema)

app.get('/', function (req, res) {
  mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  db.on('error', console.error.bind(console, 'connection error:'))
  const blogData = []

  db.once('open', function () {
    BlogPost.findOne({}, {}, { sort: { blogDate: -1 } }, function (err, post) {
      if (err) return console.log(err)
      blogData.push(post)
      res.render('index', { blog: blogData })
    })
  })
})

app.get('/blog', function (req, res) {
  res.render('blog')
})
app.get('/blogPosts', function (req, res) {
  mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  db.on('error', console.error.bind(console, 'connection error:'))
  const blogPosts = []

  db.once('open', function () {
    BlogPost.find({}, function (err, posts) {
      if (err) return console.log(err)
      blogPosts.push(...posts)
      res.render('blogPosts', { posts: blogPosts })
    })
  })
})

// Post routes
app.post('/blog', bodyParser.text({ type: '*/*' }), function (req, res) {
  mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })

  db.on('error', console.error.bind(console, 'connection error:'))
  db.once('open', function () {
    const newBlog = BlogPost({
      blogDate: `${req.body.blogDate}`,
      blogTitle: `${req.body.blogTitle}`,
      blogPost: `${req.body.blogPost}`
    })
    newBlog.save(function (err, newBlog) {
      if (err) return console.error(err)
    })
  })
  res.redirect('/')
})

if (process.env.USERDOMAIN === 'MARVIN') {
  https.createServer({
    key: fs.readFileSync('../private-key.key'),
    cert: fs.readFileSync('../rootSSL.pem')
  }, app)
    .listen(3000, function () {
      console.log('Example app listening on port 3000! Go to https://localhost:3000/')
    })
} else {
  app.listen(process.env.PORT || 3000, process.env.IP, function () {
    console.log('Server Live at ' + process.env.IP)
  })
}
