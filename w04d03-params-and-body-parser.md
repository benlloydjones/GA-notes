# Params & Body Parser

### Objectives
*After this lesson, students will be able to:*

- Understand how to receive data from `req.params`
- Understand how to receive data from `req.query`
- Understand how to receive data from `req.body`
 
### Preparation
*Before this lesson, students should already be able to:*

- Explain HTTP requests/responses
- Write and explain basic JavaScript

## The problem with GET

So far, we've really only seen GET requests in our Express app. This could have been by requesting the website using the browser's URL bar or by clicking on a link.

However, this has its limitations especially when I want to send data to my app.

## A simple app

Open up the starter code, you should have the following files:

```bash
├── server.js
├── config
│   └── routes.js
├── db
│   └── seeds.js
├── models
│   └── cheese.js
├── package.json
└── views
    └── index.ejs
```

You'll see we have a basic Express app, with one model, cheese. Run the seeds file, and fire up the app with `nodemon`. You should see a simple homepage, and  nothing more.

Let's create a new route that will display our cheese to the world. Update the router as follows:

```javascript
const router = require('express').Router();
const Cheese = require('../models/cheese');

router.get('/', (req, res) => res.render('index'));
router.get('/cheeses', (req, res) => {
  Cheese
    .find()
    .exec()
    .then((cheeses) => {
      res.render('cheeses', { cheeses });
    })
    .catch((err) => {
      res.status(500).end(err);
    });
});

module.exports = router;
```

Here we've created a new route which will get the cheese data from the database and send it into a cheeses view. We should probably make that view now!

```bash
$ touch views/cheeses.ejs
```

Let's add some code to loop through those cheeses and display them in a list:

```ejs
<h1>All the cheese!</h1>
<ul>
  <% cheeses.forEach((cheese) => { %>
    <li>
      <h3><%= cheese.name %></h3>
      <h4><%= cheese.origin %></h4>
      <img src="<%= cheese.image %>" alt="<%= cheese.name %>">
      <p><%= cheese.tastingNotes %></p>
    </li>
  <% }) %>
</ul>
```

> **Note:** we do _not_ use `<%= %>` around control flow blocks like `if`, `while`, `forEach` etc. We only use `<%= %>` when we want to print some data to the view.

Ok, let's naviagte to `http://localhost:3000/cheese`, we should see three cheeses on display. Yum!

## Using Params

Great! However, sometimes we want to have a URL that has something that changes dynamically? Can you think of an example where this might happen?

- http://www.facebook.com/alexpchin
- http://www.facebook.com/rgowan

For these sorts of URLs, we need to be able to match a pattern rather than having a route-handler for each one!

> Route parameters are named URL segments that are used to capture the values specified at their position in the URL. The captured values are populated in the `req.params` object, with the name of the route parameter specified in the path as their respective keys.

Let's see how these work

Update the router like so:

```javascript
router.get('/cheeses/:name', (req, res) => {
  res.send(req.params.name);
});
```

Here the router is looking for a certain pattern: `/cheese/` followed by **any number of characters**. Whatever it finds after `/cheese/` the router will send back to the browser with `res.send`. Let's experiment with it.

Navigate to `/cheese/mike`, `/cheese/123`, `/cheese/cheddar`.

As you can see each set of characters after the `/cheese/` section of the URL is stored into `req.params.name`, because in the router we used the pattern `/cheese/:name`.

So what?

Ok, so lets used this new information to display a single cheese based on its name.

Let's modify the router again, but this time we'll use `req.params.name` to make a request to the database:

```javascript
router.get('/cheeses/:name', (req, res) => {
  Cheese
    .findOne({ name: req.params.name })
    .exec()
    .then((cheese) => {
      if(!cheese) return res.status(404).end();
      res.render('cheese', { cheese });
    })
    .catch(() => {
      res.status(500).end();
    });
});
```

Great! We just need a view to display that lovely cheese! Create a new view:

```bash
$ touch views/cheese.ejs
```
Then add the following inside:

```ejs
<h1><%= cheese.name %></h1>
<h2><%= cheese.origin %></h2>
<img src="<%= cheese.image %>" alt="<%= cheese.name %>">
<p><%= cheese.tastingNotes %></p>
```

## Using Query

Have you ever seen a url with a question mark in it? Sure you have:

`https://www.facebook.com/events/upcoming?action_history=null`

That part of the url, `?action_history=null` is called the query, or the querystring. It's another way to pass data to the server. It's generally used to **filter** a collection of data.

Let use it to filter the cheeses on our main cheeses page.

Firstly, let's see how it works. Update the router like so:

