const express = require("express");
const { connectDB } = require("./src/cofing/database");
const User = require("./src/database/userSchema");
const { userSignupValidation } = require("./src/utils/validation");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");


const app = express();

const port = 7777;
// console.log(db)

app.use(express.json());
app.use(cookieParser())

app.post("/signup", async (req, res) => {
    //validation
    try {
        userSignupValidation(req);
        //encryption
        console.log(req.body.password)
        const passwordHash = await bcrypt.hash(req.body.password, 10);
        console.log(passwordHash)

        const { fristName, lastName, emailId, city, password } = req.body;
        const user = new User({
            fristName,
            lastName,
            emailId,
            city,
            password: passwordHash
        });
        await user.save();
        res.send(user);
    } catch (error) {
        res.status(400).send("somthing went wrong??" + error.message)
    }

})

app.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;
        const user = await User.find({ emailId: emailId });
        // console.log(user[0]._id)
        if (!user) {
            throw new Error("Invalid crendtials..!");
        }
        const isPasswordValid = await bcrypt.compare(password, user[0]?.password);
        if (isPasswordValid) {

            const token = await jwt.sign({ _id: user[0]._id }, "Dev@$123");
            console.log(token)
            res.cookie("token", token);
            res.send("Login successfully..");
        } else {
            throw new Error("Invalid crendtials..!");
        }
    } catch (error) {
        res.status(400).send("ERROR : " + error.message)
    }

})

app.get("/profile", async (req, res) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            throw new Error("Token expired!!")
        }
        const isValidToken = await jwt.verify(token, "Dev@$123");
        if(!isValidToken){
            throw new Error("token expired!!");
        }
        const { _id } = isValidToken;
        const user = await User.find({ _id });
        if(!user){
            throw new Error("User does not exist!!")
        }
        res.send(user)
    } catch (error) {
        res.status(400).send("ERROR : " + error.message)
    }

})

app.get("/user", async (req, res) => {
    // console.log(req.body.emailId)
    try {
        const user = await User.find({ emailId: req.body.emailId })
        if (user.length === 0) {
            res.status(400).send("no data found");
        }
        else {
            res.send(user)
        }
        res.send(user)
    } catch (error) {
        res.status(400).send("user not found!!" + error.message)
    }

})

app.get("/feed", async (req, res) => {
    try {
        const user = await User.findOne({ emailId: req.body.emailId });
        if (user.length === 0) {
            res.status(400).send("user not found!!");
        } else {
            res.send(user)
        }
    } catch (error) {
        res.status(400).send("user not found!!" + error.message)
    }

})

connectDB()
    .then(() => {
        console.log("database connected");
        app.listen(port, () => {
            console.log("server running at port " + port + "...")
        })
    })
    .catch((err) => {
        console.log(err.message)
    })
