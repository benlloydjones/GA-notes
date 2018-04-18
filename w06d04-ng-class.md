---
title: ngClass & Forms
type: lesson
duration: 1.25
creator:
    name: Alex Chin
    city: London
competencies: Front-end MV*
---

# `ngClass` & Forms

### Objectives
*After this lesson, students will be able to:*

- Use `ngClass` to update the UI
- Understand data-binding with `ngClass`
- Add/remove classes based on variables and expressions

### Preparation
*Before this lesson, students should already be able to:*

- Understand how to use Angular directives
- Understand how to create an Angular Controller
- Be able to scaffold a basic html app with Angular

## Intro to `ngClass` (5 mins)

So far, we've had a brief look at a number of Angular directives:

- `ng-app`
- `ng-controller`
- `ng-repeat`
- `ng-if`
- `ng-src`
- `ng-show`
- `ng-hide`

With these, we can display data onto our page fine but it won't look great. Let's see how we can make our pages look much better with the `ngClass` directive!

## What do we want to make? (10 mins)

Before we get started, let's take a look at what we want to create.

![angular-donuts](https://cloud.githubusercontent.com/assets/40461/9590520/0e2c19ac-502d-11e5-9df5-8b26429eb203.jpg)

As you can see, we have a couple of input boxes inside a form.

- One input to add the flavour of a donut
- One input to add the size of a donut
- A checkbox to "eat" a donut (a bit silly...)
- And a list of donuts

## NgClass Codealong (20 mins)

> Give out the starter-code.

The starter-code already has a gulp setup with Angular included using Bower. To setup you need to run run:

```bash
$ bower install && npm install
$ atom .
$ gulp
```

### Creating the Angular Module

Now inside our `app.js` we need to create a new Angular `module`:

```js
angular
  .module('donutApp', []);
```

Now let's make a new controller:

```bash
$ mkdir src/js/controllers
$ touch src/js/controllers/main.controller.js
```

Inside this new file (that will be included by Gulp), let's setup our controller:

```js
angular
  .module('donutApp')
  .controller('MainCtrl', MainCtrl);

MainCtrl.$inject = [];
function MainCtrl(){

}
```

Now let's add this module to our `index.html` file using the `ngApp` directive:

```html
<!DOCTYPE html>
<html ng-app="donutApp">
  <head>
    <meta charset="utf-8">
    <title>Angular ngClass with Forms</title>
    <!-- inject:js -->
    <!-- endinject -->
    <!-- inject:css -->
    <!-- endinject -->
  </head>
  <body>
  </body>
</html>
```

Now inside body, let's add a container for our controller:

```html
<body>
  <main ng-controller="MainCtrl as main">
    <h1>Angular Donuts</h1>
  </main>
</body>
```

### NgClass (String Syntax)

Inside our `main` element, we're going to add an form with a text input to which we're going to add an `ngModel` directive.

```html
<form>
  <label for="flavour">Flavour</label>
  <input type="text" id="flavour" name="flavour" placeholder="What is your donut flavour?" ng-model="main.donut.flavour">
</form>
```

Now we're going to add a new directive [`ngClass`](https://docs.angularjs.org/api/ng/directive/ngClass) that will "connect" with the `ngModel` directive with the same name.

```html
<h2 ng-class="main.donut.flavour">{{ main.donut.flavour }}</h2>
```

If you type the correct class name into the input, you should see that your class is applied automatically.

You can see the flavours in `style.css` file:

- `.chocolate`
- `.strawberry`
- `.apple`
- `.custard`

### `ngClass` (Array Syntax)

We can add multiple classes using multiple `ngModel`s. We just need to use slightly different syntax to apply the classes.

Let's try it out and add a new input box for the size of the donut that you want to add onto your list!

```html
<label for="size">Size</label>
<input type="text" id="size" name="size" placeholder="What size do you want?" ng-model="main.donut.size">
```

Now, we can add this class to the `h2` using the array syntax:

```html
<h2 ng-class="[main.donut.flavour, main.donut.size]">{{ main.donut.flavour }}</h2>
```

You can now change the size of your Donut!

We can also update our `h2` to output the size with:

```html
{{main.donut.flavour}} {{main.donut.size}}
```

### `ngClass` (Evaluated Expression)

The above examples are quite easy to understand, but when you start looking at real world use-cases - you might use another syntax. What is perhaps more likely is that you choose a class based on the evaluation of an expression.

When evaluating an expression, you need to use `{}` (single-bracket notation) so that Angular knows that it needs to work something out.

Now let's create a new checkbox:

```html
<label for="eaten">Eaten</label>
<input type="checkbox" id="eaten" name="eaten" ng-model="main.donut.eaten">
```

We can apply this conditionally like this:

```html
<h2 ng-class="[main.donut.flavour, main.donut.size, { eaten: main.donut.eaten }]">{{ main.donut.flavour }} {{ main.donut.size }}</h2>
```

**Note:** If the expression evaluates to an array, each element of the array should be a string that is one or more space-delimited class names. So < Angular 1.4 you will need to do something a little different.

Before we see the next way of applying a class, you'll need to add some code in your controller to be able to add some donuts to a list.

### Adding classes with `ngRepeat`

It might happen that we need to apply classes to items that we add onto our page using the `ngRepeat` directive.

In order to work out how we can do this, we are going have to look a bit closer at the documentation for [`ngRepeat`](https://docs.angularjs.org/api/ng/directive/ngRepeat).

The `ngRepeat` directive instantiates a template once per item from a collection. Each template instance gets its own scope.

In order to see this in action, we need to write some code that will allow us to link up the form with the controller so that we can actually add donuts to a list.

Inside `src/js/controllers/mainCtrl.js`:

```javascript
function MainCtrl(){
  const vm = this;

  vm.all   = [];
  vm.donut = {
    flavour: '',
    size: '',
    eaten: false
  };
  vm.add   = add;

  function add(){
    vm.all.push(vm.donut);
    vm.donut = {};
  }
}
```

**Note:** We're linking up the `ngModel` directive names with the controller.

Now, inside the `index.html` we need to display this array on the page:

```html
<ul id="donuts">
  <li ng-repeat="donut in main.all">
    {{donut.flavour}} {{donut.size}}
  </li>
</ul>
```  

And add an `ngSubmit` directive onto the form:

```html
<form ng-submit="main.add()">
```

And add an input button so that we can submit the form.

```html
<input type="submit" value="Add">
```

Now that we have our list rendering on the page, we can apply classes to our `ng-repeat` items.

#### Ternary Operator

To the `ng-repeat` add:

```html
<li ng-repeat="donut in main.all" ng-class="$even ? 'even' : 'odd'">
```

You can now see that we have applied a class to all of the even and odd `li` elements in our `ng-repeat`. We were able to do this because of the special property `$even` that we get from `ngRepeat`.

### `ngClass` as a Class

So far, we have seen the `ngClass` directive as a new attribute of an html element.

```html
<h2 ng-class="[main.donut.flavour, main.donut.size, { eaten: main.donut.eaten }]">Donut</h2>
```

You can also look at using `ng-class` directly into the normal html `class` attribute - but this is not used very often!

## Independent Practice (15 minutes)

> ***Note:*** _This can be a pair programming activity or done independently._

There are several other special properties of `ngRepeat` including:

- `$first`
- `$last`
- `$middle`
- `$index`

Have a look at styling these up with your own expressions.

Also, perhaps you can think of how to add the correct class to the list of donuts in the `<ul>`?

If you're still looking for things to do, think how you might ensure that the class works even if you use a capitalised word?

## Conclusion (5 mins)

- What is the relationship between `ng-model` and `ng-class`?
- What are some of the special properties of `ng-repeat`?
- What is the difference between using `ng-class` as an attribute or as a class?