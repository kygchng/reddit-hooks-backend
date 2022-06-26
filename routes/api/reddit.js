const express = require("express");
const router = express.Router();

const User = require("../../models/User");
const Subreddit = require("../../models/Subreddit");
const Post = require("../../models/Post");
const Comment = require("../../models/Comment");
var ObjectId = require("mongodb").ObjectId;

router.post("/create/sub", async(req, res) => {
    const duplicateSub = await Subreddit.findOne({name: req.body.name});
    if(duplicateSub) {
        return res.status(400).send({});
    } else {
        const newSub = new Subreddit(req.body);
        newSub.save().catch(err => console.log(err));
        return res.status(200).send(newSub);
    }
})

router.post("/create/user", async(req, res) => {
    const duplicateUser = await User.findOne({username: req.body.username});
    if(duplicateUser) {
        return res.status(400).send({});
    } else {
        const newUser = new User(req.body);
        newUser.save().catch(err => console.log(err));
        return res.status(200).send(newUser);
    }
})

router.post("/create/post", async(req, res) => {
    //404 if sub or user are null
    const subId = ObjectId(req.body.subID);
    const sub = await Subreddit.findById(subId);
    console.log(sub);

    const userId = ObjectId(req.body.user);
    console.log(req.body.user)
    console.log(userId)
    
    sub.users.push(userId);
    var updatedUsersList = sub.users;
    console.log(updatedUsersList)

    const updatedSubValues = {
        name: sub.name,
        users: updatedUsersList
    }
    await Subreddit.findOneAndUpdate({_id: subId}, updatedSubValues);

    // need to update subreddit 
    // Subrreddit.findOneAndUpdate(query , updated value)


    const newPost = new Post(req.body);
    newPost.save().catch(err => console.log(err));
    return res.status(200).send(newPost);
})

router.post("/create/comment", async(req, res) => { 
    //404 if user is null
    const newComment = new Comment(req.body);
    newComment.save().catch(err => console.log(err));
    return res.status(200).send(newComment);
})

router.get("/fetch/posts/:subID", async(req, res) => {
    const subId = ObjectId(req.params.subID);
    const sub = await Subreddit.findById(subId);
    if(sub) {
        const posts = await Post.find({subID: req.params.subID});
        return res.status(200).send(posts);
    } else {
        return res.status(404).send({});
    }
})

router.get("/fetch/comments/:postID", async(req, res) => {
    //check post is not null

    const postId = ObjectId(req.params.postID);
    const post = await Post.findById(postId);
    if(post) {
        const comments = await Comment.find({postID: req.params.postID});
        return res.status(200).send(comments);
    } else {
        return res.status(404).send({});
    }
})
router.put("/like/comment/:commentID/:userID", async(req, res) => {
    const commentId = ObjectId(req.params.commentID);
    const comment = await Comment.findById(commentId);

    const userId = ObjectId(req.params.userID);
    const user = await User.findById(userId);
    
    //check if comment and user are not null -- if null then 404

    //check if user is already in the likes array (if so, then dislike) (if not, then like)
    if(comment.likes.includes(userId)) {
        //remove like
        const index = comment.likes.indexOf(userId);
        const updatedLikes = comment.likes.splice(index, 1);

        //var filteredLikesList = comment.likes.filter((id) => !(id.equals(userId)));

        const updatedCommentValues = {
            user: comment.user,
            likes: updatedLikes, //of user ObjectID
            text: comment.text,
            date: comment.date,
            postID: comment.postID
        }

        await Comment.findOneAndUpdate({_id: commentId}, updatedCommentValues)
        return res.status(200).send(comment);
    } else {
        //add like
        comment.likes.push(userId);
        const updatedLikes = comment.likes;

        const updatedCommentValues = {
            user: comment.user,
            likes: updatedLikes, //of user ObjectID
            text: comment.text,
            date: comment.date,
            postID: comment.postID
        }

        await Comment.findOneAndUpdate({_id: commentId}, updatedCommentValues)
        return res.status(200).send(comment);
    }
})

module.exports = router;