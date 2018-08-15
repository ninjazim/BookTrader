'use strict';

var Book = require('../models/books.js');
var User = require('../models/users.js');
var Request = require('../models/requests.js');
var axios = require('axios');

function SearchHandler () {

  this.getBooks = (req, res) => {
    Book.find()
        .populate({ path: 'owners', select: 'username' })
        .exec((err, books) => {
          if (err) throw err;
          res.json(books);
        });
  }

  this.saveBook = (req, res) => {

    Book.findOne({ bookId: req.body.bookId })
      .populate({ path: 'owners', select: 'username' })
      .exec((err, book) => {
        if (err) throw err;
        if (book) {
          console.log('Existing Book');
          let existingOwner = book.owners.filter((owner) => {
            return owner._id.toString() == req.user._id.toString()
          });
          if (existingOwner.length > 0) {
            console.log('Existing Owner');
            res.json({ existing: true });
          } else {
            console.log('New Owner');
            book.owners.push(req.user)
            book.save((err, savedBook) => {
              if (err) throw err;
              User.findById(req.user._id)
                  .exec((err, user) => {
                    if (err) throw err;
                    user.books.push(book);
                    user.save((err, savedUser) => {
                      res.json(savedBook);
                    });
                  });
            });

          }
        } else {
          console.log('New Book');
          let bookData = req.body;
          let newBook = new Book({
            bookId: bookData.bookId,
          	title: bookData.title,
            authors: bookData.authors,
          	imageUrl: bookData.imageUrl,
          	owners: [ req.user ],
          	ISBN: {
          		short: bookData.ISBN.short,
          		long: bookData.ISBN.long
          	},
          });
          newBook.save((err, savedBook) => {
            if (err) throw err;
            User.findById(req.user._id)
                .exec((err, user) => {
                  if (err) throw err;
                  user.books.push(savedBook._id);
                  user.save((err, savedUser) => {
                    res.json(savedBook);
                  });
                });
          });
        }
      });
  }

  this.updateUser = (req, res) => {
    if (req.params.username === req.user.username) {
      User.findByIdAndUpdate(req.user._id, req.body)
          .exec((err, user) => {
            if (err) throw err;
            res.json(user);
          });
    } else {
      res.send({});
    }
  }

  this.getUserData = (req, res) => {
    User.findOne({ username: req.params.username })
        .populate({ path: 'books', select: 'bookId title authors createdAt imageUrl' })
        .exec((err, user) => {
          if (err) throw err;
          res.json(user);
        });
  }

  this.getUsers = (req, res) => {
    User.find()
        .sort('books')
        .exec((err, users) => {
          if (err) throw err;
          res.json(users);
        });
  }

  this.getLoggedInUser = (req, res) => {
    User.findById(req.user._id)
        .populate({ path: 'books', select: 'bookId title authors createdAt imageUrl' })
        .exec((err, user) => {
          if (err) throw err;
          res.json(user);
        });
  }

  this.getBookData = (req, res) => {
    Book.findOne({ bookId: req.params.bookId })
        .select('owners')
        .populate({ path: 'owners', select: 'username' })
        .exec((err, book) => {
          if (err) throw err;
          res.json(book);
        });
  }

  this.updateBook = (req, res) => {
    Book.findOne({ bookId: req.params.bookId })
        .populate({ path: 'owners', select: 'username' })
        .exec((err, book) => {
          console.log(book);
          if (err) throw err;
          if (!!req.body.removeUser) {
            console.log('removeUser');
            User.findById(req.body.removeUser.id)
                .exec((err, user) => {
                  user.books.pull(book._id);
                  user.save((err, savedUser) => {
                    if (err) throw err;

                    if (book.owners.length > 1) {
                      console.log('removing owner');
                      book.owners.pull(savedUser._id);
                      book.save((err, savedBook) => {
                        res.json(savedBook);
                      });
                    } else {
                      console.log('removing book');
                      book.remove((err, deletedBook) => {
                        if (err) throw err;
                        res.json({deleted: true});
                      });
                    }
                  });
            });
          }
        });
  }

  this.getRequests = (req, res) => {
    Request.find()
           .or([{ owner: req.user.username }, { requester: req.user.username }])
           .exec((err, requests) => {
             if (err) throw err;
             res.json(requests);
           });
  }

  this.createRequest = (req, res) => {
    Request.findOne({ owner: req.body.owner, book: req.body.book, requester: req.user.username })
           .exec((err, request) => {
             if (err) throw err;
             if (!!request) {
               res.json({ existing: true });
             } else {
               let newRequest = new Request({
                 book: req.body.book,
                 owner: req.body.owner,
                 requester: req.user.username,
                 status: 'requested'
               });
               newRequest.save((err, savedRequest) => {
                 if (err) throw err;
                 res.json(savedRequest);
               });
             }
           });
  }

  this.updateRequest = (req, res) => {
    Request.findById(req.params.id)
           .exec((err, request) => {
             if (err) throw err;
             if (!!request) {
               if (req.body.status === 'canceled' && request.requester === req.user.username) {
                 request.remove((err, deletedRequest) => {
                   if (err) throw err;
                   res.json({canceled: true});
                 });
               } else if (request.owner === req.user.username) {
                 request.status = req.body.status;
                 request.save((err, updatedRequest) => {
                   if (err) throw err;
                   res.json(updatedRequest);
                 });
               } else {
                 res.json({ existing: false });
               }
             } else {
               res.json({ existing: false });
             }
           });
  }
};

module.exports = SearchHandler;
