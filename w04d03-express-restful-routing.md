# Express RESTful Routing

### Objectives
*After this lesson, students will be able to:*

- Understand how to create RESTful routes
- Understand how to render view files for RESTful routes
- Understand how to write EJS inside the view files for the RESTful routes

### Preparation
*Before this lesson, students should already be able to:*

- Understand how to use the Express Router
- Should be able to create a basic Express app

## REST Recap - Intro (10 mins)

> **Note** There are a lot of new concepts and quite a bit of coding during the lesson. So make sure you check for understanding regularly.

REST is a design pattern that helps us to decide on the way that our app's routes and resources are structured.

A RESTful resource should have the 7 RESTful routes:

| HTTP Verb | Path | Controller#Action | Used for |
| --------- | -------- | --------| ----------- |
| GET | /books | books#index | display a list of all books |
| GET | /books/new | books#new | return an HTML form for creating a new book |
| POST | /books | books#create | create a new book |
| GET | /books/:id | books#show | display a specific book |
| GET | /books/:id/edit | books#edit | return an HTML form for editing a book |
| PATCH/PUT | /books/:id | books#update | update a specific book |
| DELETE | /books/:id | books#destroy | delete a specific book |

Let's make the restful resources for an Express app.

## RESTful Routing - Intro (10 mins)

*Send over the starter-code*

**Note:** Make sure you install the packages with `yarn install`.

Now let's a look at the app. The file tree is as follows:

```
.
├── config
│   └── routes.js
├── db
│   └── seeds.js
├── index.js
├── models
│   └── book.js
├── package.json
├── public
│   ├── css
│   │   └── style.css
│   └── js
│       └── app.js
└── views
    ├── error.ejs
    ├── home.ejs
    ├── layout.ejs
    └── partials
        └── navbar.ejs

8 directories, 11 files
```

We can see the routes defined in the `config/routes.js` file:

```javascript
const express = require('express');
const router  = express.Router();

// A home route
router.get('/', (req, res) => res.render('index'));

// RESTful routes for the Book resource
// All URLS should contain /books

// INDEX
router.get('/books', (req, res) => res.send('INDEX'));
// NEW
router.get('/books/new', (req, res) => res.send('NEW'));
// SHOW
router.get('/books/:id', (req, res) => res.send('SHOW'));
// CREATE
router.post('/books', (req, res) => res.send('CREATE'));
// EDIT
router.get('/books/:id/edit', (req, res) => res.send('EDIT'));
// UPDATE
router.put('/books/:id', (req, res) => res.send('UPDATE'));
// DELETE
router.delete('/books/:id', (req, res) => res.send('DELETE'));

module.exports = router;
```

#### res.send vs res.end

If you pass a string to `res.send()`, it automatically assumes a Content-Type of html.

`res.end()`, however, simply calls node's underlying `end()` implementation on the response stream, so no assumptions are made for the Content-Type.

The reason it renders differently is simply a browser decision to render a "pretty" default font for HTML, and a less-styled font for unknown content types.

## Creating the RESTful views - (10 minutes)

One of our first tasks is to create the view files and serve them for the Book resource. These views files should be in a directory found at `views/books`.

```
└── views
    ├── error.ejs
    ├── index.ejs
    ├── layout.ejs
    └── books
        ├── edit.ejs
        ├── index.ejs
        ├── new.ejs
        └── show.ejs
```

Let's create those files:

```bash
$ mkdir views/books
$ touch views/books/edit.ejs
$ touch views/books/index.ejs
$ touch views/books/new.ejs
$ touch views/books/show.ejs
```

> **Note:** Remember that we don't need to create views for CREATE and UPDATE actions.

Now instead of rendering text using:

```js
res.send("EDIT");
```

We should render the correct view file:

```js
res.render("books/index");
```

Let's do this for all of the actions, except the CREATE, UPDATE and DELETE. You should end up with this:

