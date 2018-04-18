---
title: NgResource
type: lesson
duration: 1.25
creator:
    name: Alex Chin
    city: London
competencies: Front-end MV*
---

# NgResource

### Objectives
*After this lesson, students will be able to:*

- Understand how to include the `ngResource` script
- Inject the `ngResource` module and `$resource` service
- Use `$resource` to DRY up `$http` requests

### Preparation
*Before this lesson, students should already be able to:*

- Create http requests with `$http`
- Should have a solid understanding of REST
- Must be able to build a RESTful API in Express

## Improving `$http` with `$resource` (10 mins)

As we've seen before, when we interact with a RESTful API, we often have to do similar CRUD actions. We've had a look at making `GET`, `POST`, `DELETE` and `PUT` requests using Angular's built in [`$http`](https://docs.angularjs.org/api/ng/service/$http) service.

However, built on top of `$http` there is another useful library called [`ngResource`](https://docs.angularjs.org/api/ngResource) that we can use to simplify our code!

**Note:** By definition, API's are not _meant_ to be RESTFUL however lots of them are because they work with a RESTFUL framework like Rails. Often if the API is _not_ RESTFUL, some people use `$http`.

#### What does `$resource` do?

Essentially, `ngResource` (used as `$resource`) allows you to write code in more of an ORM-style à la ActiveRecord or Mongoose. We'll get to how it does this later, for the moment just be happy!

## May the `$resource` be with you (15 mins)

So let's see how this `$resource` factory works in the wild!

In the starter code, there is an API with RESTful endpoints for the resource of Character. There is also a `src` directory. We're going to refactor this code now to use `$resource`.

### Initial setup

In order to setup the API, we first need to install the project dependencies with:

```bash
$ bower i && yarn install
```

We also need to populate the database with:

```bash
$ node db/seeds.js
```

We're doing this so that we can seed some data into our database. You can check that it is working by running the app with:

```bash
$ gulp
```

Then visiting `http://localhost:4000/api/characters`. You should see some Star Wars characters with their lightsaber colors output as JSON.

## Being `$resource`ful (35 mins)

So let's take a look at the structure of our starter-code.

We've got a basic Angular template with a module, some controllers and some boilerplate HTML code. I'm pretty sure we're all familiar with that now?

If we have a look at the `src/js/controllers/characters-index.controller.js`, you can see that the app is using `$http`:

```js
function charactersIndex(){
  return $http
    .get(`${API}/characters`)
    .then(response => {
      vm.characters = response.data;
    }, onError);
}
```

Let's refactor this:

#### Including the `ngResource` script

As `ngResource` library is not part of the core Angular library, so we _do_ need to require it from an external source. Let's install it using Bower:

```bash
$ bower install angular-resource --save
```

Double check your `bower.json` and you should see:

```json
"dependencies": {
  "angular": "^1.5.8",
  "angular-ui-router": "^0.3.2",
  "bootstrap": "^3.3.7",
  "angular-resource": "^1.5.9"
},
```

#### Inject the `ngResource` Module

The next step is to inject the `NgResource` module, as a dependency of our Angular app. We do this in the `src/js/app.js` file.

To do this, we just add the name of the module we're adding (`ngResource`) into the array of injected dependencies.

```js
angular
  .module('lightsaberApp', [
    'ui.router',
    'ngResource'
  ]);
```

Injecting `ngResource` will make the Angular service inside it, called `$resource`, available throughout our app.

#### Inject the `$resource` Service

We're going to use the `$resource` service in our controllers. First, we're going to inject it into our `CharactersIndexCtrl`.
In order to inject this "properly", so that minification will not break our app, we should remember to use the `$inject` syntax too.

```javascript
CharactersIndexCtrl.$inject = ['API', '$http', '$resource'];
function CharactersIndexCtrl(API, $http, $resource){
  //
}
```

#### `$resource` returns an Class?

Now we're ready to start using the `$resource` service. The way that we use this is to invoke it with some special arguments and save what is returned to a variable.

We save a capitalized variable, because it acts a bit like a constructor function that has methods we can call on it.

A resource "class" object comes with these methods:

```js
const Character = $resource(`${API}/characters/:id`,
  { id: '@id' },
  {
    'get': { method: 'GET' },
    'save': { method: 'POST' },
    'remove': { method: 'DELETE' },
    'delete': { method: 'DELETE' },
    'query': { method: 'GET', isArray: true }
  }
);
```

All of these methods are actually "built-in" so we can comment them out if we want:

```js
const Character = $resource(`${API}/characters/:id`,
  { id: '@id' }
  // {
  //   'get': { method: 'GET' },
  //   'save': { method: 'POST' },
  //   'remove': { method: 'DELETE' },
  //   'delete': { method: 'DELETE' },
  //   'query': { method: 'GET', isArray: true }
  // }
);
```

> **Note:** Remove only exists as well as delete because the Delete HTTP method may not work in IE.

What are these parameters though?

```javascript
http://localhost:4000/characters/:id
```

This is the URL that we want to call. **Notice** the `:id` named parameter! It seems like this would be a problem when issuing REST requests such as `GET /characters`, however, if a value is not provided for `:id` `$resource` returns an empty string.

```javascript
{ id: '@id' }
```

The second parameter is an object that contains default parameters. What does that weird `'@id'` do? Well, the `@` tells `$resource` to get the value from the current instance of the resource we are looking at.

#### INDEX with `.query()`

Let's fetch the index of our RESFUL resource by making a call using the `query` method.

At the moment, we have:

```js
charactersIndex()
function charactersIndex(){
  return $http
    .get(`${API}/characters`)
    .then(response => {
      vm.characters = response.data;
    }, onError);
}
```

We can now adapt this to read:

```js
vm.characters = Character.query();
```

This will work despite the fact that we are contacting a server for data, which we know to be an asynchronous operation... We don't need a callback because `$resource` did us **big favor** by immediately returning an empty object (array when we use the `query()` method to return all resources), then when the async request has returned (promise resolved), `$resource` will populate the variable with the data returned and the view will automatically update!

However, when our require expects further manipulation of the data we can do the assignment in the callback:

```js
Character.query(data => {
  vm.characters = data.characters;
})
```

There are a few things that are happening here for us!

1. `$ngResource` is already grabbing the `response.data`
2. We've shortened our code!

### isArray: false

> **Note:** For this app, this section is not necessary. However, you might find that you come across this problem in the future.

Our code should work! However, depending on the format that an API returns JSON data, you may see an error like this:

<img width="1053" alt="screen shot 2016-09-23 at 11 47 41" src="https://cloud.githubusercontent.com/assets/40461/18783430/a045f53c-8183-11e6-9b46-b938d162ae05.png">

**Error in resource configuration for action `query`**

This is caused by the default setup of `$resource`. The query method expects to receive an array (which we are providing). However, if it receives a JSON object from our API then you will need to change the default `isArray` option on the query method to be `false`:

```js
const Character = $resource(`${API}/characters/:id`,
  { id: '@id' },
  {
    // 'get':    { method: 'GET' },
    // 'save':   { method: 'POST' },
    // 'remove': { method: 'DELETE' },
    // 'delete': { method: 'DELETE' },
    'query':    { method:'GET', isArray: false },
  }
);
```

#### SHOW with `get()`

Next, if we want to get one specific item (SHOW) we need to use the `get` action.

Let's convert:

```javascript
function charactersShow(){
  return $http
    .get(`${API}/characters/${$stateParams.id}`)
    .then(response => {
      vm.character = response.data;
    }, onError);
}
```

To use `ngResource` and the `.get` method:

```js
CharactersShowCtrl.$inject = ['API', '$http', '$stateParams', $resource];
function CharactersShowCtrl(API, $http, $stateParams, $resource){
  const vm     = this;
  const Character = $resource(`${API}/characters/:id`,
    { id: '@id' });

  vm.character = Character.get($stateParams);
}
```

> **Note:** We can use `Character.get($stateParams);` or `Character.get({ id: $stateParams.id });`

Remember to `$inject` the `$resource` service.

> **Note:** It's quite __annoying__ that we have to duplicate the code that creates a Character `$resource`... It might be nice if we could DRY that up and put it in another file? We're going to move onto doing this later.

## Making a custom route

Due to the fact that update RESTful endpoints have several different ways in which they can be executed, e.g. using`PUT`, `PATCH` and `POST`. The decision has been made that `$resource` should be made in the most generic way possible and **NOT INCLUDE** an update method. [StackOverflow](https://github.com/angular/angular.js/issues/9807)

Therefore, in the `src/js/controllers/characters-edit.controller.js` we need to adapt our `$resource` when we include it!

```js
const Character = $resource(`${API}/characters/:id`,
  { id: '@id' },
  {
    'update': { method: 'PUT' }
  }
);
```

We can actually specify the URL here too. However, the default is that `$resource` will use `${API}/characters/:id` so this will work!

## Independent Practice (20 minutes)

Now it's your turn. Using the documentation for [NgResource](https://docs.angularjs.org/api/ngResource/service/$resource), you now need to complete the rest of the refactoring.

The two files that need refactoring:

- `characters-new.controller.js`
- `characters-edit.controller.js`
- `characters-index.controller.js` (Delete)

Afterwards, the `CharactersEditCtrl` file should look like this:

```js
angular
  .module('lightsaberApp')
  .controller('CharactersEditCtrl', CharactersEditCtrl);

CharactersEditCtrl.$inject = ['API', '$http', '$stateParams', '$state', '$resource'];
function CharactersEditCtrl(API, $http, $stateParams, $state, $resource){
  const vm     = this;

  const Character = $resource(`${API}/characters/:id`,
    { id: '@id' },
    {
      'update': { method: 'PUT' }
    }
  );

  vm.character = Character.get($stateParams);
  vm.update    = charactersUpdate;

  function charactersUpdate(){
    Character
      .update({ id: $stateParams.id }, vm.character)
      .$promise
      .then(() => {
        $state.go('charactersIndex');
      });
  }
}
```

You can either use the callback syntax or the promise syntax.

## Conclusion (5 mins)

- How do you include `NgResource` in your App?
- What two syntaxes can you use to save an item with `$resource`
- Why does `query()` have no callback?