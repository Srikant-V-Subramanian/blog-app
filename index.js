const express = require("express")
const mongoose = require("mongoose")
const ejs = require("ejs")
const _ = require("lodash")
const app = express()
const bodyParser = require("body-parser")
const Blog = require("./schema/Blog");
const User = require("./schema/User")
const {scryptSync, randomBytes} = require("crypto")

var username;


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

app.get("/signUp", function(req, res){
    res.render("signUp")
})

app.post("/signUp", function(req, res) {
    User.exists({useremail: req.body.userEmail}, function(err, doc) {
        if (err) {
            console.log(err)
        } else {
            if (doc!==null)  {
                throw new Error("EMAIL HAS BEEN USED.")
            }
        }
    })

    User.exists({username: req.body.username}, function(err, doc) {
        if (err) {
            console.log(err)
        } else {
            if (doc!==null)  {
                throw new Error("USERNAME HAS BEEN USED.")
            }
        }
    })

    const salt = randomBytes(16).toString("hex")
    const hashedPassword = scryptSync(req.body.userPassword, salt, 64).toString("hex")
    
    const hspass = `${salt}:${hashedPassword}`

    const user = new User ({
        username: req.body.username,
        useremail: req.body.userEmail,
        userpassword: hspass
    })


    user.save(function(err) {
        if (err) {
            console.log(err)
        } else { 
            res.redirect("/")
        }
    })
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
        url: _.kebabCase(req.body.blogTitle),
        user: username,
    })


    blog.save(function(err) {
        if (err) {
            console.log(err)
        } else { 
            res.redirect("/")
        }
    })
})

app.get("/signIn", function(req, res) {
    res.render("signIn")
    app.locals.username = username
})

app.post("/signIn", function(req, res) {
    User.find({username: req.body.username}, function(err, user) {
        const [salt, pass] = user[0].userpassword.split(":")
        const resPass = req.body.userPassword
        const hashedResPass = scryptSync(resPass, salt, 64).toString("hex")

        if (pass == hashedResPass) {
            username = user[0].username
            console.log(username)
        } else {
            throw new Error("INCORRECT PASSWORD")
        }
    })

    res.redirect("/")
})


app.get("/blogs/:user/:blogTitle", function(req, res) {
    const requestedBlogTitle = req.params.blogTitle

    Blog.findOne({url: requestedBlogTitle}, function(err, blog) {
        res.render("blog", {title: blog.title, content: blog.content})
    })
})

app.listen(3000, function() {
    console.log("Server created on PORT 3000")
})