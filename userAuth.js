const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
require('dotenv').config();


mongoose.connect("mongodb://localhost:27017/users");

const userSchema = new mongoose.Schema({
    userName: String, 
    password: String
});


var secret = process.env.superSecretKey;
userSchema.plugin(encrypt, {secret: secret, encryptedFields: ['password']});

const User = new mongoose.model("user", userSchema);

async function validateUser(userName, password) {
    const user = await User.findOne({userName: userName});
    if (user !== null) {
        if(user.password === password) {
            return true;
        }
        return false;
    }

    return false;
}

exports.validateUser = validateUser;





