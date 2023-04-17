const jwt = require("jsonwebtoken")
const express = require("express")
const BlogRouter = express.Router()
const bcrypt = require("bcrypt")
const { Blog, Blog } = require("../models/blog.model")


BlogRouter.get("/", async(req, res) => {
    try {
        const Blog = await Blog.find()
        res.status(200).send(Blog);
    } catch (error) {
        res.send({ msg: error.message }).status(500)
    }
})


BlogRouter.post("/add", async(req, res) => {
    try {
        const payload = req.body;

        const Blog = new Blog(payload)
        await Blog.save();
        res.send({ msg: "Blog Created Successfully." }).status(200)
    } catch (error) {
        res.send({ msg: error.message }).status(500)
    }
})


BlogRouter.delete("/delete/:id", async(req, res) => {
    try {

        const BlogId = req.params.id;
        await Blog.findByIdAndDelete({ _id: BlogId })
        res.send({ msg: "Blog Deleted Successfully" }).status(200)

    } catch (error) {
        res.send({ msg: error.message }).status(500)
    }
})


BlogRouter.patch("/update/:id", async(req, res) => {
    try {

        const BlogId = req.params.id;
        const payload = req.body;
        const Blog = await Blog.updateOne({ _id: BlogId }, { $set: payload })
        res.send({ msg: `Blog Updated of ID ${BlogId}` }).status(200)


    } catch (error) {
        res.send({ msg: error.message }).status(500)
    }
})


module.exports = {
    BlogRouter
}