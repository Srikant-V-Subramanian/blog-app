const express = require("express")
const ejs = require("ejs")
const app = express()
const bodyParser = require("body-parser")

app.use(bodyParser.urlencoded({ extended: false }))

var posts = []

app.use(express.static('public'))


app.set("view engine", "ejs")

app.get("/", function(req, res){
    res.render("home")
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

app.post("/compose", function(req, res){
    console.log(req.body.blogTitle)
})

app.listen(3000, function() {
    console.log("Server listening on PORT 3000")
})