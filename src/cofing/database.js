const mongoose = require("mongoose");

const connectDB = async () =>{
    await mongoose.connect("mongodb+srv://prasadnode:root123@prasadnode.vgqi4l7.mongodb.net/nodeMongo")
}

module.exports = {
    connectDB,
}