const mongoose = require("mongoose")

const blogSchema = mongoose.Schema({
    title: {
        type: String,
        requried: true
    },
    content: {
        type: String,
        requried: true
    }
})


module.exports = mongoose.model('Blog', blogSchema)