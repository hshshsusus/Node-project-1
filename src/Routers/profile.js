const express = require("express");
const { User } = require("../Database/schemaUser");
const jwt = require("jsonwebtoken")


const profileRouter = express.Router();

profileRouter.get("/profile/view", async (req, res) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            throw new Error("Token expired!!!");
        }
        const isTokenValid = await jwt.verify(token, "PRASAD@$123");

        if (!isTokenValid) {
            throw new Error("Token expired!!!")
        }
        const { _id } = isTokenValid;
        const loggedUser = await User.findOne({ _id: _id }).select("fristName lastName age gender skills about photoURL");
        res.send(loggedUser)
    } catch (error) {
        res.status(400).send("ERROR : " + error.message);
    }
})

profileRouter.patch("/profile/edit", async (req, res) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            throw new Error("token was expired!!!");
        }
        const isTokenValid = await jwt.verify(token, "PRASAD@$123");
        if (isTokenValid) {
            const { _id } = isTokenValid;
            const loggedinUser = await User.findOne({ _id: _id });
            if (!loggedinUser) {
                throw new Error("user doesn't exist!!!");
            }
            const allowedFields = ["fristName", "lastName", "age", "skills", "about", "photoURL"];
            console.log(req.body)
            Object.keys(req.body).every(field => allowedFields.includes(field));
            Object.keys(req.body).forEach((key) => (loggedinUser[key] = req.body[key]));

            await loggedinUser.save();
            res.send(loggedinUser);

        }
    } catch (error) {
        res.status(400).send("ERROR : " + error.message);
    }
})

module.exports = profileRouter;