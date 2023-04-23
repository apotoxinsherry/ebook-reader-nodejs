const LocalStrategy = require("passport-local").Strategy;
const User = require("./userModule");

function initPassport(passport) {
    passport.use(new LocalStrategy(User.authenticate()));

    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());

}

module.exports = initPassport;