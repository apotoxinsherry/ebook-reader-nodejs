const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const app = express();
const book = require("./books");
var _ = require('lodash');
const passport = require("passport");
const session = require("express-session");
const fs = require("fs");
const path = require('path');


app.use(session({
    secret: process.env.superSecretKey,
    resave: false,
    saveUninitialized: false
}
));

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

const initPassport  = require("./passport-session");

initPassport(passport);

app.use(passport.initialize());
app.use(passport.session());



book.reScan(); 

app.get("/index", function(req, res) {
    if (req.isAuthenticated()) {
        res.render("index", {bookList: book.bookArr, bodyEx: 69});
    }
    else {
        res.redirect("/error");
    }
})

app.post("/logout", function(req, res){
    req.logOut(function(err){
        if (err){
            console.log(err);
        }

        res.redirect("/");
    });
})


app.get("/", function(req, res) {
    if(req.isAuthenticated()) {
        res.redirect("/index");
    }

    else {
        res.redirect("/login");
    }
});

app.get("/login", function(req, res) {
    if(req.isAuthenticated()) {
        res.redirect("/");
    }

    else {
        res.render("login");
    }
})


app.get("/books/:book", function (req, res) {
    if (req.isAuthenticated()) {
        book.bookArr.forEach(function (file) {
            if (file['title'] === req.params.book) {
                res.sendFile(file['directory']);
            }
        })
    }

});



app.get("/renderer/:bookLoc", function(req, res) {
    if(req.isAuthenticated()) {
        res.render("reader", {bookLoc: req.params.bookLoc});
    }
    else {
        res.send("Unauthorized access");
    }
    
});


app.post("/refresh", function(req, res) {
    book.reScan();
    res.redirect("/index");
})


app.post("/", passport.authenticate('local', { failureRedirect: '/error' }), function(req, res) {
    res.redirect("/index");
})

app.get("/error", function(req, res) {
    res.send("Unauthorized access");
})

app.listen(3000, function() {
  console.log('Server started on port 3000');
});