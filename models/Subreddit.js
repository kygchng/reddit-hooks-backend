const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SubredditSchema = new Schema({
    name: String,
    users: Array, // ObjectID of users
});

module.exports = mongoose.model("Subreddit", SubredditSchema);