```js
const express = require('express');
const router  = express.Router();

// A home route
router.get('/', (req, res) => res.render('index'));

// RESTful routes for the Book resource
// All URLS should contain /books

// INDEX
router.get('/books', (req, res) => res.render("books/index"));
// NEW
router.get('/books/new', (req, res) => res.render("books/new"));
// SHOW
router.get('/books/:id', (req, res) => res.render("books/show"));
// CREATE
router.post('/books', (req, res) => res.send("CREATE"));
// EDIT
router.get('/books/:id/edit', (req, res) => res.render("books/edit"));
// UPDATE
router.put('/books/:id', (req, res) => res.send("UPDATE"));
// DELETE
router.delete('/books/:id', (req, res) => res.send("DELETE"));

module.exports = router;
```

#### Add some content

Now you need to copy the contents of `views/index.ejs` into all of these files.

Now, to make sure that you know that you have navigated to the write page, let's update the `h1` on each page:

```html
<h1 class="title is-1">Index</h1>
<h1 class="title is-1">Edit</h1>
<h1 class="title is-1">Create</h1>
<h1 class="title is-1">Show</h1>
```

Fire up the app with:

```sh
$ nodemon
```

And check that all of these work:

- `http://localhost:8000/books`
- `http://localhost:8000/books/new`
- `http://localhost:8000/books/1`
- `http://localhost:8000/books/1/edit`

Now, it's difficult to understand what these RESTful routes do without some data. Let's populate these views!

## INDEX - (20 mins)

Run the seeds file:

```bash
$ node db/seeds
```

Now that we have some data, let's render that data on the `books/index` page.

#### Passing data to INDEX

Now what we're going to do is to grab all the books from the database, and pass it into the view in a variable called `books`.

Firstly we need to require the book model at the top of our router:

```javascript
const Book = require('../models/book');
```

Now we can update our index route like so:

```js
// INDEX
router.get('/books', (req, res) => {
  Book
    .find()
    .exec()
    .then((books) => {
      res.render('books/index', { books });
    })
    .catch((err) => {
      res.status(500).render('error', { err });
    });
});
```

#### Looping through the books in the view

First let's output the value of `books` on the index page:

```html
<h1 class="title is-1">Index</h1>

<%= books %>
```

And run the app and look at `http://localhost:3000/books` we should see:

```html
[object Object]
```

What is this?! This is because EJS has tried to convert an array, which is a complex datatype, into a string.

**How do we get data out of this object?**

We need to use a loop. The syntax for this in EJS is a little bit fiddly. We could do either a `for` loop or a `forEach` loop. Let's do a `forEach` as it is slightly easier to read:

```html
<ul class="columns is-multiline">
  <% books.forEach((book) => { %>
    <li class="column is-half">
      <div class="box">
        <a href="/books/<%= book.id %>"><h3 class="title is-3"><%= book.title %></h3></a>
        <h4 class="title is-4"><%= book.author %></h4>
        <p><%= book.description %></p>
      </div>
    </li>
  <% }); %>
</ul>
```

Once you have done this, you can navigate to `http://localhost/books`. You see both books displayed on the page.

## NEW - (20 mins)

Let's now look at the NEW action and create an HTML form on the `books/new` page to add a new post.

```html
<h1 class="title is-1">New</h1>

<div class="columns">
  <form class="column is-half" method="POST" action="/books">

    <div class="field">
      <label for="title">Title</label>
      <div class="control">
        <input class="input" type="text" name="title" id="title">
      </div>
    </div>

    <div class="field">
      <label for="title">Author</label>
      <div class="control">
        <input class="input" type="text" name="author" id="author">
      </div>
    </div>

    <div class="field">
      <label for="title">Description</label>
      <div class="control">
        <textarea class="textarea" name="description"></textarea>
      </div>
    </div>

    <button class="button is-primary is-fullwidth">Create</button>
  </form>
</div>
```

Remember two important attributes of a form are:

- **method** Which is the HTTP verb (eg. `GET` or `POST`)
- **action** Which is the HTTP URL (eg. `/books`)

Both of these parts (`POST /books`) point to the **CREATE** action.

## CREATE - (20 mins)

The new form, works with the CREATE action. Let's start by logging out the body of the request in the create action:

```js
// CREATE
router.post('/books', (req, res) => {
  console.log(req.body);
  res.send("CREATE");
});
```

If you fill the form in, you should see the contents being logged in the terminal.

> **Note:** Remember that Node logs out in the terminal rather than the browser console!

