const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const app = express();
var _ = require('lodash');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

const fs = require("fs");
const path = require('path');

let books = [];


// use express to create a route for the specified location. create a get request for book location, where the location
// used by the client side epubjs is just /book/name or smth like that. 
// Express handles which book to send. 

const dirPath = __dirname + "/books";

let scanbook = function () {
    fs.readdir(dirPath, function (err, files) {
        if (err) {
            console.log(err)
        } else {
            files.forEach(function (file) {
                if (path.extname(file) === ".epub") {
                    let book = {
                        title: file,
                        directory: dirPath + "/" + file
                    }

                    books.push(book);
                }
            })
        }
    });
}

scanbook(); 

app.get("/", function(req, res) {
    res.render("index", {bookList: books, bodyEx: 69});
});

//this part is sussy
app.get("/books/:book", function(req, res) {
    books.forEach(function(file) {
        if(file['title'] === req.params.book) {
            res.sendFile(file['directory']);
        }
    })
});



app.get("/renderer/:bookLoc", function(req, res) {
    res.render("reader", {bookLoc: req.params.bookLoc});
});

app.get("/reader", function(req, res) {
    res.render("reader")
})

app.post("/refresh", function(req, res) {
    scanbook();
    res.redirect("/")
})

app.listen(3000, function() {
  console.log('Server started on port 3000');
});