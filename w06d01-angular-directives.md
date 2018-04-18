---
title: Angular Directives
type: Lesson
duration: "1:25"
creator:
    name: Micah Rich
    city: LA
competencies: Front-end frameworks
---

# Angular Directives

### Objectives

- Use `ngRepeat` to iterate over data
- Use `ngIf` & `ngHide`/`ngShow` to hide & show elements
- Use form to build forms
- Research other Angular directives that are included in Angular's library

### Preparation

- Set up a basic Angular app
- Create a basic controller with hardcoded data

## What Are Directives? Intro (5 mins)

Directives are markers on a DOM node – think custom attributes on HTML tags – that tell Angular to attach extra behaviours to a node or even transform the node and possibly its children. Angular comes with a bunch of different directives for different behaviours and gives you the ability to create your own.

There are a few you'll be using all the time that we're gonna walk through together, today. There are also a few you've already used – `ngApp` and `ngController`. You added them onto HTML tags to tell your Angular app what module we were using and what controller we wanted to ask for data from. Those are two examples of specific behaviours so let's see a few more.

## What are we building? Demo (5 mins)

Our end goal for this lesson is to build ourselves a simple little todo app. Shocking, it's true, but it'll be a great way to demonstrate both directives and interacting with controllers.

We have a lot to get through – we'll have to list an array of todos, demonstrate some simple hiding & showing mechanisms, and bind some changing data via a form.

## Set up your app - Independent Practice (5 mins)

> Send over the starter-code.

Create a directory for your controllers (`src/js/controllers`) and create a `to-dos.js` in there.

```sh
$ mkdir src/js/controllers
$ touch src/js/controllers/to-dos.js
```

Now let's make an Angular module in `src/js/app.js`:

```js
angular
  .module('toDoApp', []);
```

Let's then link the `module` to the HTML:

```html
<!DOCTYPE html>
<html ng-app="toDoApp">
  <head>
    <meta charset="utf-8">
    <title>Angular Directives Lesson</title>
    <!-- inject:js -->
    <!-- endinject -->
    <!-- inject:css -->
    <!-- endinject -->
  </head>
  <body>
  </body>
</html>
```

## `ngRepeat` - Codealong (20 minutes)

Let's start filling in our `to-dos.js` a little bit - add in some initial seed data:

```js
angular
  .module('toDoApp')
  .controller('ToDosCtrl', ToDosCtrl);

ToDosCtrl.$inject = [];
function ToDosCtrl(){
  const vm   = this;

  vm.items   = [
    { task: 'washing', done: false },
    { task: 'cleaning', done: false },
    { task: 'homework', done: false },
    { task: 'sleep', done: false },
    { task: 'buy shoes', done: false }
  ];
}
```

This is great - we've got an array of simple objects.

Now, let's start filling out the view with this data; head over to `index.html`.

```html
<body>
  <header>
    <h1>Angular Todo App</h1>
    <h3>You have {{}} todos to do!</h3>
  </header>
</body>
```

Now, how do we get the data our controller has access to?

```html
<body ng-controller="ToDosCtrl as todos">
  <header>
    <h1>Angular ToDo App</h1>
    <h3>You have {{ todos.items.length }} todos to do!</h3>
  </header>
</body>
```

<img width="752" src="https://cloud.githubusercontent.com/assets/25366/9005855/8e7bee44-3736-11e5-9276-d930778b197a.png">

Beautiful! But we need more. How do we actually list out our todos? `ngRepeat`.

```html
<ul>
  <li ng-repeat="item in todos.items">
    {{ item.task }}
  </li>
</ul>
```

<img width="752" src="https://cloud.githubusercontent.com/assets/25366/9005933/1e6c49cc-3737-11e5-8f4d-3dd46a471c34.png">

Let's walk through that. First, hello `ngRepeat`! This is used for instantiating a template once per item from a collection. Rather than our old-fashioned `for` loop, Angular uses `ngRepeat` on the element we want to iterate over. Sort of like Ruby (or JavaScript's forEach), we say:

> "For each item in `todos.items`, call the one we're on `item`."

The first argument (`item`) in `ng-repeat="item in todos.items"` is a declaration of how we want to refer to an item in a collection (`todos.items`), which is the second argument.

> ***Note:*** `ngRepeat` maintains one-to-one mapping between collection items and DOM elements so we can keep track of the generated elements. However, because of this one-to-one functionality, `ngRepeat` does not allow for duplicate items in a collection since this will break the mapping.

