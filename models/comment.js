var mongoose = require("mongoose");

var commentSchema = mongoose.Schema({
    text: String,
    // associate author with logged in user instead of taking user input
    // author: String
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
})

module.exports = mongoose.model("Comment", commentSchema);
