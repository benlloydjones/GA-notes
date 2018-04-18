---
title: Intro to Express
type: lesson
duration: '1:30'
creator:
    name: Alex Chin
    city: London
competencies: Server Applications
---

# Intro to Express

### Objectives
*After this lesson, students will be able to:*

- Understand how to get started with Express 4
- Use the Node HTTP module to create a basic web server with Node
- Create and use EJS templates
- Understand how to use morgan to improve logging
- Understand how to install and use nodemon 

### Preparation
*Before this lesson, students should already be able to:*

- Explain HTTP requests/responses
- Write and explain basic JavaScript

## Intro to Express

[Express.js](http://expressjs.com/) describes itself as "a minimal and flexible node.js web application framework". 

### What is a web framework?

When you want to make a website from scratch, there are common tasks that you will need to do. Frameworks hide the boilerplate and infrastructural code related to handling HTTP requests and responses. Just how much is hidden depends on the framework. 

Express is a minimal web framework and if you've used [Sinatra](http://www.sinatrarb.com/) in the Ruby world, a lot of this will be familiar.

### What is this magic?

Like any abstraction, Express hides difficult bits of creating a web framework and says "don't worry, you don't need to understand this part". It does things for you so that you don't have to bother. In other words, it's magic. 

It's good magic, too. Express is used by a lot of people incuding MySpace, Klout and Netflix.


### Installing Express

Let's say we wanted to write the "hello world" app with Express.

First we need to create a file to write our code. We could call this anything, but generally we use `server.js` or `index.js`

```bash
touch index.js
```

Next we need to install `express`. We do this using `yarn` which is the new way to use Node's package manager.

Let's first use the `yarn init` command to make a new `package.json` file.

```bash
yarn init
```

Let's use this information:

- **name:** intro-to-express
- **entry:** point: index.js

For the rest, you can just press enter. Next, install express with

```bash
yarn add express
```

You should now see a new directory called `node_modules`. The package.json file will now have been updated to indicate this project depends on `express`:

```json
"dependencies": {
  "express": "^4.13.4"
}
```

Inside `index.js`, we require Express.

```javascript
// Require the stuff we need
const express = require('express');
```

Then we make a variable called `app` which is an invocation of `express()`.

```javascript
// Require the stuff we need
const express = require('express');

// Build the app
const app = express();
```

We then add some middleware -- it's just a function. We pass this to `app.use`.

```javascript
// Require the stuff we need
const express = require('express');

// Build the app
const app = express();

// Add some middleware
app.use((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello world!');
});
```

Then we create the server and start listening of incoming requests on a specific port.

```javascript
// Require the stuff we need
var express = require('express');

// Build the app
var app = express();

// Add some middleware
app.use((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello world!');
});

// Start it up!
app.listen(3000, () => console.log('Express is up and running'));
```

Let's run this code with:

```bash
$ node index.js
```

You should now see "Hello world!".

## What is middleware?

Each piece of middleware is a request handler. You start by looking at the first request handler, then you look at the next one, then the next, and so on.

Here's what middleware basically looks like:

```javascript
function myFunMiddleware(request, response, next) {
  // Do stuff with the request and response.
  // When we're all done, call next() to defer to the next middleware.
  next();
}
```

### Basic logging middleware

When we start a server, we start at the topmost middleware and work our way to the bottom. So if we wanted to add simple logging to our app, we could do it!

```js
const express = require('express');
const app     = express();

// Logging middleware
app.use((req, res, next) => {
  console.log(`In comes a ${req.method} request to ${req.url}`);
  next();
});

// Send "hello world"
app.use((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello world!');
});

// Start it up!
app.listen(3000, () => console.log('Express is up and running'));
```

If you run this app and visit `http://localhost:3000`, you'll see that your server is logging some stuff and you'll see your page.

```sh
Express is up and running
In comes a GET request to /
```

### Morgan

While you can totally write your own, there's a _ton_ of middleware out there. Let's remove our custom logger and use [Morgan](https://github.com/expressjs/morgan), a nice logger for Express. 

```bash
yarn add morgan
```

and give this a try:

```js
const express = require('express');
const morgan  = require('morgan');
const app     = express();

app.use(morgan());
// Fun fact: morgan() returns a function.

app.use((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello world!');
});

app.listen(3000, () => console.log('Express is up and running'));
```

Visit `http://localhost:3000` and you'll see some logging! Thanks, Morgan.

## A small app with Express

One could imagine stringing together some middleware to build an app. Maybe you'd do it like this:

> **Note:** it's probably best to _not_ have the students type this out. Just copy and paste it, talk through it and demo it. 

```javascript
const express = require('express');
const morgan  = require('morgan');
const app     = express();

app.use(morgan('dev'));

// Homepage
app.use((req, res, next) => {
  if (req.url == '/') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Welcome to the homepage!');
    // The middleware stops here.
  } else {
    next();
  }
});

// About page
app.use((req, res, next) => {
  if (req.url == '/about') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Welcome to the about page!');
    // The middleware stops here.
  } else {
    next();
  }
});

// 404'd!
app.use((req, res) => {
  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('404 error!');
});

app.listen(3000, () => console.log('Express is up and running'));
```

Try it out by visiting: `http://localhost:3000/`, `http://localhost:3000/about` and `http://localhost:3000/cat` (for the 404).

However... "This is ugly! I don't like it," you say. 

The Express folks are smart. They know that this ugliness won't do.

## Top layer: routing

We've finally reached the top!

Express gives us something called "routing" which is better explained with code than with English:

```javascript
const express = require('express');
const app     = express();

app.all('*', (req, res, next) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  next();
});

app.get('/', (req, res) => {
  res.end('Welcome to the homepage!');
});

app.get('/about', (req, res) => {
  res.end('Welcome to the about page!');
});

app.get('*', (req, res) => {
  res.end('404!');
});

app.listen(3000, () => console.log('Express is up and running'));
```

_Ooh._ That's hot.

After the basic requires, we say "every request goes through this function" with `app.all`. And that function looks an awful lot like middleware!

The three calls to `app.get` are Express's routing system. They could also be `app.post`, which respond to POST requests, or PUT, or any of the HTTP verbs. 

The first argument is a path, like `/about` or `/`. The second argument is a request handler similar to what we've seen before. To quote [the Express documentation](http://expressjs.com/api.html#app.VERB):

> [These request handlers] behave just like middleware, with the one exception that these callbacks may invoke `next('route')` to bypass the remaining route callback(s). This mechanism can be used to perform pre-conditions on a route then pass control to subsequent routes when there is no reason to proceed with the route matched.

In short: they're basically middleware like we've seen before. They're just functions, just like before.


### Advanced Request handling

Express augments the request and response objects that you're passed in every request handler. [The API docs](http://expressjs.com/api.html) explain everything, but let's look at a couple of examples.

One nicety they give you is a `redirect` method. Here are some examples:

```js
app.get('/go', (req, res) => {
  res.redirect('/');
});

app.get('/google', (req, res) => {
  res.redirect('http://www.google.com/');
});
```

**Note:** You will need to comment out to prevent the error "Can't set headers after they are sent." This error  means that you're already in the Body or Finished state, but some function tried to set a header or statusCode.

```js
// app.all('*', (req, res, next) => {
//   res.writeHead(200, { 'Content-Type': 'text/plain' });
//   next();
// });
```

## Views

Express can handle also handle views. 

Express is setup to work easily with two templating engines:

- [**Jade**](http://jade-lang.com/) - a templating language that relys on code indentation
- [**EJS**](http://www.embeddedjs.com/) - very similar to HTML. Almost idential to the Ruby version ERB (embedded Ruby).

We're going to start by looking at EJS. 

First, we need to install EJS, because it's not bundled with Express. Add it to your `package.json` with: 

```bash
yarn add ejs
```

Here's what the setup in `index.js` looks like:

```js
const express = require('express');
const app     = express();

// Set the view directory to /views
app.set("views", `${__dirname}/views`);

// Let's use the Express templating language
app.set('view engine', 'ejs');
```

We are using an express `settings` to say that we are going to put "our views files in a folder called 'views'". 

Then use another express settings to say that we're going to "use EJS" to render these views.

### Making a view file

Now, we've set up these views. How do we use them?

Let's start by making a file called `index.ejs` and put it into a directory called `views`. 

```bash
$ mkdir views
$ touch views/index.ejs
```

Next, you want to open that up in Sublime and add some basic html boilerplate:

```ejs
<!DOCTYPE html>
<html>
<head>
  <title>Intro to Express</title>
</head>
<body>
</body>
</html>
```

Now inside the body tag, add:

```ejs
<body>
  <%= locals.message %>
</body>
```

These new tags `<%=` & `%>` are EJS tags used for printing variables onto the page.

There is another set of tags `<%` & `%>`, without the equals sign that are non-printing:

```ejs
<% if (locals.message) { %>
  <%= message %>
<% } %>
```

We need to render the view from within Express. Let's update the homepage action. Here's what that looks like:

```javascript
app.get('/', (req, res) => {
  res.render('index', { message: 'I love coding' });
});
```

Express adds a method to `response`, called `render`. It does a bunch of smart stuff, but it basically looks at the view engine and views directory (the stuff we defined earlier) and renders `index.ejs`.

## Static Files

If we want to serve static files like css or js files, we need to setup our application to do this.

First, let's create a new folder - the convention is that the folder should be called `public`:

```bash
$ mkdir public
$ mkdir public/css
$ touch public/css/style.css
```

Then inside this css file, lets add:

```css
body {
  background: red;
}
```

Now let's require that file in out index.html:

```ejs
<!doctype html>
<html>
<head>
  <title>Intro to Express</title>
  <link rel="stylesheet" href="/css/style.css">
</head>
<body>
  <% if (locals.message) { %>
    <%= locals.message %>
  <% } %>
</body>
</html>
```

Then in `app.js` we need to setup some [middleware](http://expressjs.com/en/starter/static-files.html).

```js
// Setup public folder to serve static files
app.use(express.static(`${__dirname}/public`));
```

Now, if you reload the app - you should see that the body is red!

## Nodemon

It's annoying to have to stop and start the server everytime you change a file isn't it!

There are a couple of different options to get around this - but a really good one is [nodemon](http://nodemon.io/).

Install with:

```bash
yarn global add nodemon
```

Now instead of running the code with `node` use `nodemon`:

```bash
nodemon
```

You can now leave the server running!

## Summary

We've done quite a lot here. We've looked at: 

- How to setup express
- How to create route actions
- How to setup express to serve views
- How to setup express to serve static files

Don't worry if you feel a bit overwhelmed, we will be using Express a lot during this course!

### What is Connect?

When you're Googling for answers about Express, you might see references to something called Connect.

Express used to be built on a thing called [Connect](https://github.com/senchalabs/connect), which is like Express but it's _just_ the middleware layer. Connect middleware is compatible with Express middleware (but not the other way around).

### Frameworks built on top of Express

There are a number of other [frameworks](https://github.com/visionmedia/express/wiki#wiki-frameworks-built-with-express) that are built ontop of Express. You might see them out in the wild but it's best to learn how to use express.

## Reference

- [Connect middleware](http://stephensugden.com/middleware_guide/)
- [Understanding Express 3](http://evanhahn.com/understanding-express-3/)
- [Express 4](http://evanhahn.com/understanding-express/)