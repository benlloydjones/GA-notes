# Express Controllers

### Objectives
*After this lesson, students will be able to:*

- Understand what a controller is and how to create on using Express
- Create a separate router module and controller file for a RESTful resource

### Preparation
*Before this lesson, students should already be able to:*

- How to create a basic Express application
- How to use the Express router

## Intro to Express Controllers - (10 mins)

We have already had a look at how to use the router in Express. However, let's think about what we have done in terms of our code - we have moved some route handlers from `app.js` to `routes.js`.

Why have we done this? Essentially, we tried to organise our code! We have been trying to improve the design of our code.

One common design principle of coding is called [separation of concerns](https://en.wikipedia.org/wiki/Separation_of_concerns) and a common web framework design pattern is the MVC pattern.

## MVC

MVC stands for:

- the **M**odel
- the **V**iew
- the **C**ontroller

### Model

The Model manages fundamental behaviours and data of the application. It can respond to requests for information, respond to instructions to change the state of its information, and even to notify observers in event-driven systems when information changes. This could be a database, or any number of data structures or storage systems. In short, it is the data and data-management of the application.

### View

The View provides the user interface of the application (or the data for it). It'll render data from the model into a form that is suitable to be displayed in the user interface.

### Controller

The Controller receives user input and makes calls to Model objects and the View to perform appropriate actions.

All in all, these three components work together to create the three basic components of MVC.

## Making a controller - Codealong (15 mins)

Open up the starter code. Install the npm modules with `yarn install` and fire up the app with `nodemon`. Look familiar?

If we have a look at the `config/routes.js` file - we can move the route handler functions to another file. Let's first make a new directory for the new controller files:

```bash
$ mkdir controllers && touch controllers/books.js
```

First off let's move the `Book` model from `config/routes.js` to `controllers/books.js`

```javascript
const Book = require('../models/books');
```

Next we want to take the logic from the router for our INDEX page, and move it to the controller. Copy and paste **just the callback function** like so:

```javascript
// INDEX
(req, res) => {
  res.render("books/index", { books });
}
```

We now need to turn this into a function:

```javascript
function booksIndex(req, res) {
  Book
    .find()
    .exec()
    .then((books) => {
      res.render('books/index', { books });
    })
    .catch((err) => {
      res.status(500).end(err);
    });
}
```

And **export it** at the bottom of the file.

```javascript
module.exports = {
  index: booksIndex
};
```

### Requiring the controller file

Next, we need to require the controller in the `config/routes.js` file:

```javascript
// Require Controllers
const books = require("../controllers/books");
```

We can now link the link the controller to the router action:

```javascript
// INDEX
router.get('/books', books.index);
```

OK. Check it out, naviagte to `http://localhost:3000/books`, you should see all the books on the page.

### El Classico!

You may get an error at this point:

```bash
Error: Route.get() requires callback functions but got a [object Undefined]
```

This error is saying that your `router.get` method was expecting a callback function but got `undefined` instead. Most likely you forgot to **export your controller functions** at the bottom of `controllers/books.js`.

This is _very common_ mistake, so it's important that you understand that error message!

## Independent practice (15 mins)

Use the method for `INDEX`, to move each of the other RESTful routes the router to the controller.


## Refactor with router.route() - Codealong (10 mins)

You can create chainable route handlers for a route path by using `app.route()` or `router.route()`. Because the path is specified at a single location, creating modular routes is helpful, as is reducing redundancy and typos.

Let's refactor our code here:

```javascript
router.get('/books', books.index);
router.get('/books/new', books.new);
router.get('/books/:id', books.show);
router.post('/books', books.create);
router.get('/books/:id/edit', books.edit);
router.put('/books/:id', books.update);
router.delete('/books/:id', books.delete);
```

To use `router.route()`:

```javascript
router.route('/books')
  .get(books.index)
  .post(books.create);

router.route('/books/new')
  .get(books.new);

router.route('/books/:id')
  .get(books.show)
  .put(books.update)
  .delete(books.delete);

router.route('/books/:id/edit')
  .get(books.edit);
```

**Note:** Be careful about where you put `;` as these route handlers are chained together.

Now we can clearly see that we have 5 key url paths for the post resource with different HTTP methods for each of them.

This is why sometimes the `delete` is grouped with the `show` and `update`.

## Conclusion (5 mins)

I hope you can see that we're starting to build bigger and bigger applications - but we are trying to keep our code organised as our codebase grows. This is an **important** part of coding!

We have separated out the logic of our route handler functions into a controller file and kept the routing logic of matching a url path to a HTTP method in `config/routes.js`. Tidy!