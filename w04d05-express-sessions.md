# Sessions

### Objectives
*After this lesson, students will be able to:*

- Understand the concept of cookies and sessions
- Allow a user to log in and log out of a site

### Preparation
*Before this lesson, students should already be able to:*

- Build a RESTful Express app
- Register a user with email and password

## Intro (15 mins)

So far we have looked at hashing passwords and registering users. However we have not yet _logged a user in_ in the full sense of the term.

We need a way of authenticating the current session that the user has with the site. This means that their identity can be guaranteed across page loads.

To do this we will use cookies.

The Royal Family's website has a good definition of what a cookie is:

> "A cookie is a simple text file that is stored on your computer or mobile device by a website’s server and only that server will be able to retrieve or read the contents of that cookie. Each cookie is unique to your web browser. It will contain some anonymous information such as a unique identifier and the site name and some digits and numbers. It allows a website to remember things like your preferences or what’s in your shopping basket."
> [https://www.royal.uk/cookies](https://www.royal.uk/cookies)

We can create an encrypted session cookie to store a user's id once they have logged in. Using this id we can retrieve the user's information across page loads. This means that the user does not have to keep providing their username and password as they move around the site.

## `express-sessions` (15 mins)

Let's start by install and configuring `express-session`, which will allow us to start using session cookies.

```sh
yarn add express-session
```

Now in our `index.js` file, we need to require the package and configure:

```js
app.use(session({
  secret: process.env.SESSION_SECRET || 'ssh it\'s a secret',
  resave: false,
  saveUninitialized: false
}));
```

We need to provide a secret, which will be used to decrypt the users id, so we can access their user data.

The other options are only provided for deprecation reasons. We are sticking with the recommended defaults. For more info checkout the [documentation](https://github.com/expressjs/session).

We can improve this by moving the secret key definition into the `config/environment` file:

```js
module.exports = {
  port: process.env.PORT || 4000,
  dbURI: process.env.MONGODB_URI || 'mongodb://localhost/i-movie-db',
  secret: process.env.SESSION_SECRET || 'ssh it\'s a secret'
};
```

Then we can require it in `index.js`:

```js
const { port, dbURI, secret } = require('./config/environment');
```

Then we can use this variable here:

```js
app.use(session({
  secret: secret,
  resave: false,
  saveUninitialized: false
}));
```

## Updating the sessions controller (10 mins)

Now that we have enabled sessions, we can store data in the session using `req.session`. When a user logs in, we will store their userId in the local session storage (like a locker on the server-side for that user). We can use this property to check if a valid user has logged in later and fetch their information from the database.

```js
function sessionsCreate(req, res) {
  User
    .findOne({ email: req.body.email })
    .then((user) => {
      if(!user || !user.validatePassword(req.body.password)) {
        return res.status(401).render('sessions/new', { message: 'Unrecognised credentials' });
      }

      req.session.userId = user.id;

      return res.redirect('/');
    });
}
```

Great, we've logged in. But there a few things to do still.

We need to inform the user that they have successfully logged in, and we should change the navbar to have a `logout` link. We should also hide an log in and register links.

Finally we should make some of the pages on our site protected so that only logged in users can gain access.

## Updating the view with `.locals` (15 mins)

When we run `res.render` we can pass in data in this format:

```js
res.render('templateName', { data });
```

The data object is itself attached to another object, `res.locals`. It then becomes available in the view as `data`, or `locals.data`.

If we attach information to `res.locals` it will be accessible in any view. This is really useful to us, because we can use it to pass the logged in user's data to all views!

To do that, we'll create some custom middleware in `index.js` use above `app.use(routes)`:

```js
app.use((req, res, next) => {
  if (!req.session.userId) return next();

  // Where we are going to add some more code
});

app.use(routes);
```

Firstly, if the user is not authenticated, there's nothing to do, so we can skip this middleware altogether.

Next, we need to find the user, based on the `userId` stored in the session cookie:

```js
app.use((req, res, next) => {
  if (!req.session.userId) return next();

  User
    .findById(req.session.userId)
    .then((user) => {

		  // Re-assign the session id for good measure
    	req.session.userId = user.id;

      res.locals.currentUser = user;
      res.locals.isAuthenticated = true;

      next();
    });
});
```

> **Note:** we'll also have to require `User` earlier!

```js
const User           = require('./models/user');
```

Here we are setting the user to `res.locals` and adding an `isAuthenticated` helper property that we can use in the views to update our navigation links.

#### What if we can't find the user?

So there is an edge case, where the user did log in, but during their session their account is suspended or deleted. In this instance we need to log the user out, and redirect them to the homepage.

We can log out by regenerating the session cookie, and essentially clearing out the user's id in the process.

```js
User
  .findById(req.session.userId)
  .exec()
  .then((user) => {
    if(!user) {
      return req.session.regenerate(() => {
        res.redirect('/');
      });
    }

	  // Re-assign the session id for good measure
	  req.session.userId = user.id;

    res.locals.currentUser = user;
    res.locals.isAuthenticated = true;

    next();
  });
```

Ok, so now we have the user's data available in the view, we can use it like this...

In `partials/navbar.ejs` replace:

```html
<ul class="navbar-nav mr-auto">
  <li class="nav-item">
    <a class="nav-link" href="/films">Films</a>
  </li>
  <li class="nav-item">
    <a class="nav-link" href="/login">Log In</a>
  </li>
  <li class="nav-item">
    <a class="nav-link" href="/register">Register</a>
  </li>
</ul>
```

With:

```html
<ul class="navbar-nav mr-auto">
  <li class="nav-item">
    <a class="nav-link" href="/films">Films</a>
  </li>
  <% if (locals.isAuthenticated) { %>
    <li class="nav-item">
      <a class="nav-link" href="/logout">Logout</a>
    </li>
  <% } else { %>
    <li class="nav-item">
      <a class="nav-link" href="/login">Log In</a>
    </li>
    <li class="nav-item">
      <a class="nav-link" href="/register">Register</a>
    </li>
  <% } %>
</ul>
```

Cool, let's test it out!

## Logging out

In order to log out we need to regenerate our session, and redirect the user to the homepage:

In our sessions controller let's create an action for this:

```js
function sessionsDelete(req, res) {
  return req.session.regenerate(() => res.redirect('/'));
}

module.exports = {
  new: sessionsNew,
  create: sessionsCreate,
  delete: sessionsDelete
};
```

> **Note:** Remember to exports it!

And then in our router:

```js
router.route('/logout')
  .get(sessions.delete);
```

>**Note:** This is really stretching our REST paradigm. Really we should use a DELETE method here, but that would require a form in the navbar. For simplicity we'll use a GET request.

## Protecting certain routes (10 mins)

One of the main reasons for requiring a user registers and authenticates themselves when using a website is to offer extra features or functionality for those who are logged in.

To do this we need to create another piece of middleware in our `config/routes.js` file.

```js
function secureRoute(req, res, next) {
  if (!req.session.userId) {
    return req.session.regenerate(() => {
      res.redirect('/login');
    });
  }

  return next();
}
```

This is fairly straightforward. If there is no `userId`  in the session, we regenerate the session and redirect the user to the login page.

At the moment, this is a function declaration, and so is not yet being used. We want to add this only to routes that should be protected.

Let's only allow logged in users to CREATE, UPDATE and DELETE:

```js
router.route('/films')
  .get(films.index)
  .post(secureRoute, films.create);

router.route('/films/new')
  .get(secureRoute, films.new);

router.route('/films/:id')
  .get(films.show)
  .put(secureRoute, films.update)
  .delete(secureRoute, films.delete);

router.route('/films/:id/edit')
  .get(secureRoute, films.edit);
```

As you can see we can send multiple middleware functions to a route. With the create route for example, we first use our `secureRoute` method to check if a user has logged in. If the request makes it through, it will hit the create method as usual. Otherwise, it will hit the redirect in the `secureRoute` function and the user will be redirected.

## Let's get flashy! (10 mins)

So our site is secure, and we can sleep comfortably at night. However our users may be a little miffed. They are being sent around the houses without really knowing why.

Since we have enabled session cookies, we can use another package called `express-flash`, which will store information over page load that we can display to the user.

It's called a flash because it will only be displayed after the first page load or redirect, but disappear afterwards. It's ideal for sending short informative messages to the user, like that they've been logged out.

Install with yarn:

```sh
yarn add express-flash
```

It's very simple to add to our app, but it's important that it comes **AFTER** the sessions in our `index.js` file:

```js
app.use(session({
  secret: process.env.SESSION_SECRET || 'ssh it\'s a secret',
  resave: false,
  saveUninitialized: false
}));

app.use(flash());
```

Now we have set it up, let's use it first in our `secureRoute` function in the `routes.js` file.

```js
function secureRoute(req, res, next) {
  if (!req.session.userId) {
    return req.session.regenerate(() => {
      req.flash('danger', 'You must be logged in.');
      res.redirect('/login');
    });
  }

  return next();
}
```

We can also add a similar message in our custom middleware for finding the logged in user:

```js
User
  .findById(req.session.userId)
  .then((user) => {
    if(!user) {
      return req.session.regenerate(() => {
        req.flash('danger', 'You must be logged in.');
        res.redirect('/');
      });
    }

    // Re-assign the session id for good measure
    req.session.userId = user.id;

    res.locals.currentUser = user;
    res.§.isAuthenticated = true;

    return next();
  });
```

Finally we can also welcome the user when they register...

```js
function registrationsCreate(req, res) {
  User
    .create(req.body)
    .then((user) => {
      req.flash('info', `Thanks for registering, ${user.username}! Please login.`);
      return res.redirect('/login');
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).render('registrations/new', { message: 'Passwords do not match' });
      }
      res.status(500).end();
    });
}
```

Or login (both as an error and as a success message!)

```js
function sessionsCreate(req, res) {
  User
    .findOne({ email: req.body.email })
    .then((user) => {
      if(!user || !user.validatePassword(req.body.password)) {
        req.flash('danger', 'Unknown email/password combination');
        return res.redirect('/login');
      }

      req.session.userId = user.id;

      req.flash('info', `Welcome back, ${user.username}!`);
      res.redirect('/');
    });
}
```

In order to see the messages we need to update our `layout.ejs` accordingly:

```html
<main class="container">
  <% for (const type in messages) { %>
    <p class="alert alert-<%= type %>"><%= messages[type] %></p>
  <% } %>

  <%- body %>
</main>
```

You should be able to see this now if you navigate to a protected route.


## Conclusion (5 mins)

We have looked at what is involed in logging in. Although not the only method, using an excrypted session cookie is a common solution to this problem.

Whenever you see the cookie notice on a website, chances are you've been authenticated with a session cookie.

We'll be looking at **token** authentication in the next module.
