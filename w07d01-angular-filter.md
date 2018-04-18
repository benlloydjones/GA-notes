---
title: Angular Filter
type: lesson
duration: "1:25"
creator:
    name: Mike Hayden
    city: London
competencies: Programming, Front-end Frameworks
---

# Angular Filter

### Objectives
*After this lesson, students will be able to:*

- Use Angular's `filter` to modify data on the fly
- Use Angular's `$scope.$watch` method

### Preparation
*Before this lesson, students should already be able to:*

- Use Angular to display data on the page
- Use `ng-repeat` to loop through an array of items

## Intro (10 mins)

Angular has a very powerful, but often overlooked filter which can make modifying data very simple.

In this session we'll look at a few different ways of using it in an app.

In the starter code you will see a coffee app, which displays beans. The beans are rated by **roast** - the higher the number, the darker the bean; and by **strength**.

Each coffee bean also has a name, origin and price.

There is no router here or API, since we just want to focus on filtering the data on the page.

There is a `Coffee` model, in `factories/coffee.js` but it's a stub. It simply returns an array directly from the factory.

## Simple filters (15 mins)

First off let's look at what angular defines as a filter. It's not exactly what you'd expect. In angular terms a filter is used to modify data, so you can use it to change the case of some text for example.

Let's make the name of the coffee beans uppercase:

```html
<h2>{{ coffee.name | uppercase }}</h2>
```

That `|` character is a pipe. We are saying pipe the data on the left `coffee.name` into the `uppercase` filter, which makes the string uppercase.

>**Note:** This can also be done with CSS using `text-transform: uppercase;`

