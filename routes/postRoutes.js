const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { auth } = require("../middleware/auth.middleware");
const { PostModel } = require("../models/postModel");

const postRouter = express.Router();
postRouter.use(express.json());

postRouter.get("/", auth, async (req, res) => {

    const { device } = req.query

    try {
        if (device) {
            const posts = await PostModel.find({ userID: req.body.userID, device })
            res.send({ "posts": posts })
        } else {
            const posts = await PostModel.find({ userID: req.body.userID })
            res.send({ "posts": posts })
        }

    } catch (err) {
        res.send({ "err": err })
    }

})

postRouter.post("/add", auth, async (req, res) => {

    const { title, body, device, no_of_comments, userID } = req.body

    try {
        const post = new PostModel({ title, body, device, no_of_comments, userID })
        await post.save()
        res.send({ "msg": "New Post added" })
    } catch (err) {
        res.send({ "err": err })
    }

})

postRouter.patch("/update/:id", auth, async (req, res) => {

    const { id } = req.params
    try {
        const post = await PostModel.findByIdAndUpdate({ _id: id }, req.body)
        res.send({ "msg": `Post with id:${id} updated successfully` })
    } catch (err) {
        res.send({ "err": err })
    }

})

postRouter.delete("/delete/:id", auth, async (req, res) => {

    const { id } = req.params
    try {
        const post = await PostModel.findByIdAndDelete({ _id: id })
        res.send({ "msg": `Post with id:${id} deleted successfully` })
    } catch (err) {
        res.send({ "err": err })
    }

})


postRouter.get("/top", auth, async (req, res) => {

    try {
        const posts = await PostModel.find({ userID: req.body.userID }).sort({ no_of_comments: -1 }).limit(3)
        res.send({ "msg": posts })
    } catch (err) {
        res.send({ "err": err })
    }

})



module.exports = {
    postRouter
}