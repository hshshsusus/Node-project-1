const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
    fristName:{
        type:String,
        required:true,
        minLength:4,
        maxLength:50
    },
    lastName:{
        type:String,
        required:true
    },
    emailId:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true, 
    },
    password:{
        type:String,
        required:true
    },
    age:{
        type:Number,
    },
    gender:{
        type:String,
        validate(value){
            if(!["male","female","others"].includes(value)){
                throw new Error("gender not valid!!!")
            }
        }
    },
    skills:{
        type:[String]
    },
    about:{
        type:String,
        default:"This is my about....."
    },
    photoURL:{
        type:String,
        validate(value){
            if(!/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/.test(value)){
                throw new Error("URL is not valid!!!")
            }
        }
    }
},
{
    timestamps:true
});

const User = new mongoose.model("User", userSchema);

module.exports = {
    User,
}