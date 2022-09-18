const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    username: {
        type: String,
        requried: true
    },
    useremail: {
        type: String,
        requried: true
    },
    userpassword: {
        type: String,
        requried: true
    }
})


module.exports = mongoose.model('User', userSchema)