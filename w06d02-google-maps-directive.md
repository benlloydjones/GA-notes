---
title: Advanced Custom Directives
type: lesson
duration: "1:25"
creator:
    name: Mike Hayden
    city: London
competencies: Programming, MV* Frameworks
---

# Advanced Custom Directives

### Objectives
*After this lesson, students will be able to:*

- Create a more advanced custom directive
- Understand how to create small independent modules that can be used in multiple applications

### Preparation
*Before this lesson, students should already be able to:*

- Create a simple custom directive
- Bulld a basic Angular app

## Intro (5 mins)

When we use Angular with other 3rd-party JavaScript modules, it's important that we integrate them correctly. If we want to create a Google Map in an Angular project, especially if we are using `ui-router` we need to ensure that we create a directive to manage the creation and destruction of the map. If we don't our app will start to leak memory and become sluggish.

In this session we'll look at creating a Google Maps directive from scratch.

## Setup (10 mins)

Take a look at the starter code. Nothing too exciting going on here just yet. There's an empty Angular app set up for you and linked to the `index.html`.

Before we start we need to create a Google Maps API key, so we can add Google Maps to our app.

- Navigate to the [Google API Console](https://console.developers.google.com)
- Click on the **Credentials** tab, and create an API Key
- Copy the API key to your clipboard
- Click on the **Library** tab and select **Google Maps JavaScript API**
- **Enable the API** by clicking on the play icon at the top of the screen.
- Add the following script to your `index.html` replacing `YOUR_API_KEY` with the API key you just created, just below the `<title>` tag:

```html
<script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY"></script>
```

To check everything is working correctly run `gulp` and in the Chrome console type `google` you should see something like this:

```
Object { maps: function }
```

## Creating the directive (10 mins)

OK, we're ready to make a start. Create a folder called `directives` inside `src/js` and add a file called `googleMap.js`.

We can now hook this into our Angular app:

```js
angular
  .module('gMapFun')
  .directive('googleMap', googleMap);

function googleMap() {

}
```

With this directive we are going to make an element `<google-map>` which is going to be **replaced** with a simple `div` with the class of `google-map`.

Since the HTML for the directive is so simple, instead of using a separate file, we'll add the HTML string directly into the directive:

```js
angular
  .module('gMapFun')
  .directive('googleMap', googleMap);

function googleMap() {
  return {
    restrict: 'E',
    replace: true,
    template: '<div class="google-map">GOOGLE MAP GOES HERE</div>'
  }
}
```

> **Note:** Notice we're using `template` here and not `templateUrl`, since the HTML is not being stored in a different file.

We've added **GOOGLE MAP GOES HERE** to the HTML string, just so we can make sure everything is hooked up correctly.

### Directive Naming Conventions

An important thing to note here is that when we create a directive, we use **camel case in the js file** but **dashes in the HTML**.

For example this directive is called `googleMap` but when we use our directive in our HTML the tag that corresponds to it will be `<google-map>`.

OK, let's add the directive to the `index.html`:

```html
<body>
  <google-map></google-map>
</body>
```

Navigate to `http://localhost:7000`, you should see **GOOGLE MAP GOES HERE** on the screen.

Great! Now let's make a map!

## Adding Google Maps (10 mins)

We now have a `div` on the page with the class of `google-map`. We need to style the `div` so that it has height. If not, the map will not display. Inside your `style.scss` file let's give our `div` some dimentions:

```scss
.google-map {
  height: 300px;
  width: 300px;
  display: inline-block;
}
```

### `link`ing the directive

We need a way to access our `div` from the directive. To do that we'll use a new  property of the directive `link`. `link` expects a callback function, and passes the `scope` and the `element` (our `div`) as arguments.

Firstly let's just log the `element` to see what we have:

```js
angular
  .module('gMapFun')
  .directive('googleMap', googleMap);

function googleMap() {
  return {
    restrict: 'E',
    replace: true,
    template: '<div class="google-map">GOOGLE MAP GOES HERE</div>',
    link(scope, element) {
      console.log(element);
    }
  }
}
```

Check your console. You should see:

```
[div.google-map.ng-isolate-scope]
```

Interestingly Angular actually uses a stripped down version of jQuery, called jqLite. As you can see our `div` is actually inside an array. In order to access the DOM element, we need to get it out of the array first:

```js
angular
  .module('gMapFun')
  .directive('googleMap', googleMap);

function googleMap() {
  return {
    restrict: 'E',
    replace: true,
    template: '<div class="google-map">GOOGLE MAP GOES HERE</div>',
    link(scope, element) {
      console.log(element[0]);
    }
  }
}
```

Have another look at the console. You sould now see this:

```html
<div class="google-map ng-isolate-scope"></div>
```

Ok, great we can now use that to make our map.

## `window` vs `$window` (10 mins)

The syntax for creating a google map is as follows:

```js
new google.maps.Map(DOMElement, options)
```

Since the `google` object is global, is actually on the `window` object, so really what we're doing is:

```js
new window.google.maps.Map(DOMElement, options)
```

So what? Well according to Angular documentation we shouldn't use `window`, but instead inject the `$window` module. I have no idea why, but if the Angular docs say we should do it, then it's probably best we do!

Let's injet the `$window` module, and create our map already!

```js
angular
  .module('gMapFun')
  .directive('googleMap', googleMap);

googleMap.$inject = ['$window'];
function googleMap($window) {
  return {
    restrict: 'E',
    replace: true,
    template: '<div class="google-map"></div>',
    link(scope, element) {
      new $window.google.maps.Map(element[0], {
        zoom: 14,
        center: { lat: 51.5, lng: -0.07 }
      });
    }
  }
}
```

You should now have a google map on your screen! What's more, you can create as many google maps as you like:

```html
<body>
  <google-map></google-map>
  <google-map></google-map>
  <google-map></google-map>
</body>
```

All the maps!

## Making it more re-usable (10 mins)

That's great and all, but all of the maps are centered on the same place, because the center point is hard-coded into the directive. Let's use the `scope` so that we can add the center point dynamically:

```js
angular
  .module('gMapFun')
  .directive('googleMap', googleMap);

googleMap.$inject = ['$window'];
function googleMap($window) {
  return {
    restrict: 'E',
    replace: true,
    template: '<div class="google-map"></div>',
    scope: {
      center: '='
    },
    link(scope, element) {
      new $window.google.maps.Map(element[0], {
        zoom: 14,
        center: scope.center
      });
    }
  }
}
```

Now we can update the HTML like so:

```html
<body>
  <google-map center="{ lat: 52.1, lng: -0.085 }"></google-map>
  <google-map center="{ lat: 51.15, lng: -0.075 }"></google-map>
  <google-map center="{ lat: 51.55, lng: -0.06 }"></google-map>
</body>
```

Now we have 3 independent, re-usable Google Map directives!

## Independent practise (20 mins)

Using the [Google Maps documentation](https://developers.google.com/maps/documentation/javascript/reference) add a marker to the center of each map.

You might also want to add an [Infowindow](https://developers.google.com/maps/documentation/javascript/examples/infowindow-simple). How would you set the content of the Infowindow using `scope`?

## Conclusion (5 mins)

Directives allow us to create re-useable widgets that can be used in multiple places not only in the project we're working on, but future projects as well.

They are a great way of spliting out the work load between memebers of a team and are highly testable!