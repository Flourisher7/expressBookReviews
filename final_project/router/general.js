const express = require('express');
let books = require("./booksdb.js");
//let isValid = require("./auth_users.js").isValid;
//let users = require("./auth_users.js").users;
const public_users = express.Router();

let users = []
//let users2 = [{"username": "awesome", "password": "sogood7&%"}]
const doesExist = (username)=>{
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
  }

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (username && password) {
      if (!doesExist(username)) { 
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});    
      }
    } 
    return res.status(404).json({message: "Unable to register user."});
  });

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn])
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author
    let count = 0;
    for (var j in books) {
        if (books.hasOwnProperty(j)) count++;
    }
    let i = 1;
    for (i = 1; i<(count+1); i++) {
        let book = books[i]
        if (author==book["author"]) {
            res.send(books[i]);
        }
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title
    let count = 0;
    for (var j in books) {
        if (books.hasOwnProperty(j)) count++;
    }
    let i = 1;
    for (i = 1; i<(count+1); i++) {
        let book = books[i]
        if (title==book["title"]) {
            res.send(books[i]);
        }
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    console.log(books[2]["reviews"])
    res.send(books[isbn]["reviews"])
});

// Task 10 
// Add the code for getting the list of books available in the shop (done in Task 1) using Promise callbacks or async-await with Axios

function getBookList(){
    return new Promise((resolve,reject)=>{
      resolve(books);
    })
  }
  
  // Get the book list available in the shop
  public_users.get('/',function (req, res) {
    getBookList().then(
      (bk)=>res.send(JSON.stringify(bk, null, 4)),
      (error) => res.send("denied")
    );  
  });
  
  // Task 11
  // Add the code for getting the book details based on ISBN (done in Task 2) using Promise callbacks or async-await with Axios.
  
  function getFromISBN(isbn){
    let book_ = books[isbn];  
    return new Promise((resolve,reject)=>{
      if (book_) {
        resolve(book_);
      }else{
        reject("Unable to find book!");
      }    
    })
  }
  
  // Get book details based on ISBN
  public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    getFromISBN(isbn).then(
      (bk)=>res.send(JSON.stringify(bk, null, 4)),
      (error) => res.send(error)
    )
   });
  
  // Task 12
  // Add the code for getting the book details based on Author (done in Task 3) using Promise callbacks or async-await with Axios.
  
  function fromAuthor(author){
    let output = [];
    return new Promise((resolve,reject)=>{
      for (var isbn in books) {
        let book = books[isbn];
        if (book.author === author){
          output.push(book);
        }
      }
      resolve(output);  
    })
  }
  
  // Get book details based on author
  public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    fromAuthor(author)
    .then(
      result =>res.send(JSON.stringify(result, null, 4))
    );
  });
  
  // Task 13
  // Add the code for getting the book details based on Title (done in Task 4) using Promise callbacks or async-await with Axios.
    
  function getFromTitle(title){
    let output = [];
    return new Promise((resolve,reject)=>{
      for (var isbn in books) {
        let book = books[isbn];
        if (book.title === title){
          output.push(book);
        }
      }
      resolve(output);  
    })
  }
  
  // Get all books based on title
  public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    getFromTitle(title)
    .then(
      result =>res.send(JSON.stringify(result, null, 4))
    );
  });

module.exports.general = public_users;
module.exports.users = users;