Angular has lots of these helpful filters, take a moment to have a look through the [documentation](https://docs.angularjs.org/api/ng/filter)

We can also chain filters together. Let's limit the length of the coffee bean name with the `limitTo` filter:

```html
<h2>{{ coffee.name | uppercase | limitTo: 10 }}</h2>
```

We've just passed an argument to a filter. The colon indicates an argument is coming. You can pass multiple arguments to a filter like so:

```html
{{ data | filterName: argument1: argument2 }}
```

OK, let's remove the `limitTo` filter, so we can see the full name of our beans.

While we're here let's add a filter to the price of our beans:

```html
<p>Price <strong>{{ coffee.price | currency }} / kg</strong></p>
```

Great, but by default currency is displayed as USD. Let's update it to Stirling:

```html
<p>Price <strong>{{ coffee.price | currency: '£' }} / kg</strong></p>
```

Great!

## The `filter` filter (10 mins)

Now on to filtering in the full sense of the word, we're going to use angular's built-in `filter` filter.

Let's use the search bar to reduce the number of items on display based on what the user has entered.

You'll notice that the input field is alreay hooked up to `coffeeIndex.q`. We can apply a filter directly to the `ng-repeat`:

```html
<div ng-repeat="coffee in coffeeIndex.all | filter: coffeeIndex.q">
  .
  .
  .
</div>
```

Now as we type in the search box the items are filtered _**as we type!**_ That's pretty amazing.

You'll notice that the search box is being used to match items based on _every property_. Try typing in "200", you should see just the Jamaican Blue Mountain Coffee, since it is priced at £200/kg.

It will even filter based on properties that are not on the page. Type in "India", and you should see just the "Monsoom Malbar Coffee". Pretty amazing huh!

Let's force our search string to only work on the name property of the beans:

```html
<div ng-repeat="coffee in coffeeIndex.all | filter: { name: coffeeIndex.q }">
  .
  .
  .
</div>
```

Nice!

## Filtering in the controller (15 mins)

Ok, let's push things a little further now, and move our filtering logic to the controller.

Rather than filtering the `all` array in the view, we'll filter the array in the controller and store the result into a new array called `filtered`:

```js
CoffeeIndexCtrl.$inject = ['Coffee', 'filterFilter'];
function CoffeeIndexCtrl(Coffee, filterFilter) {
  const vm = this;
  vm.all = Coffee.query();

  function filterCoffee() {
    vm.filtered = filterFilter(vm.all, vm.q);
  }

  filterCoffee();
}
```

We've injected the `filterFilter` module (as apposed to `uppercaseFilter` or `currencyFilter`) into our controller and created a `filterCoffee` function which filters `all` based on the seacrh term, and creates a new array called `filtered`.

Let's use it in the view:

```html
<div ng-repeat="coffee in coffeeIndex.filtered">
  .
  .
  .
</div>
```

Great, but nothing happens when we type in the search box. That's because we're only running the `filterCoffee` function once when the page loads. We need to run it when the `q` property updates.

## `$scope.$watch` (20 mins)

Angular has a neat way of doing things when properties of a controller change. We can use `$scope.$watch` to literally watch a property, and if it changes, run a function.

If we were using `$scope` already, we could do something as simple as `$scope.$watch('q', filterCoffee)`. However since we're using the `controllerAs` method, we need to be a little more creative:

```js
$scope.$watch(() => vm.q, filterCoffee);
```

Let's try our search bar again. **Don't forget to inject `$scope` into the controller.**

### Strength and Roast

Let's add a couple of sliders that we can use to select the values we want for `strength` and `roast`:

```html
<div class="pure-g filters">
  <div class="pure-u-1 pure-u-sm-1-2">
    <div class="l-box">
      <input type="checkbox" id="strength" ng-model="coffeeIndex.useStrength">
      <label for="strength">Strength</label>
      <input type="range" ng-model="coffeeIndex.strength" min="1" max="5" ng-disabled="!coffeeIndex.useStrength">
    </div>
  </div>
  <div class="pure-u-1 pure-u-sm-1-2">
    <div class="l-box">
      <input type="checkbox" id="roast" ng-model="coffeeIndex.useRoast">
      <label for="roast">Roast</label>
      <input type="range" ng-model="coffeeIndex.roast" min="1" max="5" ng-disabled="!coffeeIndex.useRoast">
    </div>
  </div>
</div>
```

We have to be careful here. We want our user to be able to toggle these sliders on and off. If the user wants to see **all** the coffee, both sliders need to be deactivated. There's a checkbox for each slider which is controlled with a checkbox.

The checkbox sets a boolean `useStrength` or `useRoast` on the controller, which in turn decided wether the slider is active using `ng-disabled`.

What we want to do is add the strength and roast properties to our filter, but only is the checkbox is checked.

Let's update our `filterCoffee` function:

```js
function filterCoffee() {
  const params = { name: vm.q };
  if(vm.useStrength) params.roast = vm.strength;
  if(vm.useRoast) params.roast = vm.roast;

  vm.filtered = filterFilter(vm.all, params);
}
```

Now the `q` property will only apply to `name` and `origin`, while the `strength` and `roast` will only be added to the filter parameters, if the relavent checkboxes are checked.

However, if we try it out, it doesn't work as expected. We are still only watching out for a change in the `q` property. Let's update the controller:

```js
$scope.$watch(() => vm.q, filterCoffee);
$scope.$watch(() => vm.useStrength, filterCoffee);
$scope.$watch(() => vm.useRoast, filterCoffee);
$scope.$watch(() => vm.strength, filterCoffee);
$scope.$watch(() => vm.roast, filterCoffee);
```

All good. But we can try this up with the `$watchGroup` method:

```js
$scope.$watchGroup([
  () => vm.q,
  () => vm.useStrength,
  () => vm.useRoast,
  () => vm.strength,
  () => vm.roast
], filterCoffee);
```

`$watchGroup` will watch an array of properties at the same time. Pretty sweet!


## Conclusion (5 mins)

There's quite a lot of stuff here, but there's more to be had from filters in Angular. Check out the [guide](https://docs.angularjs.org/guide/filter) which takes you through creating your own filters.

While it might be tempting to use filters in the view, remeber to keep as much logic in your controllers as possible. That will keep your views for displaying things and your controllers for controlling things. It will also make your code more testable.