const express = require("express")
const app = express()
require("dotenv").config()
const { connection } = require("./config/db")
const { auth } = require("./middlwares/auth")
const { userRouter } = require("./routes/user.route")
const { BlogRouter } = require("./routes/blog.route")




app.use(express.json())
app.use(auth)
app.use("/user", userRouter)
app.use("/Blog", BlogRouter)

app.get("/", (req, res) => {
    res.send({ msg: "Base End Point" }).status(200)
})



app.listen(process.env.port, async() => {
    try {
        await connection
        console.log("DB Connected")
    } catch (error) {
        console.log("Not Connected", error.message)
    }
    console.log(`App is running on Port ${process.env.port}`)
})