#### Create a new book document

We want to use the data in `req.body` to create a new entry in our database, then redirect the user to the INDEX page, so she can see that the book has been added.

```js
// CREATE
router.post('/books', (req, res) => {
  Book
    .create(req.body)
    .then(() => {
      res.redirect('/books');
    })
    .catch((err) => {
      res.status(500).render('error', { err });
    });
});
```

Great! Try this out - you should be able to add a new book and see it on the INDEX page.

## SHOW - (20 mins)

The next step will probably be to create a SHOW page. On the INDEX page make the title of the book a link where the url follows the RESTful pattern:

```html
<a href="/books/<%= book.id %>"><h3><%= book.title %></h3></a>
```

If you click this link, you should be taken to the SHOW page!

Let's add some content to this page:

```html
<h1 class="title is-1">Show</h1>

<h2 class="title is-2"><%= book.title %></h2>
<h3 class="subtitle is-3"><%= book.author %></h3>
<p><%= book.description %></p>
```

Great! Try this out and you should get an error!

```bash
   18|     <main>
   19|       <h1>Show</h1>
>> 20|       <h2><%= book.title %></h2>
   21|       <h3><%= book.author %></h3>
   22|       <p><%= book.description %></p>
   23|     </main>

book is not defined
```

*What do you think we have forgotten?*

We haven't pass the book variable to the page!

In order to do this, we need to access the `id` variable in the url that we are looking at. We can do this with `req.params`.

```js
// SHOW
router.get('/books/:id', (req, res) => {
  Book
    .findById(req.params.id)
    .exec()
    .then((book) => {
      if(!book) return res.status(404).end('Not found');
      res.render('books/show', { book });
    })
    .catch((err) => {
      res.status(500).render('error', { err });
    });
});
```

Great! Let's try this out.

**Q:** Why are we using the `id` of the book, and not the `title`?

**A:** Because book titles do not translate well in to urls, you'd end up with something quite ugly like this:

```
/books/Of%20Mice%20and%20Men
```

Yuck! You may see on some website, mainly blogs, a prettyfied version like so:

