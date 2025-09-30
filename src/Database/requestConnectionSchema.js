const mongoose = require("mongoose");

const requestConnectionSchema = new mongoose.Schema({
    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User"
    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User"
    },
    status:{
        type:String,
        required:true,
        enum:{
            values:["ignore", "interested", "accepted", "rejected"],
            message:`{VALUE} is not correct status type`
        }
    }
},{
    timestamps:true
});

const requestConnection = new mongoose.model("requestConnection", requestConnectionSchema);

module.exports = requestConnection;