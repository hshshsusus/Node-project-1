const mongoose = require("mongoose");
const validator = require("validator")

const userSchema = mongoose.Schema({
    fristName:{
        type:String,
        required:true,
        minLength:4,
        maxLength:50
    },
    lastName:{
        type:String
    },
    city:{
        type:String
    },
    age:{
        type:Number
    },
    emailId:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true
    },
    password:{
        type:String,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Password not strong :");
            }
        }
    }
})

module.exports = new mongoose.model("User", userSchema);