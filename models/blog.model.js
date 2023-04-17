const mongoose = require("mongoose")


const BlogSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    commentsNos: {
        type: Number,
        required: true
    }

}, {
    versionKey: false
})

const Blog = mongoose.model("Blog", BlogSchema)


module.exports = {
    Blog
}