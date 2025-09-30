const express = require("express");
const jwt = require("jsonwebtoken");
const { User } = require("../Database/schemaUser");
const requestConnection = require("../Database/requestConnectionSchema")
const userRouter = express.Router();

userRouter.get("/user/requests/received", async (req, res) => {
    try {
        const { token } = req.cookies
        const isTokenValid = await jwt.verify(token, "PRASAD@$123");
        if (!isTokenValid) {
            throw new Error("Token got expire!!..");
        }

        const { _id } = isTokenValid;
        const loggedinUser = await User.findOne({ _id: _id });

        if (!loggedinUser) {
            throw new Error("User not found!!..");
        }
        // console.log(loggedinUser)
        const reqs = await requestConnection.find({
            toUserId: loggedinUser._id,
            status: "interested"
        }).populate("fromUserId", "fristName lastName age skills about gender")
        if (!reqs) {
            return res.status(400).json({
                message: "requests not found"
            });
        }
        
        // console.log(reqList)
        res.json({
            message: "requests found",
            reqs
        })
    } catch (error) {
        res.status(400).send("ERROR :" + error.message);
    }
});

userRouter.get("/user/connections", async (req, res) => {
    try {
        const { token } = req.cookies
        const isTokenValid = await jwt.verify(token, "PRASAD@$123");
        if (!isTokenValid) {
            throw new Error("Token got expire!!..");
        }

        const { _id } = isTokenValid;
        const loggedinUser = await User.findOne({ _id: _id });

        if (!loggedinUser) {
            throw new Error("User not found!!..");
        }

        const connections = await requestConnection.find({
            $or: [
                { fromUserId: loggedinUser._id, status: "accepted" },
                { toUserId: loggedinUser._id, status: "accepted" }
            ],
        }).populate("fromUserId", "fristName lastName age skills about gender")
            .populate("toUserId", "fristName lastName age skills about gender")

        const allConnections = connections.map((user) =>{
            if(user.fromUserId._id.toString() === loggedinUser._id.toString()){
                return user.toUserId;
            }
            return user.fromUserId;
        });
        res.send(allConnections)
    } catch (error) {
        res.status(400).send("ERROR :" + error.message)
    }
})

module.exports = userRouter;