# Express Authentication

### Objectives
*After this lesson, students will be able to:*

- Understand how to integrate bcrypt into an Express app
- Build the foundation to create a JWT authenticated app

### Preparation
*Before this lesson, students should already be able to:*

- Students should have seen bcrypt in use
- Students should understand the concept of hashing

## Integrating Bcrypt into an Express app

Previously, we have used bcrypt to take a cleartext password and create a hashed password to save into the database. However, we haven't integrated this into an Express app.

During this lesson, we are going to develop two endpoints:

- `POST /register`
- `POST /login`

### Look at the starter-code

*Send over the starter-code.*

You should have a basic express app setup with this folder structure:

```
├── config
│   ├── environment.js
│   └── routes.js
├── controllers
│   ├── registrations.js
│   ├── sessions.js
│   └── static.js
├── models
│   └── user.js
├── package.json
├── server.js
└── views
    ├── index.ejs
    ├── layout.ejs
    ├── registrations
    │   └── new.ejs
    └── sessions
        └── new.ejs
```

#### Registrations Controller

Although technically not a RESTful route, we will stick closely to the REST paradigm by using a registrations controller for registering a user...

```js
const User = require('../models/user');

function newRoute(req, res) {
  res.render('registration/new');
}

function createRoute(req, res){

}

module.exports = {
  new: newRoute,
  create: createRoute
};
```

#### Sessions Controller

... and a sessions controller for login.

**A session?**

This is a convention borrowed from Ruby on Rails. When we log in, we are essentially creating an authorised _session_ with the site. The session will last until we log out again.

### User model

```js
const mongoose = require('mongoose');
const bcrypt   = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: { type: String, required: true }
});

module.exports = mongoose.model('User', userSchema);
```

To start with we have a very simple user model, with three properties: `username`, `email` and `password`. We'll be fleshing this out during the session.

### The homepage

We have moved the logic for the homepage to a `static` controller. In this app, our homepage will simply display the registered users in our database, so we can tell if our register route is working as expected.

## Register

First, we need to write the logic that will create a new user:

```js
function createRoute(req, res){
  User
    .create(req.body)
    .then((user) => {
      res.redirect('/');
    })
    .catch((err) => res.status(500).end());
}
```

Great!

Next, we need to hook the controller action to the `/register` path using our router:

```js
router.route('/register')
  .get(registrations.new)
  .post(registrations.create);
```

### Let's test it

Navigate to `http://localhost:3000/register` and fill in the form. When you submit, you should be redirected to the homepage, and should see the newly created user there.

Great! But there's a big problem here: we should **never** store passwords as plain text in our database. It's a big security risk.

## Hashing our password

When we store a user's password we first need to hash it. Hashing is similar to encryption, except that with encryption the idea is that data that has been encrypted should, at some point, be decrypted again.

Often large files or documents are encrypted, then transfered and decrypted to secure the information stored within.

However when we store passwords, we **hash** them. Hashing, unlike encryption is designed to **never be dehashed**. It's a one-way process, which increases the level of security.

Rather than decrypting the password stored in the database, we use the same hashing algorthm on the password provided when the user logs in, and compare it to the hashed password stored in the database. If both hashs match, then the user has provided the correct password.

>**Note:** for more information on why we hash passwords, check out this blog post: [Why Passwords Should be Hashed](http://security.blogoverflow.com/2011/11/why-passwords-should-be-hashed/)

Since it's the defacto industry standard, we'll be using Bcrypt to hash our passwords. Let's install it using yarn:

```sh
yarn add bcrypt
```

And require it in the user model:

```js
const bcrypt = require('bcrypt');
```

The idea is that when we register a user, their password should be hashed. We could write this logic in the controller, but its better to do it in the model. As a general rule we want **skinny controllers** and **fat models**.

### Lifecycle hooks

Mongoose models make two important steps when saving or creating a record: the _validation stage_, and the _saving stage_. We can add our own login at either step using a `pre` or `post` hook.

Since we want to hash our password **before** we save it to the database, let's add the logic to a `pre` save hook:

```js
userSchema.pre('save', function hashPassword(next) {
  this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(8));
  next();
});
```

Great! Let's test it out.

### Constantly changing hashes

This looks good, but we have a problem. The pre save hook will fire on update as well, which means if the user updated their email address or username, the pre save hook would fire, and the password hash would be re-hashed! This obviously won't do.

We can improve on this by only hashing the password **if it is changed**:

```js
userSchema.pre('save', function hashPassword(next) {
  if(this.isModified('password')) {
    this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(8));
  }
  next();
});
```

Nice!

## Mongoose virtuals

We've hashed our password, but we can improve this a little. Let's make sure that the password and password confirmation matches, before we hash the password.

To do this we'll need to create a virtual property. A virtual property is one that is accessible in the pre hooks, but will not be stored in the database. `passwordConfirmation` is something that we want to check, but not keep in the database, so it makes sense to use a virtual here:

```js
userSchema
  .virtual('passwordConfirmation')
  .set(function setPasswordConfirmation(passwordConfirmation) {
    this._passwordConfirmation = passwordConfirmation;
  });
```

We're storing the passwordConfirmation on `this` just for now, we're going to need it in a minute:

```js
userSchema.pre('validate', function checkPassword(next) {
  if(this.isModified('password') && this._passwordConfirmation !== this.password) this.invalidate('passwordConfirmation', 'does not match');
  next();
});
```

This is a pre validate hook. Before the validation stage happens this function is fired. If a user has modified their password, and it doesn't match the `passwordConfirmation` supplied, we invalidate and throw an error.

## Basic error handling

Let's update our controller to handle this error:

```js
function createRoute(req, res){
  User
    .create(req.body)
    .then((user) => {
      res.redirect('/');
    })
    .catch((err) => {
      if(err.name === 'ValidationError') {
        return res.status(400).render('registrations/new', { message: 'Passwords do not match' })
      }
      res.status(500).end();
    });
}
```

Now if the passwords don't match we will re-render the form, and send an error message, which we can display in the view like so:

```html
<% if(locals.message) { %>
  <p><%= message %></p>
<% } %>
<form method="POST" action="/register">
  .
  .
  .
</form>
```

This error handling can be improved on a lot, but it will suffice for now.

## Login

In order to log a user in, we need to take their email address and password. We'll use a Bcrypt function to hash this password and compare it to the one stored in the database.

We'll write a custom instance method in the model to do this:

```js
userSchema.methods.validatePassword = function validatePassword(password) {
  return bcrypt.compareSync(password, this.password);
};
```

Here bcrypt will compare the provided password with the one in the database, and will return a boolean.

Let's use it in our sessions controller:

```js
function createRoute(req, res) {
  User
    .findOne({ email: req.body.email })
    .then((user) => {
      if(!user || !user.validatePassword(req.body.password)) {
        res.status(401).render('sessions/new', { message: 'Unrecognised credentials' });
      }
      res.redirect('/');
    });
}
```

Finally let's update the login form to display the message:

```html
<% if(locals.message) { %>
  <p><%= message %></p>
<% } %>
<form method="POST" action="/login">
  .
  .
  .
</form>
```

## Conclusion (5 mins)

So we have now made two endpoints that will enable a user to register to our API.

However, what we haven't done is to have any way of keeping someone "logged in".

We will need to move onto the next lesson to do that!
