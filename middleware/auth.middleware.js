const jwt = require("jsonwebtoken");
const { blacklist } = require("../blacklist");

const auth = async (req, res, next) => {

    const token = req.headers.authorization;

    let logoutUsers = blacklist.filter((el) => el == token)

    if (logoutUsers[0]) {
        res.send("Please Login !!")

    } else {
        try {
            if (token) {
                var decoded = await jwt.verify(token, 'krishna')
                if (decoded) {
                    req.body.userID = decoded.userID;
                    next()
                } else {
                    res.send({ "msg": "Check token again" })
                }
            } else {
                res.send({ "msg": "Please provide token" })
            }
        } catch (err) {
            res.send({ "err": err })
        }
    }



}

module.exports = {
    auth
}