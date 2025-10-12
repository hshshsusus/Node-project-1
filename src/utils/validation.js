const validator = require("validator")
const userDataValidation = (req) =>{

    const {fristName, lastName, emailId, password, skills} = req.body;
    if(!fristName || !lastName){
        throw new Error("Name must required");
    }else if(!validator.isEmail(emailId)){
        throw new Error("email is not valid!!!");
    }else if(!validator.isStrongPassword(password)){
        throw new Error("password is not strong!!!")
    }
}

module.exports = userDataValidation;