```javascript
router.get('/cheeses', (req, res) => {
  console.log(req.query);
  Cheese
    .find()
    .exec()
    .then((cheeses) => {
      res.render('cheeses', { cheeses });
    })
    .catch((err) => {
      res.status(500).end(err);
    });
});
```

Now naviagte to `/cheeses?origin=Italy`, and check your terminal. You should see this:

```bash
{ origin: 'Italy' }
```

So, express has converted `?origin=Italy` into an object for us, which is very useful. We can use that in our `find` method to retrieve _only_ cheeses from Italy, like so:

```javascript
router.get('/cheeses', (req, res) => {
  Cheese
    .find(req.query)
    .exec()
    .then((cheeses) => {
      res.render('cheeses', { cheeses });
    })
    .catch((err) => {
      res.status(500).end(err);
    });
});
```

Now test it by navigating to: `/cheeses?origin=Wales`, `/cheeses?origin=France`.

Boom!

## `body-parser`

So far we have been requesting data from the server using the URL to determine the specifics of the data we want. By what about if we want to send data _to_ the server?

We could just pass the data into the URL, but there are some issues with that.

Firstly, there is a limit to the length of a URL. You wouldn't be able to send larger amounts of data like a blog post, for example.

Also what about sensitive information like passwords? They would appear in the URL. That wouldn't make the user feel very safe!

So after `GET` requests seemed to be limited, `POST` requests were created.

When we make a POST request the data is sent to the server as part of the request itself, rather than in the url. All request are made up of three main parts:

1. A `path` or URL (eg. http://localhost:3000/cheeses)
2. A `verb` (eg. GET or POST)
3. A `body` which contains data.

With GET requests, although the request body exists, it is generally empty.

If we want to send a POST request to the server, we need a `form`. Let's add a form to our app, so that we can create some more cheeses.

### Method & Action

A form needs to have:

- **METHOD** -> http verb (eg `GET` or `POST`)
- **ACTION** -> http url (eg `/cheeses`)

Let's add a form to `views/cheeses.ejs`:

```ejs
<h2>New Cheese</h2>

<form method="POST" action="/cheeses">
  <div>
    <label for="name">Name</label>  
    <input type="text" name="name" id="name">
  </div>
  <div>
    <label for="origin">Origin</label>
    <input type="text" name="origin" id="origin">
  </div>
  <div>
    <label for="image">Image</label>
    <input type="text" name="image" id="image">
  </div>
  <div>
    <label for="tastingNotes">Tasting Notes</label>
    <textarea name="tastingNotes" id="tastingNotes"></textarea>
  </div>
  <button>Create</button>
</form>
```

You'll notice that every input has a `name` attribute. This is **crucial**. Without a name we would have no idea what each piece of data refers to. In fact, if an input does not have a name, **the browser will not send the data to the server!**

Also you'll notice the `for` attribute on the label. This allows the user to click on the label in order to activate, or `focus` on the associated input.

### Installing body-parser

In order to access the data from the form we need to install a new module called `body-parser`. This will take the form data and add it to `req.body`, so we can access it just like we did with `req.params`, and `req.query`.

```bash
$ npm install body-parser --save
```

Now in `app.js`, add:

```js
const bodyParser = require('body-parser');
```

To use this, we need to add some middleware:

```js
app.use(bodyParser.urlencoded());
```

### Make a POST request

Before we can submit our form, we need to update our router so that it will listen for the POST request:

```javascript
router.post('/cheeses', (req, res) => {
  console.log(req.body);
  res.redirect('/cheeses');
});
```

To start with, we'll just log the data to the terminal, and redirect back to the `/cheeses`.

Navigate to `http://localhost:3000/cheeses` and submit the form with some data.

Take a look at the terminal. You should see something like this:

```
{ name: 'Comté',
  origin: 'France',
  image: 'http://www.monthlyclubs.com/media/catalog/product/cache/13/image/9df78eab33525d08d6e5fb8d27136e95/c/o/comte-1.jpg',
  tastingNotes: 'Salty, mild, and lightly fruity with hazelnut and nutmeg flavors.' }
```

Nice! So we can now use this data to create a new cheese. Update the router like so:

```javascript
router.post('/cheeses', (req, res) => {
  Cheese
    .create(req.body)
    .then(() => {
      res.redirect('/cheeses');
    });
});
```

Give it a try. You should now be able to add cheeses to your heart's content!

## Summary

We've looked at the 3 main ways to send data to an Express app.

|             | `req.params`     | `req.query`             | `req.body`   |
|:-----------:|:----------------:|:-----------------------:|:------------:|
| **data**    | URL path         | URL querystring         | REQUEST body |
| **example** | `/cheeses/:name` | `/cheeses?origin=Italy` | FORM data    |
