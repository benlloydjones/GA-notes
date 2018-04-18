# oAuth with Express, oAuth & Github

### Objectives
- Create an oAuth _**handshake**_ between an Express app and an oAuth provider.
- Access the user's profile, create a user record, and create a session cookie.

## Intro (5 mins)

oAuth is an authentication standard used across the web. The basic principal is that a trusted thrid-party can be used to verify a user's credibilty. This is useful because firstly it allows users to log in to a website without having to enter their full credentials (particularly useful with mobile apps). Secondly it promotes the third-party brand, and allows a link between the two sites.

Let's take Facebook as an example. A user is already logged in to Facebook (because, you know, we're _always_ logged in to Facebook right!?). The user navigates to our website, and is propted to log in. She could set up a new account with email and password, but the process in quite lengthy and requires her verifying her email etc. She's in a rush and on her mobile, so instead she decides to log in with Facebook.

A window pops up asking if she's happy to proceed. The window is from Facebook, and informs her what data of her's the site will be able to access. She clicks ok and is now logged in. The whole process took less than a minute.

On the server however, there's a lot going on behind the scenes.

## oAuth Authentication Flow (10 mins)

In this lesson we will actually be using _GitHub_ as our oAuth provider, however, the flow is similar for every oAuth provider, be it Facebook, Twitter, Soundcloud or whatever.

Let's have a look at a typical oAuth user flow from start to finish, so we understand what's invloved at a high level before we get started.

### Step 1

On our site there will be a `Login with Github` button, which will be a link to a login page at Github. Once the user has logged in, or more likely, if the user is already logged in, a confirmation screen will appear informing the user what data our site is attempting to access from Github's servers:

