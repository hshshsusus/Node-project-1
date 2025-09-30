const validator = require("validator")
const userDataValidation = (req) =>{

    const {fristName, lastName, emailId, password, skills} = req.body;
    if(!fristName || !lastName){
        throw new Error("Name must required");
    }else if(!validator.isEmail(emailId)){
        throw new Error("email is not valid!!!");
    }else if(!validator.isStrongPassword(password)){
        throw new Error("password is not strong!!!")
    }else if(skills.length >= 5){
        throw new Error("you can less then 5 skills only")
    }
}

module.exports = userDataValidation;