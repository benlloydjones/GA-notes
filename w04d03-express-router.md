# Express Router

### Objectives
*After this lesson, students will be able to:*

- Use the Express router 
- Create a seperate router module

### Preparation
*Before this lesson, students should already be able to:*

- How to create a basic Express application
- How to use module.exports in Node

## Intro to Express Routing - (10 mins)

We've had a look at how to create a basic express app. 

So far we have created some route handlers with:

```js
app.get("/", (req, res) => res.render("index"));
```

[ExpressJS 4.0](https://scotch.io/tutorials/learn-to-use-the-new-router-in-expressjs-4) comes with the new Router. Router is like a mini Express application. It doesn’t bring in views or settings but provides us with the routing APIs like `.use`, `.get`, `.param`, and `route`.

### Why use express.router?

At the moment, our `app.js` file is getting a bit large. With more complicated applications you might also have different routes for your API and your web platform.

We want to move all of our routing logic to another file and we want to be able to prefix our routes, e.g.

```
GET  /api/posts
POST /api/posts
```

vs:

```
GET  /posts
POST /posts
```

## Creating a router - Codealong (15 mins)

First let's open the starter-code. We can see that we have one route handler at the moment:

```javascript
app.get("/", (req, res) => res.render("index"));
```

Launch the app with:

```bash
$ nodemon app.js
```

And take a look at the app.

#### Making a router

Next we define our _router_. This is what handles our routing. It's normally better to use this way of doing routes (and extracting them in to their own files) as it makes applications more modular, and you won't have a 500 line `app.js`:

```javascript
const express    = require("express");
const app        = express();
const bodyParser = require("body-parser");
const port       = process.env.PORT || 3000;
const router     = express.Router();
```

This needs to be under the definition of `app`! 

#### Add some routes

Then we add our routes but instead of using methods on `app` we can now add methods on `router`:

```javascript
router.get('/', (req, res) => res.render('index', { header: 'Home'}));

router.get('/contact', (req, res) => res.render('index', { header: 'Contact'}));

router.get('/about', (req, res) => res.render('index', { header: 'About'}));
```

Then at the bottom of the page add:

```javascript
app.use('/', router);
```

(You could also use `app.use(router)`).

### Namespacing routes

We can namespace our endpoints by adding a first argument to `.use()`, in this case "/posts". Likewise, we could've further namespaced our api with "/api/posts". Dev teams namespace their APIs with `/api` to help clearly define if an endpoint is meant for clients or other developers.

Anyway, the code above will create these 3 routes:

```javascript
GET    /
GET    /contact
GET    /about
```

**Note:** If we want, we might create a dedicated router for this resource and namespace the routes like this:

```javascript
app.use("/api", router)
```

Which would create these 3 routes:

```javascript
GET    /api/
GET    /api/contact
GET    /api/about
```

> **Note:** Just like how we use `.use()` to integrate middleware into our app, express has a middleware method specifically for routes, `.param()`.

### Passing variable to the view

As we saw before we are rendering our template and then passing in a local variable (_header_) to use in our template, just like instance variables defined in our controller or layouts that we passed to our views in Rails. 

We can our use our `header` variable in our `index.ejs` file like this:

```ejs
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Basic Express App</title>
    <link rel="stylesheet" href="/css/style.css">
  </head>
  <body>
  	<nav>
  	  <ul>
  	    <li><a href="/">Home</a></li>
  	    <li><a href="/about">About</a></li>
  	    <li><a href="/contact">Contact</a></li>
  	  </ul>
  	</nav>
    <h1><%= header %></h1>
  </body>
</html>
```

#### Quick EJS Revision

Let's do a quick revision about EJS. EJS is a templating language that allows you to add JavaScript into html files. 

> **Note:** What it actually does is to precompile the EJS files and run the JavaScript inside the special EJS tags and output their value as a string and then output the return the rendered HTML.

There are 2. main types of EJS tags:

1. **Printing** - will execute the JavaScript code and output the value as a string.

```ejs
<%= %>
```

2. **Non-printing** - will execute the JavaScript code but will not output the value as a string.

```ejs
<% %>
```

### Create a router module

Let's now move this router code into another file to separate it from our `app.js`.

```bash
$ mkdir config
$ touch config/routes.js
```

Inside this file we need to cut all of our route handlers and at the end of the file, we need to export our `router` variable:

```javascript
const express = require('express');
const router  = express.Router();

router.get('/',         (req, res) => res.render('index', { header: 'Home'}));
router.get('/contact',  (req, res) => res.render('index', { header: 'Contact'}));
router.get('/about',    (req, res) => res.render('index', { header: 'About'}));

module.exports = router;
```

Now inside our `app.js`, let's require this router at the top. Let's replace: 

```js
const router = express.Router();
```

With: 

```javascript
const router = require("./config/routes");
```

When we require this file, we're using the relative file path.

If you relaunch the app with:

```bash
$ nodemon app.js
```

You should now be able to use the app as you did before.

## Independent Practice (10 minutes)

> ***Note:*** _This can be a pair programming activity or done independently._

Make some more routes using this structure and some corresponding view files.

## Conculsion - (5 mins)

What have we achieved? In terms of functionality we haven't changed much. However, we've organised our code better! That's all that matters.