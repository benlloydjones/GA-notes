---
title: Error Handling
type: lesson
duration: "1:25"
creator:
    name: Mike Hayden, Alex Chin
    city: London
competencies: Server Applications
---

# Error Handling

### Objectives
*After this lesson, students will be able to:*

- Manage errors better in an Express application
- Understand `next`
- Create a global error catcher

### Preparation
*Before this lesson, students should already be able to:*

- Must be able to make a basic express API

# Error Handling Introduction (5mins)

Although not the most exciting aspect of web development, providing users with clear error messages is an essential part of the work that we do.

We all know how frustrating it is when things go wrong with a website. Even more frustrating is when, as a user, we aren't informed as to what went wrong.

## A global error catcher (15mins)

The most important errors to catch are fatal errors. A fatal error is one that will make our server crash.

Rather than letting the server crash, we can catch the fatal error, send a message to the user and keep the server up and running ready to handle more requests.

In our `index.js` file, let's write some custom middleware to handle fatal errors.

This should be the **VERY LAST** piece of middleware before our `app.listen` method.

```js
app.use((err, req, res, next) => {
  err.status = err.status || 500;
  err.message = err.message || 'Internal Server Error';
  
  res.status(err.status).json({ message: err.message });
  
  next(err);
});
```

> **Note:** There MUST be four arguments.

We are checking to see if the error has a status, and if not setting the status to 500 (Internal Server Error). We'll do the same with the error message.

Finally we are sending a JSON response to the client with the appropriate HTTP status.

Let's test this by causing an error. Using insomnia let's try to get a bird that doesn't exist. Navigate to `http://localhost:4000/api/birds/123`.

You should see that insomnia is just hanging. The server does not know how to respond to this situation so it just hangs there.

If you check the terminal you will see the unhandled error printed out:

```sh
Unhandled rejection MongooseError: Cast to ObjectId failed for value "123" at path "_id"
```

As things stand we have no `.catch` block in our promise chain, so the error has no way of reaching our global error catcher.

We need to add `next` to the `showRoute` function, and pass it into our `.catch` block.

```js
function showRoute(req, res, next) {
  Bird
    .findById(req.params.id)
    .exec()
    .then(bird => res.json(bird))
    .catch(next);
}
```

If we try the same request, we should now get an error sent to insomnia.

## Handling 404 errors (15mins)

In `controllers/birds.js`, let's create a 404 error if we can't find a specific bird:

```js
function showRoute(req, res, next) {
  Bird
    .findById(req.params.id)
    .then(bird => {
      if(!bird) {
        const err = new Error('Not Found');
        err.status = 404;
        throw err;
      }
	  res.json(bird):
    })
    .catch(next);
}
```

We've created our own JavaScript error! We've created it with the message `Not found`, and given it the status `404`, then `thrown` it.

When an error is thrown in a promise chain, we jump straight to the `.catch` block. We could handle the error there, or simply pass it on to the next piece of middleware, which will be our `errorHandler`.

Let's test this now. Point insomnia to `http://localhost:4000/api/birds/5992ea983888c85eb755f265` again.

We should now see a `404 Not Found` error message in insomnia.

>**Note:** you should now go ahead and update the rest of the controller functions accordingly, giving them a catch block with a `next` argument.

We should now go through and add these errors to the EDIT and DELETE routes as well, but the code is ugly and repetitive. Let's refactor first.

### Custom responses

We're going to add this code to the `res` object, a bit like the `.json()` method, so rather than having to type it all out, we can just call `res.notFound()`. This is not only neat, but it's descriptive and easy to read.

To do this we need to write some more middleware in `index.js`:

```js
app.use((req, res, next) {
  res.notFound = function notFound() {
    const err = new Error('Not Found');
    err.status = 404;

    throw err;
  }

  next();
})
```

Let's update our controller:

```js
function showRoute(req, res, next) {
  Bird
    .findById(req.params.id)
    .then(bird => {
      if(!bird) res.notFound();
      res.json(bird);
    })
    .catch(next);
}
```

That's real neat!

## Tidying up (15 mins)

While we're here we can tidy up our `index.js` by moving our custom middleware into modules. We will put all our custom modules into the `lib/` folder.

Let's create a file called `customResponses.js`:

```sh
touch lib/customResponses.js
```

We can move our function from the `index.js` file and place it into `customResponses.js`, name it, and export it.

```js
function customResponses(req, res, next) {
  res.notFound = function notFound() {
    const err = new Error('Not Found');
    err.status = 404;

    throw err;
  };

  next();
}

module.exports = customResponses;
```

Now we can require it at the top of `index.js` and use it in place of the code that we removed:

```js
const customResponses = require('./lib/customResponses');
.
.
.
app.use(customResponses);
```

Cool. We can do the same for our error handler middleware.

Create a file called `errorHandler.js` in `lib/`

```sh
touch lib/errorHandler.js
```

Now add the code from `index.js` into this file:

```js
function errorHandler(err, req, res, next) {
  err.status = err.status || 500;
  err.message = err.message || 'Internal Server Error';
  
  res.status(err.status).json({ message: err.message });
  
  next(err);
}

module.exports = errorHandler;
```

Now require it in `index.js` and add back in at the bottom of the file:

```js
const errorHandler = require('./lib/errorHandler');
.
.
.
app.use(errorHandler);
```

### Unauthorized

Since we'll be looking at authentication next, we should create an `Unauthorized` custom response, similar to our `Not Found` response.

Back in `lib/customResponses.js` let's add a second helper method:

```js
function customResponses(req, res, next) {
  res.notFound = function notFound() {
    const err = new Error('Not Found');
    err.status = 404;

    throw err;
  };
  
  res.unauthorized = function unauthorized() {
    const err = new Error('Unauthorized');
    err.status = 401;
    
    throw err;
  };

  next();
}

module.exports = customResponses;
```

Great! This will come in very handy when we add authentication to our APIs.

## Conclusion (5 mins)

Error handling is often left to the end of the development, but actually very useful to us during the development process. It's always best to set up our error handling early on in the build so that we have a clear idea of what is happening when things go wrong.
