const express = require("express")
const userRouter = express.Router()
const { user } = require("../models/user.model")
const { blacklist } = require("../models/blacklist.model")

require("dotenv").config()

const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

userRouter.post("/register", async(req, res) => {
    try {

        const { name, email, password, role } = req.body;

        const isuserPresent = await user.findOne({ email })

        if (isuserPresent) {
            return res.send("Already a User. Plesease login!").status(400)
        }

        const hashedpassword = bcrypt.hashSync(password, 8)
        const newUser = new user({...req.body, password: hashedpassword })
        await newUser.save()
        res.send({ msg: "new user has been registered", user: newUser });


    } catch (error) {
        res.status(400).send({ msg: error.message });
    }
})

userRouter.post("/login", async(req, res) => {
    try {

        const { email, password } = req.body;
        const isuserPresent = await user.findOne({ email })
        if (!isuserPresent) {
            return res.send({ msg: "Not a User. Please register first!" }).status(400)
        }

        const isPasswordCorrect = bcrypt.compareSync(password, isuserPresent.password)
        if (!isPasswordCorrect) return res.status(400).send({ msg: "Wrong Credentials" })

        //generate token

        const accesstoken = jwt.sign({ email, role: isuserPresent.role }, process.env.PASSTOKEN, { expiresIn: "1m" })
        const refreshtoken = jwt.sign({ email, role: isuserPresent.role }, process.env.RTOKEN, { expiresIn: "3m" })

        res.cookie("token", accesstoken, { maxAge: 1000 * 60 })
        res.cookie("Refreshtoken", refreshtoken, { maxAge: 1000 * 60 * 2 })
        res.send({ msg: "login successful" }).status(200)

    } catch (error) {
        res.status(400).send({ msg: error.message });
    }
})

userRouter.get("/logout", async(req, res) => {
    try {

        const { token, Refreshtoken } = req.cookies;
        const blacklistAccesstoken = new blacklist(token)
        const blacklistRefreshtoken = new blacklist(Refreshtoken)
        await blacklistAccesstoken.save()
        await blacklistRefreshtoken.save()
        res.status(200).send({ "msg": "logout successful" })



    } catch (error) {
        res.status(400).send({ msg: error.message });
    }
})

userRouter.get("/refreshtoken", async(req, res) => {
    try {

        const refreshtoken = req.cookies.Refreshtoken || req.headers.authorization;
        const isTokenBlacklisted = await blacklist.findOne({ token: refreshtoken })
        if (isTokenBlacklisted) return res.status(400).send({ msg: "Token Blacklisted Please login Again" })

        const isValidToken = jwt.verify(refreshtoken, process.env.RTOKEN)
        if (!isValidToken) return res.status(400).send({ msg: "Please login again" });

        const newAccessToken = jwt.sign({ email: isValidToken.email, role: isValidToken.role }, process.env.PASSTOKEN, { expiresIn: "1m" });

        res.cookie("token", accesstoken, { maxAge: 1000 * 60 })
        res.send({ msg: "Token Generated Successfully" }).status(200)

    } catch (error) {
        res.status(400).send({ msg: error.message });
    }
})

module.exports = {
    userRouter
}