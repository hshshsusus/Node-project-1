const validator = require("validator");
const userSignupValidation = (req) =>{
    const {fristName, lastName, emailId, city, password} = req.body;
    if(!fristName || !lastName){
        throw new Error("name must be required!!");
    }else if(!validator.isEmail(emailId)){
        throw new Error("email is not valid!!!")
    }else if(!validator.isStrongPassword(password)){
        throw new Error("password is not storng!!!");
    }
}

module.exports = {
    userSignupValidation,
}