![confirmation-screen](https://cloud.githubusercontent.com/assets/3531085/23410562/927e8e58-fdc7-11e6-99db-37ad4852d6c8.png)

If the user is happy to continue, they allow the authorization process to begin by clicking on the _Authorize application_ button.

Github then sends a request to our server with a unique, time sensitive code.

### Step 2

We need to handle that request, so that we can access the unique code. We then **send that code back** to Github, along with some Github credentials to prove that we are indeed the site that the user is allowing to access their data.

### Step 3

Github receives our request, containing the unique code and our credentials, and sends back an access token, which we can use to access the users data.

### Step 4

Using the access code, we make a request for the user's data. Github sends back the user's data (including _username_, _email_ etc).

### Step 5

We use the user's data to create a new user document in our database and set up the users session.


## Creating a GitHub oAuth App (10 mins)

Before we can start the process, we need to create an oAuth app on github. Navigate to: `https://github.com/settings/developers`. And click on _Register a new application_ in the top right-hand corner.

![creating-github-oauth-app](https://user-images.githubusercontent.com/3531085/30862071-b3b72416-a2c4-11e7-8670-f110828a6cb9.png)

Fill out the form. All fields are required, except the app's description.

The application name can be anything, but it will be displayed to the user in _Step 1_ of the authentication flow.

The _Homepage URL_ should be your site's homepage, use `http://localhost:3000` for now.

The _Authorization callback URL_ is the url that github will send its requests to in _Step 2_. Set it to `http://localhost:3000/oauth/github`.

Once you submit the form, you'll be taken to your app's settings page:

![oauth-app-settings](https://cloud.githubusercontent.com/assets/3531085/23410561/927e78b4-fdc7-11e6-98a6-2b9b8f8e122e.png)

Here you'll see (amongst other things) a **Client ID** and a **Client Secret**. These are the credentials we need in _Step 3_.

## Environment Variables (10 mins)

We we have to use sensitive information in our apps, it's very important that we **don't add them directly to our codebase**. If we do, they will be pushed up to our Github repo, which is **publicly available**, that means anyone can take them and use them without our knowledge. This can be particularly problematic if these are credentials to a paid service like AWS!

To get around this we can use _Environment Variables_, which are stored locally on our machines, and accessed by our apps at runtime. Let's set up environment variables for our Github app credentials.

In your home directory, you have a `.zshrc` file, which contains settings for your terminal. You can open it in atom with the following command:

```bash
$ atom ~/.zshrc
```

Add the following lines at the bottom of the file:

```bash
export GITHUB_CLIENT_ID="29a2ba192af2e4d8ae32"
export GITHUB_CLIENT_SECRET="7877f65b8e11aa182360a91ac814a15ecb1b24cc"
```

Now **save** and **close** the file.

#### Now for the important bit: `source`

So far we have **updated** the `.zshrc` file, but we need to run it in order for the terminal to update its settings. We do this with `source`.

```bash
$ source ~/.zshrc
```

We need to do this on **ALL OPEN TABS** of our terminal. If you have lots of tabs open, it may be quicker to quit terminal and reopen it. This will also update the terminal settings.

To test that the changes have taken place, type `env` in the terminal. You should see your `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` listed somewhere in the output.

## Logging in with Github (40 mins)

OK, down to the nitty gritty of actually making this whole thing work. We shall work through this in the order that we outlined earlier, and to help us, we will need [Github's oAuth documentation](https://developer.github.com/apps/building-integrations/setting-up-and-registering-oauth-apps/about-authorization-options-for-oauth-apps/).

### Step 1: A "Login with Github" button.

We'll be using Satellizer to help manage the client side of this process. Install it with bower:

```
bower i --save satellizer
```

And create a config file in `src/js/config`

```
touch src/js/config/satellizer.js
```

Now we need to configure our app to point to the correct endpoint on our API, and also to provide out Github app's client Id:

```js
angular
  .module('githubAuth')
  .config(Auth);

Auth.$inject = ['$authProvider'];
function Auth($authProvider){
  $authProvider.github({
    clientId: '29a2ba192af2e4d8ae32',
    url: '/api/oauth/github'
  });
}
```

Ok, let's create a `Login With Github` button in our login view which is located in `/js/views/oauth/login.html`:

```html
<button ng-click="login.authenticate('github')">Login with Github</button>
```

And finally let's create that `authenticate` method in the `LoginCtrl`:

```js
angular
  .module('githubAuth')
  .controller('LoginCtrl', LoginCtrl);

LoginCtrl.$inject = ['$auth', '$state'];
function LoginCtrl($auth, $state) {
  const vm = this;

  function authenticate(provider) {
    $auth.authenticate(provider)
      .then(() => $state.go('profile'));
  }

  vm.authenticate = authenticate;
}
```

Ok great, so now when we click on the button, we fire the `authenticate` method passing `'github'` which tells Satellizer to use the configuration we set up in `src/js/config/satellizer` for github.

This will create a popup window with a button from Github asking the user if they would like to proceed. It should look something like this:

![oAuth Popup](https://developer.github.com/assets/images/oauth_prompt.png)

### Step 2: Handling the request from Github

Once the user authorizes our application, we will receive a `POST` request with a code from Github which will arrive at the URL we specified when we configured satellizer, which in our case is `/api/oauth/github`.

We need to listen out of that request:

```sh
$ touch controllers/oauth.js
```

For now we are just going to return a 200 response:

```js
function github(req, res, next) {
  console.log(req.body);
  res.sendStatus(200);
  next();
}

module.exports = {
  github
};
```

Now hook it up in our `config/routes.js`

```js
const oauth = require('../controllers/oauth');
.
.
.
router.route('/oauth/github')
  .get(oauth.github);
```

If you login now, you should see the following in the terminal:

```sh
{ code: 'cdfc7a140e729557e4e7' } 
```

That's the code we need from Github!

### Step 3: Requesting an access token

We now need to send a request to Github from our controller. Looking at the documentation we can see that we need to send, our client ID, client secret, and the code we got from the last step.

To make a request from our server to Github's we need a new package called `request-promise`:

```bash
yarn add request-promise
```

Require it at the top of the oauth controller along with our config:

```js
const rp = require('request-promise');
```

Using the [documentation](https://developer.github.com/apps/building-integrations/setting-up-and-registering-oauth-apps/about-authorization-options-for-oauth-apps/) we can find the correct URL to make our request for an access token.

```js
function(req, res, next) {
  return rp({
    method: 'POST',
    url: 'https://github.com/login/oauth/access_token',
    qs: {
      client_id: processs.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code: req.query.code
    },
    json: true
  })
  .then((token) => {
    console.log(token);
    res.sendStatus(200);
  })
  .catch(next);
}
```

This should all be fairly straightforward. `qs` stands for querystring. Anything in this attibute will be added to the querystring of the url. We're also passing the `json` flag to make sure we get back an object rather than a string.

If we log in again, we should see the token in the terminal.

```bash
{ access_token: '2893fc6067ca29fa5008b0efc2a9022092c37af6',
  token_type: 'bearer',
  scope: 'user:email' }
```

### Step 4: Getting the user's profile

Now we have the access token, we can use it to make a request for the user's data. We need to make this request to: `https://api.github.com/user`. Let's use it to make the request:

```js
function github(req, res, next) {
  .
  .then((token) => {
    return rp({
      method: 'GET',
      url: 'https://api.github.com/user',
      qs: token,
      json: true
    });
  })
  .then((profile) => {
    console.log(profile);
    res.send();
  })
  .catch(next);
}
```

If you log in again, you'll see an error:

```
StatusCodeError: 403 - "Request forbidden by administrative rules. Please make sure your request has a User-Agent header (http://developer.github.com/v3/#user-agent-required). Check https://developer.github.com for other possible causes.\n"
```

Oh dear. Github will only accept a request to it's api, if we pass a User-Agent header with the request. Typically the User-Agent header would contain information about the browser that made the request. We don't have a browser, so we can send `Request-Promise` in our header:

```
return rp({
  method: 'GET',
  url: 'https://api.github.com/user',
  qs: token,
  headers: {
    'User-Agent': 'Request-Promise'
  },
  json: true
});
```

Cool. Login in again, and you should see the user's details in your terminal:

```bash
{ login: 'mickyginger',
  id: 3531085,
  avatar_url: 'https://avatars.githubusercontent.com/u/3531085?v=3',
  gravatar_id: '',
  url: 'https://api.github.com/users/mickyginger',
  html_url: 'https://github.com/mickyginger',
  followers_url: 'https://api.github.com/users/mickyginger/followers',
  following_url: 'https://api.github.com/users/mickyginger/following{/other_user}',
  gists_url: 'https://api.github.com/users/mickyginger/gists{/gist_id}',
  starred_url: 'https://api.github.com/users/mickyginger/starred{/owner}{/repo}',
  subscriptions_url: 'https://api.github.com/users/mickyginger/subscriptions',
  organizations_url: 'https://api.github.com/users/mickyginger/orgs',
  repos_url: 'https://api.github.com/users/mickyginger/repos',
  events_url: 'https://api.github.com/users/mickyginger/events{/privacy}',
  received_events_url: 'https://api.github.com/users/mickyginger/received_events',
  type: 'User',
  site_admin: false,
  name: 'Mike Hayden',
  company: null,
  blog: 'https://github.com/mickyginger',
  location: 'London, UK',
  email: 'mickyginger@gmail.com',
  hireable: null,
  bio: null,
  public_repos: 25,
  public_gists: 1,
  followers: 27,
  following: 0,
  created_at: '2013-02-11T10:17:36Z',
  updated_at: '2016-09-20T14:06:22Z' }
```

Pimp! We're almost there!

### Step 5: Create a user document

Finally we need to store this user's details in our database. Firstly we need to require the user model at the top of the controller:

```js
const User = require('../models/user');
```

There is a chance that this user has already logged in to our site, in which case they may already be in our database. In that case we need to find them first:

```js
function github(req, res, next) {
  .
  .
  .then((profile) => {
    return User
      .findOne({ email: profile.email })
  })
```

If the user is found, we can add their github id to their profile and save it.

```js
function github(req, res, next) {
  .
  .
  .then((profile) => {
    return User
      .findOne({ email: profile.email })
      .then((user) => {
        user.githubId = profile.id;
        return user.save();
      });
  })
```

Of course, we will need to update the user schema:

```js
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  image: { type: String },
  githubId: { type: Number }
});
```

That's fine if we have a user, but what if we don't. We will need to create one first:

```js
function github(req, res, next) {
  .
  .
  .then((profile) => {
    return User
      .findOne({ email: profile.email })
      .then((user) => {
        if(!user) {
          user = new User({
            username: profile.login,
            email: profile.email,
            image: profile.avatar_url
          });
        }
        
        user.githubId = profile.id;
        return user.save();
      });
  })
```

This is fine but what about the `password` and `passwordConfirmation`? We are trying to create a user without a password, which will fail our validations. 

Let's update the user model to deal with that. Firstly we can make the `password` optional:

```js
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  image: { type: String },
  githubId: { type: Number }
});
```

Then we can update our pre validate hook:

```js
userSchema.pre('validate', function checkPassword(next) {
  if(!this.password && !this.githubId) {
    this.invalidate('password', 'required');
  }
  if(this.password && this._passwordConfirmation !== this.password){
    this.invalidate('passwordConfirmation', 'does not match');
  }
  next();
});
```

Now the user either has to have a `password` **or** a `githubId` when registering.

Great! Now we just need to generate a token, to send to the client. We'll need to require `jwt` and get our `secret` at the top of the script:


```js
const jwt = require('jsonwebtoken');
const { secret } = require('../config/environment');

function github(req, res, next) {
  .
  .
  .then((profile) => {
    return User
      .findOne({ email: profile.email })
      .then((user) => {
        if(!user) {
          user = new User({
            username: profile.login,
            email: profile.email,
            image: profile.avatar_url
          });
        }
        
        user.githubId = profile.id;
        return user.save();
      });
  })
  .then((user) => {
    const payload = { userId: user.id };
    jwt.sign(payload, secret, { expiresIn: '1hr' });
    
    res.json({ message: `Welcome ${user.username}!`, token });
  })
  .catch(next);
```

Boom! We're done! Log in now to check that all is working. You should be redirected to the profile page, and you should see you details on screen.

### The problem with email

Github will only give an email address if the user has made that information public. If not, the email address field will be blank. To deal with this, we need to make a few more changes. Firstly in our user model, we need to make the email field optional: 

```js
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, unique: true },
  password: { type: String },
  image: { type: String },
  githubId: { type: Number }
});
```

And in the controller, we need to search for a user _either_ by email, _or_ by their github id:

```js
function github(req, res, next) {
  .
  .
  .then((profile) => {
    return User
      .findOne({ $or: [{ githubId: profile.id }, { email: profile.email }] })
      .then((user) => {
        if(!user) {
          user = new User({
            username: profile.login,
            image: profile.avatar_url
          });
        }
        
        user.githubId = profile.id;
        if(profile.email) user.email = profile.email;
        return user.save();
      });
  })
  .then((user) => {
    const payload = { userId: user.id };
    jwt.sign(payload, secret, { expiresIn: '1hr' });
    
    res.json({ message: `Welcome ${user.username}!`, token });
  })
  .catch(next);
```

Now we're **_really_** done!


## Conclusion (5 mins)

This is an example of how to set up oAuth for Github. oAuth always works in the same way, but the specific requests differ from provider to provider. If you want to roll out oAuth for Facebook or Twitter for example, you'll need to dive into their documentation.