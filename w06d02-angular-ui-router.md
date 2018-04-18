---
title: Front-end Routing with UI-Router
type: Lesson
duration: "1:25"
creator:
    name: Alex Chin, Micah Rich
    city: London, LA
competencies: Front-end MV*
---

# Front-end Routing with UI-Router

### Objectives

- Understand how front-end routing differs from server-side routing
- Build a SPA with multiple pages

### Preparation

- Build a basic Angular app
- Interact with an API
- Download the [starter code](starter-code)

## Intro (5 mins)

Routing, as you've seen in multiple frameworks and languages, is adding in the ability to render different pages in a application – but in a single-page app, how can we have multiple pages? In Angular, it comes down to storing all our views on our main page and turning them on and off as we need.

But what's the benefit? Why even make it single page? Why add that complexity? The main use case for front-end frameworks is added speed – by loading everything upfront, and just switching sections on and off, our page will seem wonderfully speedy because we'll be skipping quite a few steps that a more traditional framework has to run through.

Now, Angular comes with a basic routing mechanism, `ngRoute`, which you can read about [here](https://docs.angularjs.org/api/ngRoute/service/$route).

But today we're looking at a more advanced router: a third-party plugin called [`ui-router`](https://github.com/angular-ui/ui-router);

**Our ultimate goal is to build out an Infamous Criminals app, with different views for index, new, show and edit pages.**

Let's walk through it.

## Twelve Steps to `ui-router` - Codealong (40 mins)

> **Note**: Because of the nature of what we're building today - our URL will be telling our application what particular views to render - we can't use UI-Router with `file://`. This is because UI-Router loads files with `$http`.

Let's begin by setting up our starter-code.

```bash
$ yarn
```

#### Step One: `ui-router`

Next, we'll need the `ui-router` source. It's not an official Angular core library and it's not hosted on Google's site. However, we can install it using bower:

```bash
$ bower install angular-ui-router --save
```

This will be added to our compiled `public/js/app.js` file in public using our gulp task.

Now, we can start up the app:

```bash
$ gulp
```

#### Step Two: Adding a Dependency

Because we're adding a new library to our app, it'll be a module dependency. We'll need to make sure Angular knows about our library, so we can use it. If you haven't used any external libraries yet, rejoice in that we're finally going to put _something_ in those empty brackets in our `src/js/app.js`.

```javascript
angular
  .module('infamousCriminals', ['ui.router']);
```

`'ui.router'` just happens to be what the library is called in its source. Most libraries will tell you what to write here in their documentation and if you need more than one, just list them like any array.

#### Philosophically, what is routing?

A route, in general, is just the path you take to get somewhere. That's not specific to web development, but it's one of those words we've latched on because it's a good description – when you're changing URL, when that location bar changes, you're on a new route.

Our router just sets up which routes we want to exist and points our code where to make it happen.

This means our Angular app can simulate having multiple pages, which gives us the ability to make more complex applications... which is awesome!

Let's make some routes.

#### Step Three: Add Some Configuration

First, let's add a new configuration file:

```bash
$ mkdir src/js/config
$ touch src/js/config/router.js
```

Inside there, let's add:

```javascript
angular
  .module('infamousCriminals')
  .config(Router);
```

Of course, now we need a `Router()` function, so let's build one:

```javascript
Router.$inject = ["$stateProvider", "$urlRouterProvider"];
function Router($stateProvider, $urlRouterProvider) {
  // routes to be completed
}
```

The arguments in the function are necessary parts for our router to do its work, however, we're specifically injecting using the `$inject` syntax to ensure that the file will work after minification.

#### Step Four: Add Some Routes

When using Angular, we're not really changing locations (single-page apps, here), let's, instead of calling them _routes_, call them **states**. Same idea as routes but we're just trying to be more descriptive. We're changing the current _state_ of the app, as in a snapshot of the stuff we're looking at and working with, at a particular moment.

```javascript
function Router($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('criminalsIndex', {
      url: '/criminals',
      templateUrl: '/js/views/index.html'
    })
    .state('criminalsNew', {
      url: '/criminals/new',
      templateUrl: '/js/views/new.html'
    });
}
```

That weird `$stateProvider` argument comes from our `ui-router` library, and it allows us to add a state to our application.

We define a **name** for the state. This is important because it's how we can refer to it later.

We also define a **relative url** for each state to tell the browser how to simulate navigating different pages.

And finally, we add a **templateURL**, which is sort of a partial HTML file. We'll fill a partial with _just_ the code we'd need to change on the page, here.  Remember, it's just a part of a larger HTML page with parts that we can hide.

> **Note:** It is possible to directly add a template instead of a URL here. However, it's rarely used.

Now, before our route can work, we've got to create the view file and add some content.

```bash
$ mkdir src/js/views
$ touch src/js/views/index.html
$ touch src/js/views/new.html
```

> **Note:** Our gulp file has already been setup to copy these files over. If you want to _change_ where you put these files, you will need to change the gulp task.

#### Otherwise

Before we add some content to this partial, let's also add a catch-all to ensure that we route to the `criminalsIndex` state if no state is found:

```javascript
function Router($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('criminalsIndex', {
      url: '/criminals',
      templateUrl: '/js/views/index.html'
    })
    .state('criminalsNew', {
      url: '/criminals/new',
      templateUrl: '/js/views/new.html'
    });
    
  $urlRouterProvider.otherwise('/criminals');
}
```

#### Step Five: Building Partials

Go over to our `index.html`. What we want to do is to cut (`<cmd-x>`) the entire `<ul>` from the top of the `<section>`.

Now let's add this content inside our `src/js/views/index.html` file. We also need to take the entire `<form>` tag and copy it into `src/js/views/new.html`.

Now we've got two partials (`index.html` and `new.html`), and all we have left to do is tell our `index.html` where we want to put it.

In that `<section>`, on our `index.html`, we'll add a new directive: `ui-view`.

```html
<section ui-view></section>
```

If we go to `http://localhost:7000` we should be automatically directed to `/criminals` (because we set `.otherwise` to be `/criminals`. If you go to `/criminals/new`, we should see the form. Cool!.

#### Step Six: Removing the `/#`

You may have noticed that when we change states, our URL has a `#` in it. If we want to remove this we can add:

```js
Router.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider'];
function Router($stateProvider, $urlRouterProvider, $locationProvider) {
  $locationProvider.html5Mode(true);
  
  $stateProvider
    .state('criminalsIndex', {
      url: '/criminals',
      templateUrl: '/js/views/index.html'
    })
    .state('criminalsNew', {
      url: '/criminals/new',
      templateUrl: '/js/views/new.html'
    });
    
  $urlRouterProvider.otherwise('/criminals');
}
```

We also need to add a base tag to our `index.html`:

```html
<!DOCTYPE html>
<html ng-app="infamousCriminals">
<head>
  <base href="/">
  <meta charset="utf-8">
  <title>Infamous Criminals</title>
  <!-- inject:js -->
  <!-- endinject -->
  <!-- inject:css -->
  <!-- endinject -->
</head>
```

The `<base>` tag in HTML is a relatively little known element, having become a fully fledged part of HTML5 quite recently. It enables you to do two things: Set any URL you choose as the base for all relative URLs.

#### Step Seven: A Navbar!

In order to jump between one view and the other, we need _links_! But not normal links because we're not changing pages. Luckily, `ui.router` gives us a custom directive. Inside your `index.html`, underneath the `<h1>` - let's add a `<nav>` with a few `<a>`s

```html
<nav>
  <ul>
    <li>
      <a ui-sref="criminalsIndex">Index</a>
    </li>
    <li>
      <a ui-sref="criminalsNew">New</a>
    </li>
  </ul>
</nav>
```

That custom directive, `ui-sref` is like `href`, but referencing _states_ instead. That came with our library, and **the text we're putting in there is just the names of the states we defined**.

You already have a little SCSS in your `style.scss` to make it look nice, something like:

```css
a {
  text-decoration: none;
  padding: 10px 15px;
  background-color: rgba(255, 255, 255, 0.75);
  display: block;
  &.active {
    background-color: white;
  }
}
```

Here we are saying that if a link has a class of "active", the background color should be white, which means we get a nice 'tabbed' effect.

Check it out. Click through and jump from page to page. Super awesome, yeah?

#### Helpful Extra - Which state am I on?

`ui.router` actually gives us another really useful custom directive. Throw it on whichever links are using `ui-sref`:

```html
<nav>
  <ul>
    <li>
      <a ui-sref="criminalsIndex" ui-sref-active="active">Index</a>
    </li>
    <li>
      <a ui-sref="criminalsNew" ui-sref-active="active">New</a>
    </li>
  </ul>
</nav>
```

This is a really nice helper that will apply the class of "active" (or whatever you put in quotes) to the link that's currently active, depending on what state you're looking at.

And suddenly, your interface makes a ton more sense. Super helpful.

#### Step Eight: Seperate Controllers

Before we move on and add views and states for the show and edit page, it would be a good idea to make our code more modular. At the moment, our `CriminalsCtrl` is wrapped around our entire app, as we have added `ng-controller` to the `<body>` tag. This means that when the page loads, we instantiate the controller, and all of the functionality of our app is loaded.

This is fine, but ideally, if we load the `/criminals/new` page first, we don't need to be making a call to our API to get all of the criminals (like we do on the index page). We are going to seperate the code in our controller out into two controllers, and load them in specifically, when we load in each state (a `CriminalsIndexCtrl` and a `CriminalsNewCtrl`. Remove the `ng-controller` directive from the `<body>` tag.

```diff
- <body ng-controller="CriminalsIndexCtrl as criminals">
+ <body>
```

The first thing we are going to do is rename our exisiting `CriminalsCtrl` to `CriminalsIndexCtrl` in `src/js/controllers/criminals.js`.

```js
angular
  .module('infamousCriminals')
  .controller('CriminalsIndexCtrl', CriminalsIndexCtrl);

CriminalsIndexCtrl.$inject = ['$http'];
function CriminalsIndexCtrl($http) {
  const vm        = this;
  vm.all          = [];
  vm.newCriminal  = {};
  vm.create       = criminalsCreate;
  vm.index        = criminalsIndex;
  vm.delete       = criminalsDelete;

  criminalsIndex();

  function criminalsIndex() {
    $http
      .get('/api/criminals')
      .then(response => {
        vm.all = response.data;
      });
  }
  
  function criminalsCreate() {
    $http
      .post('/api/criminals', vm.newCriminal)
      .then(() => {
        vm.all.push(response.data);
        vm.newCriminal = {};
      });
  }

  function criminalsDelete(criminal) {
    $http
      .delete(`/api/criminals/${criminal.id}`)
      .then(() => {
        const index = vm.all.indexOf(criminal);
        vm.all.splice(index, 1);
      });
  }
}
```

Next, we are going to create a `CriminalsNewCtrl` and move the create functionality from the `CriminalsIndexCtrl` into it. First, attach it to the module at the top of the controller:

```js
angular
  .module('infamousCriminals')
  .controller('CriminalsIndexCtrl', CriminalsIndexCtrl)
  .controller('CriminalsNewCtrl', CriminalsNewCtrl);
```

Define it underneath the `CriminalsIndexCtrl`, add `const vm = this`, and then move `vm.newCriminal = {}` and `vm.create = criminalsCreate` into it, along with the `criminalsCreate` function.

```js
angular
  .module('infamousCriminals')
  .controller('CriminalsIndexCtrl', CriminalsIndexCtrl)
  .controller('CriminalsNewCtrl', CriminalsNewCtrl);

CriminalsIndexCtrl.$inject = ['$http'];
function CriminalsIndexCtrl($http) {
  const vm        = this;
  vm.all          = [];
  vm.index        = criminalsIndex;
  vm.delete       = criminalsDelete;

  criminalsIndex();

  function criminalsIndex() {
    $http
      .get('/api/criminals')
      .then(response => {
        vm.all = response.data;
      });
  }

  function criminalsDelete(criminal) {
    $http
      .delete(`/api/criminals/${criminal.id}`)
      .then(() => {
        const index = vm.all.indexOf(criminal);
        vm.all.splice(index, 1);
      });
  }
}

CriminalsNewCtrl.$inject = ['$http'];
function CriminalsNewCtrl($http) {
  const vm = this;
  vm.newCriminal  = {};
  vm.create       = criminalsCreate;

  function criminalsCreate() {
    $http
      .post('/api/criminals', vm.newCriminal)
      .then((response) => {
        vm.all.push(response.data);
        vm.newCriminal = {};
      });
  }
}
```

Nice. This is feeling much more 'Angular'. Instead of using the `ng-controller` directive inside each partial to instantiate the controllers, `ui-router` gives us a nice way of defining which controller we want to be available when we load a specific state. In `src/js/config/router.js` update your router to include `controller:` for each state.

```js
Router.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider'];
function Router($stateProvider, $urlRouterProvider, $locationProvider) {
  $locationProvider.html5Mode(true);

  $stateProvider
    .state('criminalsIndex', {
      url: '/criminals',
      templateUrl: '/js/views/index.html',
      controller: 'CriminalsIndexCtrl as criminalsIndex'
    })
    .state('criminalsNew', {
      url: '/criminals/new',
      templateUrl: '/js/views/new.html',
      controller: 'CriminalsNewCtrl as criminalsNew'
    });

  $urlRouterProvider.otherwise('/criminals');
}
```

Here are saying, when you load the `criminalsIndex` state, also load the `CriminalsIndexCtrl` as `criminalsIndex` (and same for new).

#### Step Nine: Updating the views

We are almost ready to test that the app is working, but first we need to update our partials. At the moment, inside `src/js/views/index.html` and `src/js/views/new.html` we are referring to the controller as `criminals`. We need to update these accordingly, so that in the `index.html` it is `criminalsIndex`, and in `new.html` it is `criminalsNew`.

Inside `src/js/views/index.html` udpate the `ng-repeat`, `ng-click` and the `ng-click` directives:

```html
<ul id="criminals">
  <li ng-repeat="criminal in criminalsIndex.all" data-id="{{criminal.id}}">
    <strong>{{criminal.name}}</strong> <em>{{criminal.location}}</em> <span class="status {{criminal.status | lowercase }}">{{criminal.status | uppercase}}</span>
    <button class="delete" ng-click="criminalsIndex.delete(criminal)">X</button>
  </li>
</ul>
```

Inside `src/js/views/new.html` udpate the `ng-submit` and the `ng-model` directives:

```html
<form id="newCriminal" ng-submit="criminalsNew.create()">
  <div>
    <label for="name">Name:</label>
    <input type="text" id="name" ng-model="criminalsNew.newCriminal.name" placeholder="Prof. Moriarty">
  </div>
  <div>
    <label for="location">Location:</label>
    <input type="text" id="location" ng-model="criminalsNew.newCriminal.location" placeholder="Reichenbach Falls, CH">
  </div>
  <div>
    <label for="status">Status:</label>
    <select id="status" ng-model="criminalsNew.newCriminal.status">
      <option value="" disabled>- - Please Select One - -</option>
      <option value="Alive">Alive</option>
      <option value="Dead">Dead</option>
      <option value="Unknown" selected>Unknown</option>
    </select>
  </div>
  <div>
    <input type="submit" value="Add Criminal">
  </div>
</form>
```

We're ready to test out our app! Make sure that you can still navigate to `/criminals` and `/criminals/new`, and check that you can delete a criminal.

Try and create a new criminal. In the Chrome console you will get an error which complains about not being able to push to `undefined`. If you look inside `criminalsCreate` function, you will see that once a criminal is created, we are trying to push it into `vm.all`, which we don't have access to.

Also, we don't even want to be pushing the new criminal into this array anymore. Instead, we want to be sending the user back to the `criminalsIndex` state instead, which will instantiate the `CriminalsIndexCtrl`, which will in turn call the `criminalsIndex()` function, which will make a call to our API and get all of the criminals (including the new one) and update the value of `vm.all`. Phew!

#### Step Ten: Using `$state`

In order to direct the user to a different state from the controller, we need to use a service called [`$state`](https://ui-router.github.io/ng1/docs/0.3.1/index.html#/api/ui.router.state.$state), which is coming from the UI Router library.

The `$state` object contains lots of information about the current state that you are looking at. However, it also contains a useful method called `.go()` that can be used to change states. First of all we need to add it to the array of things that we're injecting into our `CriminalsNewController`.Then, inside `criminalsNew`, update the `.then()` block to be:

```js
CriminalsNewCtrl.$inject = ['$http', '$state'];
function CriminalsNewCtrl($http, $state) {
  const vm = this;
  vm.newCriminal  = {};
  vm.create       = criminalsCreate;

  function criminalsCreate() {
    $http
      .post('/api/criminals', vm.newCriminal)
      .then(() => {
        $state.go('criminalsIndex');
      });
  }
}
```

This is nice!

#### Step Eleven: Using `$state.params`

What if we wanted to make a page for just one criminal. If we were following the REST conventions then we'd expect it to have a URL similar to `/criminals/:id`.

Let's make a new state:

```js
.state('criminalsShow', {
  url: '/criminals/:id',
  templateUrl: '/js/views/show.html',
  controller: 'CriminalsShowCtrl as criminalsShow'
})
```

Let's make a corresponding view file:

```sh
$ touch src/js/views/show.html
```

Inside `src/js/views/show.html` let's just add a header tag for now, so that we know if we make it to that page.

```html
<h2>Show</h2>
```

For now, let's just add an empty controller so that don't get an error when we load the show page. First attach the `CriminalsShowCtrl` to the Angular module.

```js
angular
  .module('infamousCriminals')
  .controller('CriminalsIndexCtrl', CriminalsIndexCtrl)
  .controller('CriminalsNewCtrl', CriminalsNewCtrl)
  .controller('CriminalsShowCtrl', CriminalsShowCtrl);
```

Now let's define the controller below the `CriminalsNewCtrl`:

```js
CriminalsShowCtrl.$inject = [];
function CriminalsShowCtrl() {
  const vm = this;
}
```

In Chrome, navigate to `http://localhost:7000/criminals/1`. Even though we don't have a criminal with an `id` of '1' in the database, we should still get routed to the `criminalsShow` state, as the URL matches the pattern of the URL in our router (`/criminals/:id`).

Luckily, `$state` object has the current params attached to it. Let's have a look at this `$state` thing. First we need to inject it into our controller, and let's add `$http` while we're here, and then console log the `$state` object.

```js
CriminalsShowCtrl.$inject = ['$http', '$state'];
function CriminalsShowCtrl($http, $state) {
  console.log($state);
}
```

Check your console, and open up the `$state` object. Inside here there are lots of methods, like the `.go()` method we used earlier. We've also got `params`, and if you open this up you should have: `{ id: 123 }`. Nice! We need a way to say which `id` we want to put into the params when we go to the show page, and we can do this using `ui-sref`. In the `index.html` page add a 'View' link.

```html
<a ui-sref="criminalsShow({ id: criminal.id })">View</a>
<button class="delete" ng-click="criminalsIndex.delete(criminal)">X</button>
```

Inside the brackets we pass an object, which says what we are calling our params, and what they should be. If you click on one of the 'View' links, you should be taken to the show page, and the params should populate in the URL.

Now, inside our controller, we can use those params to make a 'GET' request to our API, to get a simple criminal. Fill out the `CriminalsShowCtrl`:

```
CriminalsShowCtrl.$inject = ['$http', '$state'];
function CriminalsShowCtrl($http, $state) {
  const vm = this;
  vm.criminal = {};

  $http.get(`/api/criminals/${$state.params.id}`)
    .then((response) => {
      vm.criminal = response.data;
    });

}
```

Now, inside `src/js/views/show.html` we have access to the current criminal by using `criminalsShow.criminal`.

```html
<h2>{{ criminalsShow.criminal.name }}</h2>
<em>{{criminalsShow.criminal.location}}</em> <span class="status {{criminalsShow.criminal.status | lowercase }}">{{criminalsShow.criminal.status | uppercase}}</span>
```

#### Step Twelve: Editing a Criminal

The last state that we're going to add is `criminalsEdit`. In `src/js/config/router.js` add:

```js
.state('criminalsEdit', {
  url: '/criminals/:id/edit',
  templateUrl: '/js/views/edit.html',
  controller: 'CriminalsEditCtrl as criminalsEdit'
});
```

We also need to create a new view:

```bash
$ touch src/js/views/edit.html
```

Copy over the HTML from the `new.html`, and change the name of the controller from `criminalsNew` to `criminalsEdit` in the `ng-submit` and `ng-model` directives. Also change `newCriminal` to `criminal` in the `ng-model` directives:

```html
<form id="newCriminal" ng-submit="criminalsEdit.update()">
  <div>
    <label for="name">Name:</label>
    <input type="text" id="name" ng-model="criminalsEdit.criminal.name">
  </div>
  <div>
    <label for="location">Location:</label>
    <input type="text" id="location" ng-model="criminalsEdit.criminal.location">
  </div>
  <div>
    <label for="status">Status:</label>
    <select id="status" ng-model="criminalsEdit.criminal.status">
      <option value="" disabled>- - Please Select One - -</option>
      <option value="Alive">Alive</option>
      <option value="Dead">Dead</option>
      <option value="Unknown" selected>Unknown</option>
    </select>
  </div>
  <div>
    <input type="submit" value="Update Criminal">
  </div>
</form>
```

You might also want to update the value of the button to be "Update Criminal".

Let's think about what we want to happen in the our `CriminalsEditCtrl` before we create it. First we need to get the single criminal from the API (based on the `id` in the URL). Then we need to define a function which will run when we submit the form, which will make a `PUT` request to the API and send the updated criminal, and then direct the user back to the show page.

Underneath `CriminalsShowCtrl` add the following:

```js
CriminalsEditCtrl.$inject = ['$http', '$state'];
function CriminalsEditCtrl($http, $state) {
  const vm = this;
  vm.criminal = {};
  vm.update = updateCriminal;

  $http.get(`/api/criminals/${$state.params.id}`)
    .then((response) => {
      vm.criminal = response.data;
    });

  function updateCriminal() {
    $http.put(`/api/criminals/${$state.params.id}`, vm.criminal)
      .then((response) => {
        $state.go('criminalsShow', { id: response.data.id });
      });
  }
}
```

Finally, let's add a link that will take the user to the edit page from the show page. Inside `src/js/views/show.html` add:

```html
<a ui-sref="criminalsEdit({ id: criminalsShow.criminal.id })">Edit</a>
```

And that's it! A RESTful app in Angular, using `$http`. We are building complex apps now, and there are lots of moving parts, but by seperating our logic into seperate controllers, and instantiating them individually depending on the current state, we are keeping our code organised and easier to manage.