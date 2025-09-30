const express = require("express");
const jwt = require("jsonwebtoken");
const {User} = require("../Database/schemaUser");
const requestConnection = require("../Database/requestConnectionSchema");

const requetRouter = express.Router();

requetRouter.post("/request/send/:status/:requestId", async (req, res) =>{
    const {token} = req.cookies;
    const {status, requestId} = req.params;
    // console.log(status, requestId)
    const allowedStatuses = ["interested", "ignore"];
    try {
        const isTokenValid = await jwt.verify(token, "PRASAD@$123");
        if(!isTokenValid){
            throw new Error("Token not valid!!!");
        }
        const {_id} = isTokenValid;
        const loggedinUser = await User.findOne({_id:_id});
        if(!loggedinUser){
            throw new Error("User Not found!!..");
        }

        if(!allowedStatuses.includes(status)){
            return res.status(400).json({
                message:"Invalid status type of :"+status
            })
        }

        if(_id === requestId){
            return res.status(400).json({
                message:"You cannot sent request to your self"
            })
        }
        
        const isRequestIdValid = await User.findOne({_id:requestId});
        if(!isRequestIdValid){
            return res.status(400).json({
                message:"Invalid request id :"+requestId
            })
        }
        
        const data = new requestConnection({
            fromUserId:_id,
            toUserId:requestId,
            status:status
        })

        const isRequestAvail = await requestConnection.findOne(
           { $or:[{fromUserId:_id, toUserId:requestId},{fromUserId:requestId, toUserId:_id}]}
        );
        if(isRequestAvail){
            return res.status(400).send("Request already exist!!")
        }
        await data.save();
        res.json({
            message:"Request sent successfully",
            data
        })

    } catch (error) {
         res.status(400).send("ERROR : " + error.message);
    }
})

requetRouter.post("/request/review/:status/:requestId", async (req, res) =>{
    try {
        const {token} = req.cookies;
        const isTokenValid = await jwt.verify(token, "PRASAD@$123");
        if(!isTokenValid){
            throw new Error("Token got expire!!..")
        }

        const {_id} = isTokenValid;
        const isValidUserID = await User.findOne({_id:_id});
        console.log(isValidUserID)
        if(!isValidUserID){
            throw new Error("user doesn't exist!!..");
        }

        const {status, requestId} = req.params;
        const allowedStatus = ["accepted", "rejected"];
        if(!allowedStatus.includes(status)){
            return res.status(400).json({
                message:"Invalid status type!!..",
            })
        }   
        const data = await requestConnection.findOne({
            _id:requestId,
            toUserId:isValidUserID._id,
            status:"interested"
        });

        if(!data){
            return res.status(400).json({
                message:"request not found!!.."
            })
        }
        data.status = status;
        await data.save();
        res.json({
            message:"request accepted!!..",
            data,
        })
    } catch (error) {
        res.status(400).send("ERROR :"+error.message)
    }
})

module.exports = requetRouter;