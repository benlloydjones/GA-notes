---
title: Angular controllers and 2-way data-binding
type: Lesson
duration: "1:25"
creator:
    name: Alex Chin & Rane Gowan
    city: London
competencies: Front-end frameworks
---

# Angular controllers and 2-way data-binding

### Objectives

- Describe why learning Angular is important
- Set up an Angular app and test that it works
- Build a very basic controller with fake data
- Render basic controller data in the view
- Bind basic data with a controller variable
- Explain the differences and similarities between `$scope` and `controllerAs`

### Preparation

- Have a thorough understanding of JS
- Know how to build JS constructor functions

## What is AngularJS and why should you learn it? (20 mins)

Angular is an open source JS framework maintained by Google. It was created nearly 6 years ago, and its longevity is a testament to its capability and usefulness.  AngularJS is one of the most widely adopted MVC JS frameworks in use today and is a valuable skill to put on your resume.

AngularJS provides the following benefits when used to develop web apps:

- Enables us to organise and structure Single Page Apps using the popular MV* design pattern
- Makes us more productive when developing web apps because it provides features, such as data-binding, that requires less code from the developer
- Was designed with testing in mind

#### The Components of AngularJS

![angular_components](https://cloud.githubusercontent.com/assets/25366/8970275/a1ab2ee2-35fd-11e5-8b23-65f4159ff7d6.jpg)

#### Modules

Modules are containers for related code. The concept of *modules* is prevalent throughout programming, and here, we can consider it essentially a container for our app.

#### Config & Routes

Each AngularJS module has a `config` method that allows us to provide code that runs when a module is loaded.  The `config` method is used most commonly to setup routing.

#### Controller

Controllers in AngularJS serve two primary purposes:

- Initialise the data used for the view they are attached to
- Contain the primary code to respond to user events, such as when a user clicks on a button

A controller is a JS constructor function that is instantiated by the `ngController` directive.

#### Services & Factories

Services provide a way to organise related code and data that can be shared by controllers and even other services. Unlike controllers, which are instantiated and destroyed as the views they are attached to come into and out of view, services are created once (singletons) and persist for the life of the application.

Services should be used to hold the bulk of your application's logic and data, thus keeping controllers focused on what they are responsible for. Often, you can consider a service or factory something like a model or Ruby class.

#### Directives

Directives are "markers" in HTML - most commonly as attributes and custom element tags. When processed by AngularJS's HTML compiler, they attach behaviour to DOM elements or even transform them and/or their children.

#### Filters

Filters are used to transform data. They are very flexible and can be used for formatting text in a view, such as making it all uppercase, or used to filter and sort an array of items.

#### The AngularJS Mindset

Programming a web app with AngularJS requires a different mindset. To use AngularJS effectively, it helps to think of your application being driven by data (and AJAX calls) - you change data and the app responds. We naturally think more procedurally when coding, we attach an event handler and write code to respond.

Let's look at an example of the different approaches.  Say we want an edit form to show when a button is clicked:

- Procedurally, we would attach an event handler to the `<button>`. The handler code would select the element and set its display property to something besides "none".
- Using AngularJS, we declare a click handler on the `<button>` element.  The handler could set a variable named `editMode` equal to true, and the view would respond automatically.
- Remember, drive your application using data - your data model is the single source of truth!

### SPA Architecture

Single Page Applications (SPA) are all the rage today. A misconception is that a SPA has only a single view - this is far from the truth!  The single page aspect of a SPA refers to a single page coming from the server, such as our `index.html` page.  Once loaded, the SPA changes views by using _client-side_ routing, which loads partial HTML snippets called templates.

![spa_architecture](https://cloud.githubusercontent.com/assets/25366/8970635/896c4cce-35ff-11e5-96b2-ef7e62784764.png)

Client-side routing requires something known as a _router_.  A router in AngularJS, at a minimum, is used to define our routes, specify the template for that route, and specify which controller to attach to that view. You'll get to see routers in action in a later lesson.

## Angular Gulp Setup (20 mins)

> **Note:** Give our the `starter-code`.

The starter-code already has a `bower.json` file with `angular` as a dependency. To install run:

```sh
$ bower install && yarn install
```

Then open the app in Atom:

```sh
$ atom .
```

Finally, run:

```sh
$ gulp
```

Now, you can check angular has been loaded by writing `angular` in the chrome console, you should see this.

<img width="559" alt="screen shot 2016-09-20 at 12 35 52" src="https://cloud.githubusercontent.com/assets/40461/18668709/d4e4308a-7f2e-11e6-98ce-0b91bf162f1e.png">

## Basic Setup - Modules, Controllers, Views - Codealong (20 mins)

Like a few frameworks we've seen, there's not a fixed way to organise your application to make Angular work. So, we'll have to create our own but let's try to keep it consistent.

First, we need to set up an Angular `module`. Go into `src/js/app.js` file and add:

```js
angular
  .module('introToAngular', []);
```

The first argument is what we want to call our module, the second is an array of dependencies (we don't need any at the moment, so it is empty):

It's important to always include that array when **defining** a module even if there are no dependencies. This tells angular we're initialising (creating) a new module.

### Linking our `module` to our HTML

Now, back in our `src/index.html` add an `ng-app` directive in the `<html>` tag with a value of `introToAngular`.

```html
<!DOCTYPE html>
<html ng-app="introToAngular">
  <head>
    <meta charset="utf-8">
    <title>Angular Controllers 2-way binding</title>
    <!-- inject:js -->
    <!-- endinject -->
    <!-- inject:css -->
    <!-- endinject -->
  </head>
  <body>
  </body>
</html>
```

Since we defined the name in `app.js`, we just need to reference that name here.

Now, let's just check to make sure it worked. If it worked correctly, we should be able to put a simple Angular expression in our HTML and Angular will render it.

```html
<body>
  {{ 1 + 1 }}
</body>
```

If Angular's working, it'll add our numbers together and spit out a 2 on the page – that's how templating works in Angular, inside curly brackets. More specifically, Angular will evaluate any expression within `{{ }}` in the DOM.

> **Note:** You should't have to reload your page due to our `Browsersync` in our Gulp setup. If it doesn't work, always check your browser's console for errors!

## A Very Basic Controller - Codealong (15 mins)

So, in Angular's flavour of MV*, controllers are intended to primarily:

1. Respond to user actions.
2. Provide data to the view (occasionally referred to as the view-model).

We can create controllers in separate files, however for this example let's first define a controller in the `src/js/app.js` which is also acceptable.

```javascript
angular
  .module('introToAngular', []);

angular
  .module('introToAngular')
  .controller('HomeCtrl', HomeCtrl);

function HomeCtrl() {

}
```

When only the name of the module is passed in without the second argument of an array, the 'module' method returns the previously defined module and therefore links our new controller to the same module.

You define a `controller` in much the same way that you define a `module`. However, the second argument when you define a controller is a function. This can be anonymous but it's better to name it. (As this function acts as a constructor function, we normally capitalise it).

You can also chain this definition of the controller onto the original definition of the Angular module if you are using just one file:

```javascript
angular
  .module('introToAngular', [])
  .controller('HomeCtrl', HomeCtrl);

function HomeCtrl() {

}
```

### `$scope`

Now, there are two acceptable syntax for working with controllers in Angular. They are commonly referred to as the:

- `$scope` syntax
- `controllerAs` syntax

Both are a way to craft a constructor function for each controller you decide to make of this type. Angular started by using `$scope` (a context reference) and the `controllerAs` syntax was developed later.

First, let's have a play with the `$scope` definition:

```javascript
angular
  .module('introToAngular', [])
  .controller('HomeCtrl', HomeCtrl);

function HomeCtrl($scope){
  $scope.awesome = true;
}
```

### `$inject`

Due to the fact that we are using `gulp` to minifying our code, we need to use something called `$inject` to prevent errors.

> **Note:** When code is minified, the variable names and function parameters are often renamed to be shorter. Unfortunately, Angular's dependency injection breaks if you rename the controller's parameters because it doesn't know what you want to inject. Therefore, you need to save a placeholder (a string) of what the origin name of the injected dependency was.

```javascript
angular
  .module('introToAngular', [])
  .controller('HomeCtrl', HomeCtrl);

HomeCtrl.$inject = ['$scope'];
function HomeCtrl($scope){
  $scope.awesome = true;
}
```

### Let's add this controller into our HTML

On the `<body>` tag, we can now link our controller to our HTML file using the Angular directive `ng-controller`.

```html
<body ng-controller="HomeCtrl">
  {{ 1 + 1 }}
```

We can then display the `$scope` value from the controller like this:

```html
<body ng-controller="HomeCtrl">
  {{ awesome }}
```

> **Note:** You should see the value `true` on the page. You shouldn't have to reload because our tooling uses `browserSync`! Pretty cool!

That's awesome – that means we're working with data that's coming from our controller!

#### But how does it work?

With Javascript in play, our browser is naturally event-driven. For example, when you have an `onClick` event listener placed on a button, you also have an event handler that can update the DOM in some way. The 'magic' behind Angular, the way that it seemingly knows to update the DOM when need be, is due to the fact that it extends the traditional js event-loop by extending it with angular context.

Every time you use Angular to bind something in the UI, whether it be via handlebars or any `ngDirective`, you are telling your related Angular module that they are extensions of your angular context and to watch them for changes by adding them to the `$watch` list. This event loop is known as the `$digest` cycle and whenever there is a change in Angular context (`$scope`), Angular will go through _ALL_ of its context and update any model(s) with a value that has been updated, a concept known as "dirty-checking."

### `controllerAs`

However, as the industry started using Angular, more and more in production, people started realising that despite the name, `$scope` wasn't scoped very well. Primarily, as developers started to have nested controllers in their DOM, context wasn't properly being handled.

So developers moved on to binding this data a little differently - called the `controllerAs` syntax.

We can remove the injected `$scope` from the controller and use `this` instead!

```javascript
angular
  .module('introToAngular', [])
  .controller('HomeCtrl', HomeCtrl);

HomeCtrl.$inject = [];
function HomeCtrl(){
  this.awesome = true;
}
```

### Update our HTML

You will notice that `true` has now disappeared from our `index.html` in the browser. We need to change `ngController` directive to use the `controllerAs` syntax:

```html
<body ng-controller="HomeCtrl as home">
  {{ home.awesome }}
```

> Note: Keep in mind, while `HomeCtrl` is so named because that's what we called it in the file, the `home` in this example is just a variable we're choosing on the spot. Pick something obvious that makes sense but it can be anything.

The nice thing is that they're not very different, but that the latter looks far more like a normal constructor function you're used to and most importantly, a controller always has the correct context.

### `vm`

Often it's necessary to namespace the value of `this` inside a controller. This is because the value of `this` sometimes changes.

There are several different conventions for name-spacing `this`, examples include: `controller`, `self` and `vm`.

We're going to use `vm` as the convention because `vm` reminds us that we're talking about the `ViewModel`.

```js
angular
  .module('introToAngular', [])
  .controller('HomeCtrl', HomeCtrl);

HomeCtrl.$inject = [];
function HomeCtrl(){
  const vm = this;
  vm.awesome = true;
}
```

> [Further Reading](https://johnpapa.net/angularjss-controller-as-and-the-vm-variable/)

## Independent Practice - Adding data to your Controller (5 minutes)

Take five minutes and add some data into your `HomeCtrl`. Any sort of data will do so just come up with a few different data types to play with.

Then work together to take the random data you put into your controllers and display them in the view.

After that, perhaps experiment with making a new controller from scratch and showing that in the view, too.

That should give you a little practice with the whole setup.

## Conclusion (5 mins)
- How do we define a new module when starting an application?
- When you create an example controller from scratch, what type of JS function is this?
- How do we render data in the view? What does the templating look like in Angular?