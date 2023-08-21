const express = require("express");
const bcrypt = require("bcrypt");
const { UserModel } = require("../models/userModel");
const jwt = require("jsonwebtoken");
const { blacklist } = require("../blacklist");

const userRouter = express.Router();

userRouter.use(express.json());

userRouter.post("/register", async (req, res) => {

    const { name, email, gender, password, age, city, is_married } = req.body
    try {
        const user = await UserModel.findOne({ email })
        if (user) {
            res.status(200).send({ "message": "User already exist, please login" })
        } else {
            bcrypt.hash(password, 5, async (err, hash) => {
                try {
                    if (err) {
                        res.send({ "error": err })
                    } else {
                        const newUser = new UserModel({ name, email, gender, password: hash, age, city, is_married })
                        await newUser.save()
                        res.send({ "msg": "New User Registerd" })
                    }
                } catch (err) {
                    res.send({ "error": err })
                }
            });
        }
    } catch (err) {
        res.status(400).send({ "error": err })
    }
})

userRouter.post("/login", async (req, res) => {

    const { email, password } = req.body;
    try {
        const user = await UserModel.findOne({ email })
        console.log(user)
        if (user) {
            bcrypt.compare(password, user.password, async (err, result) => {

                if (result) {
                    const token = jwt.sign({ userID: user._id }, 'krishna', { expiresIn: '7d' });
                    res.send({ "msg": "Login Successful", "token": token })
                }
                else if (err) {
                    res.send({ "msg": err })
                }
            });
        } else {
            res.send("Please register")
        }
    } catch (err) {
        res.status(400).send({ "error": err })
    }
})

userRouter.get("/logout", (req, res) => {
    const token = req.headers.authorization;
    if (token) {
        var decoded = jwt.verify(token, 'krishna')
        if (decoded) {
            blacklist.push(token)
            res.send({ "msg": "Logged Out !!!" })
        } else {
            res.send({ "msg": "Check token again" })
        }
    } else {
        res.send({ "msg": "Please login" })
    }
})


module.exports = { userRouter }