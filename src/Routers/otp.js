const { Router } = require("express");
const { User } = require("../Database/schemaUser");
const sentOtp = require("../utils/sendOtp");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const otpRouter = Router();

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

otpRouter.post("/login/otp", async (req, res) => {
    try {
        const { emailId } = req.body;
        if (!emailId) {
            throw new Error("email is not valid..");
        }

        const isValidUser = await User.findOne({ emailId: emailId });

        if (!isValidUser) {
            throw new Error("Not a valid user!!!");
        }
        const currentTimeStamp = parseInt(new Date().getTime() / 1000);

        if (isValidUser.otp && isValidUser.otpExpiry > currentTimeStamp) {
            throw new Error(`Already otp was sent to this ${emailId} please check your inbox`);
        }

        const otp = parseInt(Math.floor(Math.random() * 1000000));
        const otpExpiry = currentTimeStamp + 600;

        const { _id } = isValidUser;

        const res1 = await User.findOneAndUpdate({ _id: _id }, {
            otp,
            otpExpiry
        }, { returnDocument: "after" });

        await sentOtp(emailId, otp);
        res.send("email sent successfully!")

    } catch (error) {
        res.status(400).send("ERROR :" + error.message);
    }

})

otpRouter.post("/login/otp/verify", async (req, res) => {

    try {
        const emailId = req.body.emailId;
        const recievedOtp = req.body.otp;

        if (!emailRegex.test(emailId)) {
            throw new Error("Invalid email.");
        }

        if (String(recievedOtp).length !== 6) {
            throw new Error("Invalid otp.")
        }

        const isValidUser = await User.findOne({ emailId: emailId, otp: recievedOtp });

        if (!isValidUser) {
            throw new Error("Not a valid user otp.")
        }

        const { otp, otpExpiry } = isValidUser;

        const currentTimeStamp = Math.floor(new Date().getTime() / 1000);

        if (otpExpiry < currentTimeStamp) {
            throw new Error("Otp already expired.");
        }

        if (recievedOtp === otp) {
            const update = await User.findOneAndUpdate({_id:isValidUser._id},{$unset:{otp:"",otpExpiry:""}});
            console.log('update',update)
            const token = await jwt.sign({ _id: isValidUser._id }, process.env.JWT_SECRET_KEY);
            res.cookie("token", token);
            res.status(200).json({ message:"Login successfully", isValidUser })
        }
    } catch (error) {
        res.status(400).json({ message: error.message })
    }


})

module.exports = otpRouter;