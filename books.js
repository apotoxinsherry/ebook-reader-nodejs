const fs = require("fs");
const path = require('path');


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

module.exports.bookArr = books;
module.exports.reScan = scanbook;