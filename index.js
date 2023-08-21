const express = require("express")
const cors = require("cors");
const { connection } = require("./db");
const { userRouter } = require("./routes/userRoutes");
const { postRouter } = require("./routes/postRoutes");
const app = express();

app.use(express.json());
app.use(cors())

app.use("/users", userRouter)
app.use("/posts", postRouter)

app.get("/", (req, res) => {
    res.send("Welcome to InstaMasai Homepage")
})


app.listen(8080, async (req, res) => {
    try {
        await connection
        console.log("connected to DB on port 8080")
    } catch (err) {
        console.log("error", err)
    }
})