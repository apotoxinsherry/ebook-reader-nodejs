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

const validateUser  = require("./userAuth")

let books = [];

const validExtensions = [".epub", ".mobi", ".azw3", ".cbr", ".cbz", ".fbz"];


const dirPath = __dirname + "/books";

var isAuthenticated = false; 


function duplicateBookChecker(array, obj) {
    return array.find(item => item.title === obj.title && item.directory === obj.directory) !== undefined;
  }

let scanbook = function () {
    fs.readdir(dirPath, function (err, files) {
        if (err) {
            console.log(err)
        } else {
            files.forEach(function (file) {
                let ext = path.extname(file);
                if (validExtensions.includes(ext)) {
                    let book = {
                        title: file,
                        directory: dirPath + "/" + file
                    }
                    // check if the book already exists in the array. if not, it adds to it. 
                    if (!duplicateBookChecker(books, book)) {
                        books.push(book);
                    }
                    
                }
            })
        }
    });
}

scanbook(); 

app.get("/", function(req, res) {
    if(isAuthenticated) {
        res.redirect("/index");
    }
    else {
        res.render("login");
    }
    
    
});

app.get("/index", function(req, res) {
    if(isAuthenticated) {
        res.render("index", {bookList: books, bodyEx: 69});
    }
    else {
        res.send("Unauthorized access");
    }
    
})

app.get("/books/:book", function (req, res) {
    if (isAuthenticated) {
        books.forEach(function (file) {
            if (file['title'] === req.params.book) {
                res.sendFile(file['directory']);
            }
        })
    }

});



app.get("/renderer/:bookLoc", function(req, res) {
    if(isAuthenticated) {
        res.render("reader", {bookLoc: req.params.bookLoc});
    }
    else {
        res.send("Unauthorized access");
    }
    
});

// app.get("/reader", function(req, res) {
//     res.render("reader")
// })

app.post("/refresh", function(req, res) {
    scanbook();
    res.redirect("/index");
})


app.post("/", async function(req, res) {
    console.log(req.body)
    const userName = req.body.uname;
    const password = req.body.pword;

    console.log("Username is " + userName);

    validateUser.validateUser(userName, password).then(function(value) {
        console.log(value);
        isAuthenticated = value;
        if(isAuthenticated) {
            res.redirect("/index");
        }
        else {
            res.redirect("/error");
    
        }
    });

    

})

app.get("/error", function(req, res) {
    res.send("Unauthorized access");
})

app.listen(3000, function() {
  console.log('Server started on port 3000');
});