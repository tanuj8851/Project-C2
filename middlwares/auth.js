const jwt = require("jsonwebtoken")
const { blacklist } = require("../models/blacklist.model")
require("dotenv").config()
const fetch = (...args) =>
    import ('node-fetch').then(({ default: fetch }) => fetch(...args));

const auth = async(req, res, next) => {
    try {

        const { token } = req.cookies;
        const istokenBlacklisted = await blacklist.findOne({ token: token })

        if (istokenBlacklisted)
            return res.send({ "msg": "Please login" }).status(400)

        const isValidToken = jwt.verify(token, process.env.PASSTOKEN)

        if (!isValidToken) {

            const newAccessToken = await fetch("http://localhost:6060/auth/refreshtoken", {
                headers: {
                    "content-type": "application/json",
                    "Authorization": req.cookies.Refreshtoken
                }
            }).then((res) => res.json())

            res.cookies("Refreshtoken", Refreshtoken, { maxAge: 1000 * 60 * 3 })
            next();

        }

        req.payload = isValidToken
        next()



    } catch (error) {
        res.send({ msg: error.message }).status(500)
    }
}

module.exports = { auth }