const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/users");

const userSchema = new mongoose.Schema({
    userName: String, 
    password: String
});