## Adding a Todo - Codealong (15 mins)

Now, let's see how _data binding_ works by adding to our list! We'll need a form.

```html
<form id="addTodo" ng-submit="todos.addItem()">
  <input type="text" placeholder="What do you need to do?">
  <input type="submit" value="Add">
</form>
```

Super simple! However, this does nothing at the moment. We need it to add to our list when we hit enter and submit it.

**Q.** On the controller side, how would we write a function that adds a new item to our array?

Maybe something like:

```js
// This will add our new function as a property on our controller, so we can use it in the view
vm.addItem = addItem;

// this just adds a new object to our array, with defaults for now
function addItem() {
  vm.items.push({ task: 'Something to do', done: false });
}
```

By including the `vm.addItem = addItem;` line, we now can use that function in our view, when we want to. So check out this other useful form directive:

```html
<form id="addTodo" ng-submit="todos.addItem()">
  <input type="text" placeholder="What do you need to do?">
  <input type="submit" value="Add">
</form>
```

Now, it'll be adding fake todos, but I can't resist – try it! You'll see why Angular is so exciting. As soon as you press enter, **it auto-updates the list and the count** above, without any extra work. That's _data binding_, it's watching for changes to our data in the controller and updating the view _for_ us.

## `ngModel` - Codealong (15 mins)

Obviously we don't want to only use dummy data. How do we keep an eye on what's in the input and send _that_ to our `addItem` function? You guessed it, another directive!

But first, let's think of it like this: we're going to be adding a new todo to our list of existing todos and that todo will be an object just like our others. Something like:

```js
{ task: 'Something to do', done: false };
```

So maybe let's make a empty `newItem` object in our controller:

```js
vm.newItem = { task: '', done: false };
```

Now using the `ngModel` directive, we can share data between the controller and the view. In `index.html`:

```html
<form id="addTodo" ng-submit="todos.addItem()">
  <input type="text" placeholder="What do you need to do?" ng-model="todos.newItem.task">
  <input type="submit" value="Add">
</form>
```

What does `ngModel` do? It binds the data not just from the controller to the view like we saw earlier but the other way around, too. This is possible, because all `ngModel`s are part of Angular's context and are added to the `$watch` list. As we type in our input, the actual object of `newItem` changes, specifically the `task` attribute inside that object.

Don't believe me? Let's watch it happen.

```html
<form id="addTodo" ng-submit="todos.addItem()">
  <input type="text" placeholder="What do you need to do?" ng-model="todos.newItem.task">
  <input type="submit" value="Add">
</form>

<p>About to add: <strong>{{ todos.newItem.task }}</strong></p>
```

You can see, it keeps the data synced, nearly in realtime. As you are updating the model with each keystroke, the `$watch` list activates the `$digest` cycle because angular context has changed, and then, the `$digest` cycle performs a "dirty-check" updating any model in the UI that has been updated. That's _powerful._

The last step is update our `todos.addItem()` function to utilise this new knowledge. Just like in the view, how do you think we access that `newItem` in our controller?

```js
function addItem() {
  vm.items.push(vm.newItem);
  // this last piece isn't necessary, but nicely resets the task to an empty string, which will clear the textbox because the view is bound to the data
  vm.newItem = { task: '', done: false };
}
```

## `ngIf` Codealong (5 mins)

We're pretty much at capacity for now but there's one other awesome useful directives you might want to try.

As an example, let's say we think the paragraph that says "About to add todo: blah blah" only should show when `newItem` isn't empty. Normally, we'd use some sort of if/else statement...

```html
<form id="addTodo" ng-submit="todos.addItem()">
  <input type="text" placeholder="What do you need to do?" ng-model="todos.newItem.task">
  <input type="submit" value="Add">
</form>

<p ng-if="todos.newItem.task">About to add: <strong>{{ todos.newItem.task }}</strong></p>
```

`ngIf` removes or recreates a portion of the DOM tree based on an its value which is an expression. If it evaluates the expression (i.e. `todos.newItem.task`) to be `false`, it will remove the element from the DOM, otherwise a clone of the element is reinserted into the DOM.

> **Note:** Other directives, such as `ngHide`, can also be used to "hide" elements in the DOM, but the key difference is that `ngIf` actually removes the element where `ngHide` plays on the css property display.

## Conclusion (5 mins)

Now, in the next lab, you're going to practice this and hopefully, learn a few extra included directives along the way.

- How do we add a function to a controller?
- How do we iterate over an array of items?
- How do we submit a form?