# Angular vs Service vs Provider

- [StackOverflow](http://stackoverflow.com/questions/15666048/angularjs-service-vs-provider-vs-factory)
- [An example with $scope](http://tylermcginnis.com/angularjs-factory-vs-service-vs-provider/)
- [They are all the same?](http://www.simplygoodcode.com/2015/11/the-difference-between-service-provider-and-factory-in-angularjs/)
- [Quite Practical examples](http://www.learn-angular.org/#!/lessons/handling-complexity)
- [Config blocks](http://www.bennadel.com/blog/2788-creating-a-factory-provider-for-the-configuration-phase-in-angularjs.htm)

When you start writing Angular, after a while you will realise that your controllers are becoming cluttered with unnecessary logic.

Controllers are **meant to be skinny**.

In addition to this, controllers are not meant to have any persistent data inside them. Controllers are instantiated by Angular only when they are needed and then discarded when they are not. Therefore, when you switch or reload a page, Angular cleans up the current controller - resetting it back to its default state.

However, Services provide a means for keeping data for the lifetime of an application while they also can be used in a consistent manner.

## Types of Services

There are 5 ways (recipes) to create a new service in Angular:

1. **Factory**
2. **Service**
3. **Provider**
4. Value
5. Constant

However, in truth... They are all the same, **they are all providers**.

The factory, service, value and constant are just syntactic sugar on the top of a provider - but you can accomplish everything using just a provider.

#### Think about it this way...

This is a bit confusing but perhaps it's easier to think about it similar to making an `XMLHttpRequest`. Look at these three examples, the first is the most inflexible, but the shortest to write. They all however doing the same thing.

```javascript
// Shortest
$.get('http://localhost:3000', function(data) {
  console.log(data);
});

// Shorter
$.ajax({
  method: "get",
  url: 'http://localhost:3000'
}).done(function(data){
  console.log(data);
})

// Verbose
var request = new XMLHttpRequest();
request.open('GET', 'http://localhost:3000', true);

request.onload = function() {
  if (request.status >= 200 && request.status < 400) {
    var data = JSON.parse(request.responseText);
    console.log(data)
  }
};

request.send();
```

## When to use each:

| Type | Usage |
|---|---|
| **value** | You are providing a simple literal value.
| **constant** | You need to be able access that value during the configuration phase. (using `.config()`)
| **factory** | The value you are providing needs to be calculated based on other data.
| **service** | You are returning an object with methods. (You can't pass arguments to the service).
| **provider** | You want to be able to configure, during the `config` phase, the object that is going to be created before it’s created.

Here is an image explaining how a provider can be broken down into a factory, service, value and constant:

> **Note:** Where `mod` is the `angular.module('name')`:

![angularjs-provider-service-factory-highlight](https://cloud.githubusercontent.com/assets/40461/11506131/b9544ede-9845-11e5-8dfb-ca42e660f81b.png)

## Configuration & Run blocks

You might want to change the core service behaviours in your application, like adding HTTP interceptor in order to affect `$http` and track HTTP activity.

You would do this in a `config` block.

```javascript
angular.module('myModule', [])
.config(function(injectables) { // provider-injector
  // This is an example of config block.
  // You can have as many of these as you want.
  // You can only inject Providers (not instances)
  // into config blocks.
})
.run(function(injectables) { // instance-injector
  // This is an example of a run block.
  // You can have as many of these as you want.
  // You can only inject instances (not Providers)
  // into run blocks
});
```

**Configuration blocks** - get executed during the provider registrations and configuration phase. Only providers and constants can be injected into configuration blocks. This is to prevent accidental instantiation of services before they have been fully configured.

**Run blocks** - get executed after the injector is created and are used to kickstart the application. Only instances and constants can be injected into run blocks. This is to prevent further system configuration during application run time.