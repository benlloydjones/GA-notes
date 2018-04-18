![ga_cog_large_red_rgb](https://cloud.githubusercontent.com/assets/40461/8183776/469f976e-1432-11e5-8199-6ac91363302b.png)

# Linking Models to Views

## Overview

So far we have looked at how to interact with our Mongo database through the command line, and by adding data via a `.js` file with the Mongoose ORM. In order to view the data we used `console.log` to see it displayed in the terminal. However, what we really want to do is to be able to render this data in the views of our application. In this lesson we will look at how we can incorporate Mongoose with what we have already learnt about Express route handlers.

## Set up

Open up the `starter-code`. Your folder structure should look like this:

```bash
.
├── db
│   └── seeds.js
├── models
│   ├── author.js
│   └── book.js
├── index
└── package.json
```

Install the node modules by running `yarn install` in the terminal.

Open up the `starter-code` in Atom, and have a look at the `db/seeds.js` file. You should recognise this structure from the lesson on how to write a seeds file. Open up the `models` directory and have a look at the models inside. These are also the same as before.

If you run `node db/seeds` you should see the following in the terminal:

```sh
2 authors created!
8 books created!
```

## Server

At the moment we don't have anything in our `index.js` file, and we haven't installed any packages other than `mongoose`. In the terminal run:

```sh
yarn add express ejs express-ejs-layouts morgan bluebird mongoose
```

This will download the packages into the `node_modules` directory, and add them to the dependencies in the `package.json`.

Add the following to the `index.js` file:

```js
const express = require('express');
const app = express();

const expressLayouts = require('express-ejs-layouts');
const morgan = require('morgan');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const dbURI = 'mongodb://localhost/bookstore';
mongoose.connect(dbURI, { useMongoClient: true });

// settings
app.set('view engine', 'ejs');
app.set('views', `${__dirname}/views`);

// middleware
app.use(expressLayouts);
app.use(morgan('dev'));

// request handlers
app.get('/', (req, res) => {
  res.send('Homepage');
});

app.get('/authors', (req, res) => {
  res.send('Authors');
});

app.get('/books', (req, res) => {
  res.send('Books');
});

// listen for traffic on port 3000
app.listen(3000, () => console.log('Listening to port 3000'));
```

Here we are setting up a simple Express app, connecting to the database, declaring our middleware, and creating some basic request handlers. At the moment, our request handlers are only sending back strings, rather than templates, so that we can test our code before moving forward.

Fire up the server by running `nodemon`, and make sure there are no errors in the console, and that you can make `GET` requests to `/`, `/authors` and `/books` and see the text on the screen.

## Views

Let's set up the views files.

```sh
mkdir views
touch views/authors.ejs views/books.ejs views/home.ejs views/layout.ejs
```

In the `layout.ejs` file add some boiler plate HTML, and the `<%- body %>` tag.

Add `<h1>` tags to the other three templates, displaying the title.

```html
<h1>Home</h1>

<h1>Authors</h1>

<h1>Books</h1>

```

Update the request handlers to be:

```js
// request handlers
app.get('/', (req, res) => {
  res.render('home');
});

app.get('/authors', (req, res) => {
  res.render('authors');
});

app.get('/books', (req, res) => {
  res.render('books');
});
```

Run `nodemon` and make sure that you can visit each page (`/`, `/books` and `/authors`). We are now using the `layout.ejs` file and loading in each template (using `render`), depending on the route.

## Sending Data

When we render the authors page, we want to get all of the authors from the database and send them to the view. We are going to do this inside the request handlers. Require the `Author` model in the `index.js` file, above the request handlers.

```js
// models
const Author = require('./models/author');
```

Now we can use the Author model inside the `/authors` request handler. Update the following:

```js
app.get('/authors', (req, res) => {
  Author.find((err, authors) => {
    res.render('authors', { authors });
  });
});
```

We can pass the array of `authors` to the view by adding it into an object that we pass in after the name of the view. In `views/authors.ejs` we can now loop through that array and print out each author on the page.

```html
<h1>Authors</h1>

<% authors.forEach((author) => { %>
  <h2><%= author.firstname %> <%= author.lastname %></h2>
<% }) %>
```

You should see the three authors on the page if you refresh the browser. 

This is great, however we could refactor the request handler to use promises rather than callbacks.

```js
app.get('/authors', (req, res) => {
  Author
    .find()
    .exec()
    .then(authors => res.render('authors', { authors }))
    .catch(err => res.send(err));
});
```

Refresh the page again and make sure everything is still working. We can now do the same for books.

```js
const Book = require('./models/book');

app.get('/books', (req, res) => {
  Book
    .find()
    .exec()
    .then(books => res.render('books', { books }))
    .catch(err => res.send(err));
});
```

And in `views/books.ejs`:

```html
<h1>Books</h1>

<% books.forEach((book) => { %>
  <h2><%= book.title %></h2>
  <h3><%= book.author %></h3>
  <h4><%= book.genre %></h4>
  <p><%= book.ISBN %></p>
  <% book.images.forEach((image) => { %>
    <img src="<%= image.url %>" style="width: 100px" alt="<%= book.title %>">
    <p><%= image.caption %></p>
  <% }) %>
<% }) %>
```

Here we are looping through the book's images with their own `forEach` loop, and for each image we can print an image tag.

## Populate

When we print out `<%= book.author %>`, we are currently only seeing the author's ID. This is because we are only storing a reference to the author in the book schema, and not the whole author object. In order to print out the full author details when we are looping through the books, we can use the Mongoose [populate](http://mongoosejs.com/docs/populate.html) method. In the `/books` event handler, update the following:

```js
app.get('/books', (req, res) => {
  Book
    .find()
    .populate('author')
    .exec()
    .then(books => res.render('books', { books }))
    .catch(err => res.send(err));
});
```

Have a look at the page in Chrome now, and you should see that instead of the author's ID, we now see the whole author object. By using `populate`, Mongoose knows that it should go to the author collection and find that author instance, and then return it along with the book data.

And now in the `views/books.ejs` file we can print out the author details.

```html
<% books.forEach((book) => { %>
  <h2><%= book.title %></h2>
  <h3><%= book.author.firstname %> <%= book.author.lastname %></h3>
  <h4><%= book.genre %></h4>
  <p><%= book.ISBN %></p>
  <% book.images.forEach((image) => { %>
    <img src="<%= image.url %>" style="width: 100px" alt="<%= book.title %>">
    <p><%= image.caption %></p>
  <% }) %>
<% }) %>
```

## Conclusion

Hopefully you are beginning to see the power of noSQL databases combined with Node and Express. We are well on our way to creating a full MVC app now. We have covered the **M**odels and **V**iews so far, and will be looking at **C**ontrollers very soon.