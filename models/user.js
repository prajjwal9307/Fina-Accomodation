const mongoose = require("mongoose");

const passportLocalMongoose=require("passport-local-mongoose")
const userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    username: {
        type: String,
        unique: true, // Ensure username is unique
    },
});


userSchema.plugin(passportLocalMongoose);
module.exports=mongoose.model("User",userSchema);