```
/books/of-mice-and-men
```
Which is a lot nicer. However this requires writing some custom code to make the string lowercase, and replace the spaces for dashes, to convert the title into the url path (or `slug` as it's known). You also need to then convert the slug back into the title so you can search the database for it. And what happens if you have multiple books with the same title? Different printings, or publishers.

Its actually a lot more common to use the record's `id` when making a SHOW route. The BBC is a fine example.

```
http://www.bbc.co.uk/sport/football/38632129
```

## EDIT - (20 mins)

We're doing well! We have 3 more actions to go.

Next up is the EDIT action. It's going to be very similar to the NEW action, so we can start by copying the form from there.

```html
<div class="row">
  <form class="six columns" method="POST" action="/books">
    <div>
      <label for="title">Title</label>
      <input class="u-full-width" type="text" name="title" id="title">
    </div>

    <div>
      <label for="author">Author</label>
      <input class="u-full-width" type="text" name="author" id="author">
    </div>

    <div>
      <label for="description">Description</label>
      <textarea class="u-full-width" name="description"></textarea>
    </div>

    <button class="u-full-width button-primary">Create</button>
  </form>
</div>
```

However, the difference is that now we can pass the value of the book to the view:

```js
// EDIT
router.get('/books/:id/edit', (req, res) => {
  Book
    .findById(req.params.id)
    .exec()
    .then((book) => {
      if(!book) return res.status(404).end('Not found');
      res.render('books/edit', { book });
    })
    .catch((err) => {
      res.status(500).render('error', { err });
    });
});
```

And using this data, we can populate the values of the input form and change the value of the button:

```html
<h1 class="title is-1">Edit</h1>

<div class="columns">
  <form class="column is-half" method="POST" action="/books/<%= book.id %>">

    <div class="field">
      <label for="title">Title</label>
      <div class="control">
        <input class="input" type="text" name="title" id="title" value="<%= book.title %>">
      </div>
    </div>

    <div class="field">
      <label for="title">Author</label>
      <div class="control">
        <input class="input" type="text" name="author" id="author" value="<%= book.author %>">
      </div>
    </div>

    <div class="field">
      <label for="title">Description</label>
      <div class="control">
        <textarea class="textarea" name="description"><%= book.description %></textarea>
      </div>
    </div>

    <button class="button is-primary is-fullwidth">Update</button>
  </form>
</div>
```

Now let's add an edit button to the INDEX page, to take us to the EDIT route:

```html
<a href="/books/<%= book.id %>/edit" class="button is-info">Edit</a>
```

Great!

However, if we use this form, rather than updating the existing record, we create a new one! What's going on?

Because we copied the form from the NEW route, we are actually sending a POST request to `/books`, which is the action for CREATE.

**Q:** What should our _method_ and _action_ be to UPDATE the book?

**A:** We should be sending a **PUT** request to `/books/:id`

## UPDATE - (20 mins)

### Method override

HTML forms don't allow you to make `PUT`, `PATCH` or `DELETE` requests, only `POST` and `GET`.

We *could* use `post`. However, if we want to use `PUT`, `PATCH` or `DELETE` we can install an npm package called `method-override`.

Let's do this:

```sh
$ yarn add method-override --save
```

To get this to work, we need to set this up in `app.js`. First, we need to require the package.

```js
const methodOverride = require('method-override');
```

Next, we need to use the `method-override` middleware:

```js
// Use methodOverride
app.use(methodOverride((req) => {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    const method = req.body._method;
    delete req.body._method;
    return method;
  }
}));
```

Yuk! What the hell is that?

`method-override` is 3rd party software, ie. it was made by someone else. It's also completely free to use, and it solves our problem. The downside is that we have to add this ugly piece of code into our codebase, but on the plus side, we don't need to remember it, or even understand it. We can just follow the instructions for how to use it from the [documentation](https://www.npmjs.com/package/method-override).

Now, inside the edit form we add a hidden field with the value of the method that we want to change the post from.

We also update the action to point to `/books/:id`, and the button text to Update.

```html
<h1 class="title is-1">Edit</h1>

<div class="columns">
  <form class="column is-half" method="POST" action="/books/<%= book.id %>">
    <input type="hidden" name="_method" value="PUT">

    <div class="field">
      <label for="title">Title</label>
      <div class="control">
        <input class="input" type="text" name="title" id="title" value="<%= book.title %>">
      </div>
    </div>

    <div class="field">
      <label for="title">Author</label>
      <div class="control">
        <input class="input" type="text" name="author" id="author" value="<%= book.author %>">
      </div>
    </div>

    <div class="field">
      <label for="title">Description</label>
      <div class="control">
        <textarea class="textarea" name="description"><%= book.description %></textarea>
      </div>
    </div>

    <button class="button is-primary is-fullwidth">Update</button>
  </form>
</div>
```

Great! If we try to use this form now we should see UPDATE on the page! This means we have reached the right route action but we need to update the logic.

```js
// UPDATE
router.put('/books/:id', (req, res) => {
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
});
```

It is worth taking a minute to have a look at what `Object.assign()` is doing here. From the [Mozilla documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign), "The `Object.assign()` method is used to copy the values of all enumerable own properties from one or more source objects to a target object. It will return the target object." Basically, we can use it to take the book from the database, and update it with the values from the object in the `req.body`.

Ok, test it out. You should be able to update your books now!

## DELETE - (15 mins)

Finally, we need to handle the DELETE action. All `a` links by default make GET requests. Therefore we need to use a `form` to make a `DELETE` request.

Let's add this in the INDEX page:

```html
<form action="/books/<%= book.id %>" method="POST">
  <input type="hidden" name="_method" value="DELETE"/>
  <button class="button is-danger">Delete</button>
</form>
```

We've had to do the same thing as the edit form in order to change the HTTP verb to `DELETE` in the express app.

If we test it, we should get to a page rendering DELETE. This is great, we just need to add the logic in the right route handler.

```js
// DELETE
router.delete('/books/:id', (req, res) => {
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
});
```

Great test it out!

## Conclusion (5 mins)

Quite a lot of work there!!!

We are dealing with an application as a set of RESTful resources that we can manipulate.

This is a really important concept in web development.