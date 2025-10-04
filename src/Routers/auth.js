
const { User } = require("../Database/schemaUser");
const userDataValidation = require("../utils/validation");
const bcrypt = require("bcrypt");
const express = require("express");
const jwt = require("jsonwebtoken");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
    try {
        const { fristName, lastName, emailId, password, age, skills, photoURL, gender } = req.body;
        userDataValidation(req);
        const passwordHash = await bcrypt.hash(password, 10);
        const user = new User({
            fristName,
            lastName,
            emailId,
            age,
            skills,
            password: passwordHash,
            photoURL,
            gender,
        })
        await user.save();
        res.send(user)
    } catch (error) {
        res.status(400).send("ERROR : " + error.message)
    }
})

authRouter.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;
        const user = await User.findOne({ emailId: emailId });
        if(!user){
            throw new Error("Invalid creditionals");
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(isPasswordValid){
            const token = await jwt.sign({_id:user._id}, "PRASAD@$123");
            res.cookie("token", token)
            res.send(user);
        }else{
            throw new Error("Invalid credentials");
        }
    } catch (error) {
        res.status(400).send("ERROR : " + error.message)
    }
})

authRouter.post("/logout", async (req, res) =>{
   res.cookie("token",null,{
    expires: new Date(Date.now())
   })
   res.send()
});

module.exports = authRouter;