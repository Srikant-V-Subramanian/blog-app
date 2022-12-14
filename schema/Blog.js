const mongoose = require("mongoose")

const blogSchema = mongoose.Schema({
    title: {
        type: String,
        requried: true
    },
    content: {
        type: String,
        requried: true
    },
    url: {
        type: String,
        requried: true
    },
    user: {
        type: String,
        required: true
    }
})


module.exports = mongoose.model('Blog', blogSchema)