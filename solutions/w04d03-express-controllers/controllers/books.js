const Book = require('../models/book');
const Author = require('../models/author');

function booksIndex(req, res) {
  Book
    .find()
    .populate('author')
    .exec()
    .then((books) => {
      res.render('books/index', { books });
    })
    .catch((err) => {
      res.status(500).render('error', { err });
    });
}

function booksShow(req, res) {
  Book
    .findById(req.params.id)
    .populate('author')
    .exec()
    .then((book) => {
      if(!book) return res.status(404).send('Not found');
      res.render('books/show', { book });
    })
    .catch((err) => {
      res.status(500).render('error', { err });
    });
}

function booksNew(req, res) {
  Author
    .find()
    .exec()
    .then((authors) => {
      res.render('books/new', { authors });
    })
    .catch((err) => {
      res.status(500).render('error', { err });
    });
}

function booksCreate(req, res) {
  Book
    .create(req.body)
    .then(() => {
      res.redirect('/books');
    })
    .catch((err) => {
      res.status(500).render('error', { err });
    });
}

function booksEdit(req, res) {
  Book
    .findById(req.params.id)
    .populate('author')
    .exec()
    .then((book) => {
      if(!book) return res.status(404).send('Not found');
      return Author
        .find()
        .exec()
        .then((authors) => {
          res.render('books/edit', { book, authors });
        });
    })
    .catch((err) => {
      res.status(500).render('error', { err });
    });
}

function booksUpdate(req, res) {
  Book
    .findById(req.params.id)
    .exec()
    .then((book) => {
      if(!book) return res.status(404).send('Not found');

      book = Object.assign(book, req.body);
      return book.save();
    })
    .then((book) => {
      res.redirect(`/books/${book.id}`);
    })
    .catch((err) => {
      res.status(500).render('error', { err });
    });
}

function booksDelete(req, res) {
  Book
    .findById(req.params.id)
    .exec()
    .then((book) => {
      if(!book) return res.status(404).send('Not found');

      return book.remove();
    })
    .then(() => {
      res.redirect('/books');
    })
    .catch((err) => {
      res.status(500).render('error', { err });
    });
}

module.exports = {
  index: booksIndex,
  show: booksShow,
  new: booksNew,
  create: booksCreate,
  edit: booksEdit,
  update: booksUpdate,
  delete: booksDelete
};
