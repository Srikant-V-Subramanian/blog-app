const express = require("express")
const bodyParser = require("body-parser")
const lodash = require("lodash")
const app = express()
const crypto = require("crypto")

let currentUser = "admin"
let currentName = "Srikant Subramanian (admin)"
let users = [{ 'username': 'admin', 'name': 'Srikant Subramanian (admin)' }]
let blogs = [{ 'title': 'introduction', 'content': 'whatever', 'url': 'introduction', 'user': 'admin' }]

users.forEach((user) => {
    if (user.username === currentUser) {
        currentName = user.username
    }
})

// const hash = crypto.createHash('sha256').update('admin').digest('hex')

app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());

app.get("/sign-in", (req, res) => {
    res.render('./pages/SignIn')
})

app.get("/sign-up", (req, res) => {
    res.render('./pages/SignUp')
})



app.get("/blogs/:blogTitle", (req, res) => {
    blogs.forEach((el) => {
        if (el.url === req.params.blogTitle) {
            res.render("./pages/Blog", {
                title: el.title,
                content: el.content,
                user: el.user,
                users: users,
            })
        }
    })
})

app.get("/", (req, res) => {
    res.render("pages/home", {
        name: currentName,
        blogs: blogs,
        lodash: lodash,
        users: users,
        currentUser: currentUser
    })
})



app.post("/", (req, res) => {
    var title = req.body.title;
    var content = req.body.content;

    blogs.forEach((blog) => {
        if (blog.title == title) {
            throw Error('BLOG WITH THE SAME TITLE EXISTS YOU DUMB B')
        }
    })
    const blog = {
        "title": title.substring(0, 1).toUpperCase() + title.substring(1, title.length),
        "content": content,
        "url": lodash.kebabCase(title),
        "user": currentUser
    }
    blogs.push(blog)
    res.redirect("/")
})


app.post('/sign-in', (req, res) => {
    var username = req.body.user_name
    var password = req.body.password

    var userPassword = ""
    var name = ""

    users.forEach((user) => {
        if (user.username === username) {
            userPassword = user.password
            name = user.name
        }
    })

    const [pass, salt] = userPassword.split(":")

    const givenPassowrdHased = crypto.createHash('sha256').update(password).digest('hex')

    if (givenPassowrdHased === pass && username !== 'admin') {
        currentUser = username
        res.redirect("/")
    } else {
        throw Error("INCORRECT USERNAME PASSWORD COMBINATION")
    }

    currentUser = username
    currentName = name


})

app.post('/sign-up', (req, res) => {
    var email = req.body.email
    var name = req.body.name
    var password = req.body.password
    var username = req.body.user_name

    users.forEach((user) => {
        if (user.email == email) {
            throw Error("USER WITH THE SAME EMAIL ADDRESS ALREADY EXISTS!")
        }
    })

    const salt = crypto.randomBytes(32).toString('hex')

    const hasedPassword = crypto.createHash('sha256').update(password).digest('hex')

    const finalPassword = hasedPassword + ":" + salt

    const newUser = {
        'name': lodash.startCase(name),
        'username': username,
        'email': email,
        'password': finalPassword
    }

    users.push(newUser)

    currentUser = username
    currentName = name

    res.redirect("/")
})

app.listen(3030, () => {
    console.log("http://localhost:3030")
})

