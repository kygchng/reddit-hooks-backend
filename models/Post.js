const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    user: String, //object id
    text: String,
    date: String,
    subID: String
});

module.exports = mongoose.model("Post", PostSchema);