const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
require('dotenv').config();


mongoose.connect("mongodb://localhost:27017/users");

const userSchema = new mongoose.Schema({
    username: String, 
    password: String
});



userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model("user", userSchema);


module.exports = User;





