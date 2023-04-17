const mongoose = require("mongoose")

const blacklistSchema = mongoose.Schema({
    token: {
        type: String,
        required: true
    }
}, {
    versionKey: false
})


const blacklist = mongoose.model("blacklist", blacklistSchema)


module.exports = {
    blacklist
}