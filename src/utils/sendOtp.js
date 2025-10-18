const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth:{
        user:process.env.EMAIL,
        pass:process.env.EMAIL_PASS,
    }
})

const sentOtp = (emailId, otp) =>{
    return transporter.sendMail({
        from:process.env.EMAIL,
        to:emailId,
        subject:"Login for Say-Hello app.",
        html:`<p> This otp valid for 10min </p>
        <h2>${otp}</h2>
        `
    })
}

module.exports = sentOtp;