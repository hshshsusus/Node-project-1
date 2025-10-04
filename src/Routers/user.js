const express = require("express");
const jwt = require("jsonwebtoken");
const { User } = require("../Database/schemaUser");
const requestConnection = require("../Database/requestConnectionSchema");
const { set } = require("mongoose");
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
        // console.log("erqs",reqs)
        res.send(reqs)
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

userRouter.get("/feed", async (req, res) =>{
    try {
        const page = req.query.page || 1;
        const limit = req.query.limit || 10;
        const skip = (page - 1)*limit;

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

        const connectionRequests = await requestConnection.find({
            $or:[{fromUserId:loggedinUser._id},{toUserId:loggedinUser._id}]
        }).select("fromUserId toUserId")

        const hideAllConnectionsUsers = new Set();

        connectionRequests.forEach(ele => {
            hideAllConnectionsUsers.add(ele.fromUserId.toString())
            hideAllConnectionsUsers.add(ele.toUserId.toString())
        });
        
        const hideUsersFromFeed = await User.find({
            $and:[{_id:{$nin:Array.from(hideAllConnectionsUsers)}},{_id:{$ne:loggedinUser._id}}]
        }).select("fristName lastName age gender skills about photoURL").skip(skip).limit(limit)
        res.send(hideUsersFromFeed)
    } catch (error) {
        res.status(400).send("ERROR :"+error.message)
    }
})

module.exports = userRouter;