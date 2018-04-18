![ga_cog_large_red_rgb](https://cloud.githubusercontent.com/assets/40461/8183776/469f976e-1432-11e5-8199-6ac91363302b.png)

# Authentication with Angular & Express - Walkthrough

### Objectives

- Understand why authentication tokens are commonly used when interacting with APIs
- Add a token strategy to an application
- Authenticate a user based on their token

### Preparation

- Understand how to limit JSON
- Build a basic Express app
- Build an Angular app
- Understand foundational concepts in authentication & encryption

## Tokens, The Basics - Intro (10 mins)

When building APIs, authentication is crucial. APIs often give access to private, sometimes sensitive information, and we do not want to be responsible for secrets falling into the wrong hands. It's hard to be too careful, so today, we're going to learn a way to control access to an API that is both simple and secure.

The technique we're going to use today revolves around **tokens**. Tokens are, at their simplest, a unique string that is usually auto-generated. It needs to be long & complex enough that a human would never guess it, and unique enough that only one user in the database can have any particular one.

If we trust that we've designed it that way, then we only have to use a single string of characters to determine both who a user is claiming to be in our database and that they are who they say they are.

### Kicking it up a notch

That's the overall gist of what tokens do, but today we're going to use a specific type of token. It's a fairly new type of token, that's becoming widely used and trusted in web applications, and it's called a **JSON Web Token** or JWT (pronounced `jot`, if you can believe that).

It is the same idea – a single string of characters to authenticate – but this token isn't just _random_ characters, it's a string of characters that's built by encrypting actual information.

You can play with encoding/decoding the data over at their site as an example. Head on over to [jwt.io](http://jwt.io/#debugger) and see what I mean:

<img width="750" alt="JWTs" src="https://cloud.githubusercontent.com/assets/25366/9151601/2e3baf1a-3dbc-11e5-90f6-b22cda07a077.png">

#### Just like cookies, mmmm....

In the example above, you'll notice that there are 3 parts. The payload is the one we care the most about, and it holds whatever data we decide to put in there. It's very much like a cookie; we put as few things in there as possible – just the pieces we really need.

Applications can save a JWT somewhere on a user's computer, just like a cookie. Because JWTs can be encrypted into a single string, we can _also_ send it over HTTP really, really easily. Which means it'll work in any server/client scenario you can imagine. Quite nice.

## Sessions vs JWTS - Intro

One of the benefits of JWTs over traditional sessions is that as your website grows and you need to use multiple servers - you don't need to have a complex session storage system.

To understand this a bit more and the difference between sessions and jwts, let's think about this story:

### The Members Club

#### Sessions

I want to join a members club. I go up to the club and register. When I register, they give me a special **key** (a session key is normally stored in a cookie). Whenever I go into the club, I give the receptionist my key and they use it to open a special storage locker behind the desk (session storage). Inside the locker is some basic information about me which they can use to identify me as a real user.

The problem with this is that as the club grows, it needs to have more and more storage space for the lockers. This is made even harder by they fact that if the club needs to open another location (new server location or just another server) in a different country, the lockers are only at one club!

The important thing to note is that without the locker, the key is actually useless. Also that the key itself does not contain any user information. It is like a key to a value in a hash. They work as a pair.

#### JWTs

The alternative solution is that a person registers to a club. When they register to the club, instead of a key the club issues them a business card with a secret password on it.

The business card might contain some basic information about the user, their first and last name and their membership number - nothing valuable though.

When going to the club, the user presents their card and the club checks the secret password. The club uses a special phrase to check whether the secret password on the card is correct. If it is, then the user is allowed in.

Now the club doesn't need any locker storage and the only thing it needs to share between various clubs is the secret passphrase in order to decode secret passwords.

## Issuing a JWT token

Open up the `starter-code` and `yarn`. We have a `User` model already as well as the Bird model. We also have routes for register and login, which already has the bcrypt set up to hash the password and save a new user in the database.

Have a look inside `controllers/auth.js`. This is where we have our functions for logging in and registering. At the moment these are working well, but when the user logs in, we also want to generate a JWT token and send it to the front end Angular app.

```js
const User = require('../models/user');

function register(req, res, next) {
  User
    .create(req.body)
    .then(() => res.json({ message: 'Registration successful'}))
    .catch(next);
}

function login(req, res, next) {
  User
    .findOne({ email: req.body.email })
    .then((user) => {
      if(!user || !user.validatePassword(req.body.password)) return res.unauthorized();

      // Generate a JWT and send it to the user
      return res.json({ message: `Welcome back ${user.username}` });
    })
    .catch(next);
}

module.exports = {
  register,
  login
};
```

Before we can generate our JWT we need to install `jsonwebtoken` using `yarn`.

```bash
yarn add jsonwebtoken
```

In `controllers/auth.js` add the following underneath where you're required your `User` model:

```js
const jwt = require('jsonwebtoken');
const { secret } = require('../config/environment');
```

Now we can update the `login` function to be:

```js
function login(req, res, next) {
  User
    .findOne({ email: req.body.email })
    .then((user) => {
      if(!user || !user.validatePassword(req.body.password)) return res.unauthorized();

      const token = jwt.sign({ userId: user.id }, secret, { expiresIn: '1hr' });
      res.json({ token, message: `Welcome back ${user.username}` });
    })
    .catch(next);
}
```

In `config/routes.js` we have required the `auth` controller:

```js
const auth = require('../controllers/auth');
```

We have routes to handle `POST` requests to `/register` and `/login`:

```js
router.route('/register')
  .post(auth.register);

router.route('/login')
  .post(auth.login);
```

We can now test that our authentication routes are working using Insomnia. To test register, make a `POST` request to `http://localhost:7000/api/register` and in the body send some test data:

```js
{
  "username": "ajay",
  "email": "ajay.lard@ga.co",
  "password": "password",
  "passwordConfirmation": "password"
}
```

You should get back a `200 OK` response, along with the following:

```js
{
  "message": "Registration successful"
}
```

Now let's test the login. Make a `POST` request to `http://localhost:7000/api/login` and send in the details that we've just registered with:


```js
{
  "email": "ajay.lard@ga.co",
  "password": "password"
}
```

We should get back a `200 OK` reponse along with the following:

```js
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1OGNiYjNiZWMxODJhNWZlYmFkMmNkOWMiLCJpYXQiOjE0ODk3NDYwMzMsImV4cCI6MTQ4OTc0OTYzM30.rvMFChimt-3joEtF60Mngeosb6LbiRFT98-TzP7n7g4",
  "message": "Welcome back ajay"
}
```

We need to stop users from accessing the birds unless they are logged in. We need to create a `secureRoute` function. In the terminal:

```bash
touch lib/secureRoute.js
```

Inside `lib/secureRoute.js`:

```js
const Promise = require('bluebird');
const jwt = Promise.promisifyAll(require('jsonwebtoken'));
const { secret } = require('../config/environment');
const User = require('../models/user');

function secureRoute(req, res, next) {
  if(!req.headers.authorization) return res.unauthorized();

  const token = req.headers.authorization.replace('Bearer ', '');

  jwt.verifyAsync(token, secret)
    .then((payload) => {
      return User.findById(payload.userId);
    })
    .then((user) => {
      if(!user) return res.unauthorized();
      req.user = user;
      return next();
    })
    .catch(next);
}

module.exports = secureRoute;
```

Inside `config/routes.js` require the `secureRoute` method:

```js
const secureRoute = require('../lib/secureRoute');
```

Then, update your `/birds` routes to use the `secureRoute`.

```js
router.route('/birds')
  .all(secureRoute)
  .get(birds.index)
  .post(birds.create);

router.route('/birds/:id')
  .all(secureRoute)
  .get(birds.show)
  .put(birds.update)
  .delete(birds.delete);
```

Here we are saying that only users who send a valid token with their request can access any of these routes. To test this in Insomnia, we should take the token that was generated when we logged in and add a 'Header' to our request.

Click on the 'Headers' tab, and add an 'Authorization' header with the value of 'Bearer', followed by a space, and then your token (without quotations).

<img src="http://i.imgur.com/hLch05Z.png" style="box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.25);">

## Angular Authentication

We are going to use a package called Satellizer in order to handle JWT tokens in our Angular app. We could build out Angular authentication without Satellizer by creating our own interceptors (more on these later), but Satellizer does some of the hard work for us, and also works really nicely with lots and lots of oAuth providers. We will be looking at oAuth next week, but let's take a look at the basic Satellizer setup now.

At the moment, when we login, our API is going to issue a new JWT token and send it as part of the JSON response. Satellizer is going to take the token and add it to local storage for us. Once it's in local storage, it will send the token in the headers of any subsequent request, so that our user is allowed access to protected resources (our birds!).

Install [Satellizer](https://github.com/sahat/satellizer) to your project using `bower`:

```bash
bower install --save satellizer
```

Inject it into your Angular dependencies:

```js
angular
  .module('birdApp', ['ui.router', 'ngResource', 'satellizer']);
```

We need to create a configuration file for Satellizer in our `src/js/config` folder:

```bash
touch src/js/config/satellizer.js
```

Inside `src/js/config/satellizer.js`:

```js
angular
  .module('birdApp')
  .config(Auth);

Auth.$inject = ['$authProvider'];
function Auth($authProvider) {
  $authProvider.signupUrl = '/api/register';
  $authProvider.loginUrl = '/api/login';
}
```

We also need to create an Angular controller to handle authorization:

```js
touch src/js/controllers/auth.js
```

Inside `src/js/controllers/auth.js`:

```js
angular
  .module('birdApp')
  .controller('LoginCtrl', LoginCtrl);

LoginCtrl.$inject = ['$auth', '$state'];
function LoginCtrl($auth, $state) {
  const vm = this;
  vm.credentials = {};

  function submit() {
    $auth.login(vm.credentials)
      .then(() => $state.go('birdsIndex'));
  }

  vm.submit = submit;
}
```

We need to create a view to put our login form in.

```bash
mkdir src/js/views/auth
touch src/js/views/auth/login.html
```

Add the following HTML to the new `login.html` view:

```html
<section class="section">
  <div class="columns">
    <div class="column is-half is-offset-one-quarter">
      <form ng-submit="login.submit()">
        <div class="field">
          <label class="label" for="email">Email</label>
          <p class="control">
            <input class="input" type="text" name="email" id="email" ng-model="login.credentials.email">
          </p>
        </div>
        <div class="field">
          <label class="label" for="password">Password</label>
          <p class="control">
            <input class="input" type="password" name="password" id="password" ng-model="login.credentials.password">
          </p>
        </div>

        <div class="field">
          <p class="control">
            <input type="submit" class="button is-primary is-fullwidth" value="Login">
          </p>
        </div>
      </form>
    </div>
  </div>
</section>
```

We now need to add a `login` state to our `router.js` file. Inside `src/js/config/router.js`, underneath the `birdsEdit` state add:

```js
.state('login', {
  url: '/login',
  templateUrl: 'js/views/auth/login.html',
  controller: 'LoginCtrl as login'
});
```

Let's add a link to the login page to the navbar:

```html
<a class="nav-item" ui-sref="login">
  Login
</a>
```

> Note: Remember to remove the semi-colon from the end of the line above.

Test that this is working by going to `http://localhost:7000/login` in Chrome and logging in with the credientials you have registered with. You should be redirected to the birds index page.

Create a state for register. Inside `src/js/config/router.js`:

```js
.state('register', {
  url: '/register',
  templateUrl: 'js/views/auth/register.html',
  controller: 'RegisterCtrl as register'
});
```

In `src/js/controllers/auth.js` add a controller for register:

```js
angular
  .module('birdApp')
  .controller('RegisterCtrl', RegisterCtrl)
  .controller('LoginCtrl', LoginCtrl);

RegisterCtrl.$inject = ['$auth', '$state'];
function RegisterCtrl($auth, $state) {
  const vm = this;
  vm.user = {};

  function submit() {
    $auth.signup(vm.user)
      .then(() => $state.go('login'));
  }

  vm.submit = submit;
}
```

Create a view for the register form:

```bash
touch src/js/views/auth/register.html 
```

Add the following HTML:

```html
<section class="section">
  <div class="columns">
    <div class="column is-half is-offset-one-quarter">
      <form ng-submit="register.submit()">
        <div class="field">
          <label class="label" for="email">Username</label>
          <p class="control">
            <input class="input" type="text" name="username" id="username" ng-model="register.user.username">
          </p>
        </div>
        <div class="field">
          <label class="label" for="email">Email</label>
          <p class="control">
            <input class="input" type="text" name="email" id="email" ng-model="register.user.email">
          </p>
        </div>
        <div class="field">
          <label class="label" for="password">Password</label>
          <p class="control">
            <input class="input" type="password" name="password" id="password" ng-model="register.user.password">
          </p>
        </div>
        <div class="field">
          <label class="label" for="passwordConfirmation">Password Confirmation</label>
          <p class="control">
            <input class="input" type="password" name="passwordConfirmation" id="passwordConfirmation" ng-model="register.user.passwordConfirmation">
          </p>
        </div>

        <div class="field">
          <p class="control">
            <input type="submit" class="button is-primary is-fullwidth" value="Register">
          </p>
        </div>
      </form>
    </div>
  </div>
</section>
```

Let's add a link in the nav for register as well:

```html
<a class="nav-item" ui-sref="register">
  Register
</a>
```

Test that it works by navigating to `http://localhost:7000/register` and registering a new user with brand new credentials. You should be taken to the login page, where you can then log in with those same credentials.

## Error Handling

We are using ngResource in order to make the connection between our API and our Angular app. If you remember from the ngResource lesson, it's built on top of `$http`, which is baked into Angular. The $http service allows us to communicate with a backend and make HTTP requests. There are cases where we want to capture every request and manipulate it before sending it to the server. Other times we would like to capture the response and process it before completing the call. Global http error handling can be also a good example of such need. Interceptors are created exactly for such cases.

We are going to create an interceptor to handle any errors that we send back from the API, for example if passwords don't match, or if the form is empty.

**This is like middleware, but for AJAX requests.**

In the terminal:

```bash
touch src/js/factories/errorHandler.js
```

The `responseError` interceptor gets called when a previous interceptor threw an error or resolved with a rejection.


Inside `src/js/factories/errorHandler.js`:

```js
angular
  .module('birdApp')
  .factory('ErrorHandler', ErrorHandler);

ErrorHandler.$inject = ['$rootScope'];
function ErrorHandler($rootScope) {
  return {
    responseError: function(err) {
      $rootScope.$broadcast('error', err);
      throw err;
    }
  };
}
```

We need to create a config file for the interceptors. In the terminal:

```bash
touch src/js/config/interceptors.js
```

In `src/js/config/interceptors.js`:

```js
angular
  .module('birdApp')
  .config(Interceptors);

Interceptors.$inject = ['$httpProvider'];
function Interceptors($httpProvider) {
  $httpProvider.interceptors.push('ErrorHandler');
}
```

Create a controller that we are going to wrap around the whole app. In the terminal:

```bash
touch src/js/controllers/main.js
```

Inside `src/js/controllers/main.js`:

```js
angular
  .module('birdApp')
  .controller('MainCtrl', MainCtrl);

MainCtrl.$inject = ['$rootScope'];
function MainCtrl($rootScope) {
  $rootScope.$on('error', (e, err) => {
    console.log(e, err);
  });
}
```

Attach the `MainCtrl` to the `<body>` in `index.html`.

```html
<body ng-controller="MainCtrl as main">
  <main ui-view></main>
</body>
```

To test that this is working, navigate to `http://localhost:7000/birds` in Chrome, and open up the Chrome console. You should see two objects being console logged. You can have a look inside the objects and you will see the following:

<img src="http://i.imgur.com/gEt63yi.png" style="box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.25);">

The first object is the event and the second is the error that is being sent back from the server. Inside `statusText` we can see the "Unauthorized" message that is specified in our controller.

Inside `src/js/controllers/main.js` update the `MainCtrl`:

```js
angular
  .module('birdApp')
  .controller('MainCtrl', MainCtrl);

MainCtrl.$inject = ['$rootScope', '$state'];
function MainCtrl($rootScope, $state) {
  const vm = this;

  $rootScope.$on('error', (e, err) => {
    vm.message = err.data.message;
    $state.go('login');
  });
}
```

To display the message, in the `index.html` add:

```html
<body ng-controller="MainCtrl as main">
  <div class="notification" ng-if="main.message">{{ main.message }}</div>
  <main ui-view></main>
</body>
```

To test that this is working, navigate to `http://localhost:7000/birds` in Chrome. You should be redirected to the login page, and you should see "Unauthorized" at the top.

The problem we have now is that even if we do log in, we will still see "Unauthorized" at the top, because the page isn't refreshing, so the `MainCtrl` isn't re-instantiating.

To fix this, we can add another listener on the `$rootScope`.

Inside `src/js/controllers/main.js` update the `MainCtrl`:

```js
MainCtrl.$inject = ['$rootScope', '$state', '$transitions'];
function MainCtrl($rootScope, $state, $transitions) {
  const vm = this;

  $rootScope.$on('error', (e, err) => {
    vm.stateHasChanged = false;
    vm.message = err.data.message;
    $state.go('login');
  });

  $transitions.onSuccess({}, (transition) => {
    vm.pageName = transition.$to().name;
    if(vm.stateHasChanged) vm.message = null;
    if(!vm.stateHasChanged) vm.stateHasChanged = true;
  });
}
```

To test this is working, navigate to `http://localhost:7000/birds`, log in, and you shouldn't see "Unauthorized" at the top anymore.

We only want to redirect to the login page if the error status is 401. Update the `$state.go('login')` to be:

```js
if(err.status === 401 && vm.pageName !== 'login') {
  vm.message = err.data.message;
  $state.go('login');
}
```

In order to hide and show DOM elements, depending on whether a user is logged in or not, we can attach a `isAuthenticated` property to the `MainCtrl`, which will return `true` if we are authenticated.

```js
MainCtrl.$inject = ['$rootScope', '$state', '$transitions'];
function MainCtrl($rootScope, $state, $transitions) {
  const vm = this;

  vm.isAuthenticated = $auth.isAuthenticated;

  $rootScope.$on('error', (e, err) => {
    vm.stateHasChanged = false;
    
    if(err.status === 401 && vm.pageName !== 'login') {
      vm.message = err.data.message;
      $state.go('login');
    }
  });

  $transitions.onSuccess({}, (transition) => {
    vm.pageName = transition.$to().name;
    if(vm.stateHasChanged) vm.message = null;
    if(!vm.stateHasChanged) vm.stateHasChanged = true;
  });
}
```

To use this we can add a `<nav>` to our `index.html`:

```html
<body ng-controller="MainCtrl as main">
  <nav>
    <ul>
      <li ng-if="main.isAuthenticated()"><a ui-sref="birdsIndex">Birds</a></li>
      <li ng-if="main.isAuthenticated()"><a ui-sref="birdsNew">Add a bird</a></li>
      <li ng-if="!main.isAuthenticated()"><a ui-sref="login">Login</a></li>
      <li ng-if="!main.isAuthenticated()"><a ui-sref="register">Register</a></li>
    </ul>
  </nav>
  <div class="message" ng-if="main.message">{{ main.message }}</div>
  <main ui-view></main>
</body>
```

If we are logged in, we will see 'Birds' and 'Add a bird', but if we aren't logged in we can see 'Login' and 'Register'.

Lastly, add a link to your nav for logout:

```html
<a class="nav-item" ng-click="main.logout()">
  Logout
</a>
```

> Note: The `href="#"` attribute makes the link look like a link. You could do this with CSS instead.

And in your `src/js/controllers/main.js`, inject `'$auth'` then add the following:

```js
function logout() {
  $auth.logout();
  $state.go('login');
}

vm.logout = logout;
```