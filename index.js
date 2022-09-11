const express = require("express")
const mongoose = require("mongoose")
const ejs = require("ejs")
const _ = require("lodash")
const app = express()
const bodyParser = require("body-parser")
const Blog = require("./schema/Blog");




mongoose.connect("mongodb://localhost/blogDB").then(function() {
    console.log("Connected to DB")
}).catch(function(err) {
    console.log(err.message)
    app.get("/", function(req, res) {
        res.send("ERR!!")
    })
})

app.use(bodyParser.urlencoded({ extended: false }))


app.use(express.static('public'))

app.set("view engine", "ejs")

app.get("/", function(req, res){
    var lodash = require("lodash")
    app.locals.lodash = lodash
    Blog.find({}, function(err, blogs) {
        res.render("home", {blogs: blogs})
    })
})

app.get("/about", function(req, res) {
    res.render("about")
})

app.get("/contact", function(req, res){
    res.render("contact")
})


app.get("/compose", function(req, res){
    res.render("compose")
})

app.post("/compose",function(req, res){
    Blog.exists({title: req.body.blogTitle}, function(err, doc) {
        if (err) {
            console.log(err)
        } else {
            if (doc!==null)  {
                throw new Error("TITLE HAS BEEN USED.")
            }
        }
    })

    const blog = new Blog ({
        title: req.body.blogTitle,
        content: req.body.blogContent,
        url: _.kebabCase(req.body.blogTitle)
    })


    blog.save(function(err) {
        if (err) {
            console.log(err)
        } else { 
            res.redirect("/")
        }
    })
})


app.get("/blogs/:blogTitle", function(req, res) {
    const requestedBlogTitle = req.params.blogTitle

    Blog.findOne({url: requestedBlogTitle}, function(err, blog) {
        res.render("blog", {title: blog.title, content: blog.content})
    })
})

app.listen(3000, function() {
    console.log("Server created on PORT 3000")
})