![ga_cog_large_red_rgb](https://cloud.githubusercontent.com/assets/40461/8183776/469f976e-1432-11e5-8199-6ac91363302b.png)

# Intro to Google Maps

### Introduction

Now that we are getting more familiar with the concept of APIs and making AJAX requests, we are going to look at another external API from Google. Google has [many](https://developers.google.com/apis-explorer/#p/) APIs, from image recognition to language translation. One of the most widely used is their [Maps API](https://developers.google.com/maps/). According to their documentation they have "more than one billion global monthly active users in over 200 countries", with data that "gives you accurate real-time information for mapping, navigation and places".

The Google Maps documentation is extensive and has plenty of code examples, but it takes a little while to get used to navigating such a large amount of information. The first thing you need to do is make sure you are looking at the [JavaScript API](https://developers.google.com/maps/documentation/javascript/) section of the docs. The Google Maps API is free to use, but you will need to request a key.

We are also going to using the [TFL API](https://api.tfl.gov.uk/), to pull in live data about the bike points around London. Unfortunately this API isn't as well documented. Luckily all we really need is the endpoint that we want to make a request to, as no API key is required.

### Setup

Open up the `starter-code`. We have a simple front-end app, with an `index.html`, a `js/app.js` and a `css/style.css`. There is **no database** here - as we are not saving anything. We are just going to be requesting data from TFL, and displaying it on the page. We are going to be doing all of our work inside the `app.js` file.

### Requesting a Google Maps key

From the [JavaScript API](https://developers.google.com/maps/documentation/javascript/tutorial) page, the first thing that we are going to do is grab the CDN link, and also request a key. At the top of the page, click on the `GET A KEY` button (you will need to log in if you aren't already).

<img width="626" alt="Request a key" src="https://user-images.githubusercontent.com/12997768/30480186-7484c508-9a10-11e7-8540-7932ff722377.png">

You will see this box. Create a project by giving it a name, and then click `ENABLE API`.

<img width="617" alt="screen shot 2017-09-15 at 12 23 24" src="https://user-images.githubusercontent.com/12997768/30480244-b8eb6ef4-9a10-11e7-98b9-cd3b18ea71a1.png">

Copy and paste this key somewhere safe for now, or leave this tab open in Chrome. We will need to add this key to the CDN link as part of a query string, which will allow us to use the Google Maps API.

Copy the following `script` tag into the `<head>` of your `index.html`.

```html
<script src="https://maps.googleapis.com/maps/api/js?key=PASTE_YOUR_API_KEY_HERE"></script>
```

Replace `PASTE_YOUR_API_KEY_HERE` with the API key that you just requested from Google.

Cool! We are ready to start using Google Maps.

### Initializing a Google Map

Google provides lots of mini tutorials covering various aspects of the maps functionality. The most basic example is on the 'Getting Started' page of the JavaScript [docs](https://developers.google.com/maps/documentation/javascript/tutorial). We are going to use this code and modify it slightly to fit our needs, such as using jQuery instead of vanilla JavaScript.

Have a look at the `index.html`. We have an empty `<div>` with the class of "map". This is where we are going to load the Google map into. Let's grab this using jQuery. It is important that this element is given a height, as by default `<div>` elements will collapse to be `0px` high if they are empty. The best thing to do is give the `<div>` a background colour so that you know where the map should be loading.

> **Note:** If you are using CSS flexbox you might not need to worry about this, thanks to the `align-items` property being set at `stretch` by default.

```js
const $map = $('.map');
```

We are also going to declare a global variable called `map` and set it to be `null` to begin with. This will hold the Google Maps object when we create it - and we will refer back to this throughout the app when we are adding markers and info windows.

```js
const $map = $('.map');
let map = null;
```

Now it's time to create the map. First of all we are going to create an object that holds the latitude and longitude of where we want to center our map (the GA London campus). We then create a new map and define where the map should load. We need to use jQuery `.get(0)` in order to pull the single DOM element out of the jQuery array.

We are going to set the zoom level to 14 (the range is between 1 and 20, 20 being the most zoomed in), and then pass in our `latLng` object as the center.

```js
const $map = $('.map');
let map = null;

initMap();

function initMap() {
  const latLng = { lat: 51.515213, lng: -0.072331 };
  map = new google.maps.Map($map.get(0), {
    zoom: 14,
    center: latLng
  });
}
```

Refresh the page and you should see a map on the page. Awesome!

To prevent the linter from complaining about `google` not being defined, add the following to the top of the file:

```js
/* global google:ignore */
```

### Requesting the Bike Points

Next we are going to make an AJAX request to the TFL API in order to retrieve the up-to-date bike point data. The URL we are going to make the `GET` request to is `https://api.tfl.gov.uk/bikepoint`. Test this out in Insomnia, and have a look at the data that you are getting back. 

Each bike point object holds a lot of information, and it is tricky at first to make out which bits are going to be useful. There is a `commonName` property which we will use later, along with the `lat` and `lon`, which we will need to create markers.

Inside the `additionalProperties` array there are more objects, that hold extra data, such as the number of available bikes and the number of available spaces. We will get hold of this data later.

Let's write a function called `getBikes`, which will make the AJAX call.

```js
function getBikes() {
  $.get('https://api.tfl.gov.uk/bikepoint')
    .done((response) => {
      console.log(response);
    });
}
```

We want to run this function once the map has initialised, so call it at the end of the `initMap()` function.

```js
function initMap() {
  const latLng = { lat: 51.515213, lng: -0.072331 };
  map = new google.maps.Map($map.get(0), {
    zoom: 14,
    center: latLng,
    scrollwheel: false
  });

  getBikes();
}
```

Refresh the browser and open up the Chrome console. You should see an array of 700+ bike points. Open up one of the objects and inspect the data. This is the same data that we just saw in Insomnia. Cool! We are ready to loop through the array and add some markers, but first of all let's create a global variable to store the response in, so that we have access to it later if we want to do any filtering.

```js
const $map = $('.map');
let map = null;
let locations = null;
```

Now we are going to assign the value of the response to the global `locations` variable, and then loop over it and for each bike point, we are going to call an `addMarker` function, and pass in the location object. We will write this `addMarker` function in a minute.

```js
function getBikes() {
  $.get('https://api.tfl.gov.uk/bikepoint')
    .done((response) => {
      locations = response;
      locations.forEach((location) => {
        addMarker(location);
      });
    });
}
```

Next let's write the `addMarker` function. Just like we did when we created the map, let's first of all create a `latLng` object that will store the latitude and longitude of the location, in the format that Google Maps requires (keys as `lat` and `lng`, and values as numbers).

Then we will create a Google Maps [marker](https://developers.google.com/maps/documentation/javascript/adding-a-google-map) using the syntax that they provide in the documentation. We need to specify the `position`, which will be the `latLng` object, and then specify which map we want to add the marker to. This will be the global `map` variable, which holds the map object.

```js
function addMarker(location) {
  const latLng = { lat: location.lat, lng: location.lon };
  const marker = new google.maps.Marker({
    position: latLng,
    map: map
  });
}
```

Refresh the page, and you should have a marker for each bike point. By default we are given the recognisable Google Maps marker, but it we want we can specify a custom marker. This can either be a URL, or the path to an image within your project. Inside the `images` folder we have `dot.svg`, so let's use that.

```js
function addMarker(location) {
  const latLng = { lat: location.lat, lng: location.lon };
  const marker = new google.maps.Marker({
    position: latLng,
    map: map,
    icon: 'images/dot.svg'
  });
}
```

![Google Maps](https://user-images.githubusercontent.com/12997768/30497798-1db298d6-9a4c-11e7-9837-8cff524da1e3.png)

### Adding info windows

The next feature that we are going to look at is how to add an [info window](https://developers.google.com/maps/documentation/javascript/infowindows) to each marker, so that when it's clicked, we get a little box that pops up over each one that has the name of the bike point as well as the number of available bikes and available spaces inside.

![Google Maps info windows](https://user-images.githubusercontent.com/12997768/30497822-39587394-9a4c-11e7-909b-df75b82f4307.png)

The first thing that we need to do is add an event listener to the marker itself. We aren't going to do this using jQuery, but instead we are going to use a Google Maps event listener. Inside the `addMarker` function add the following:

```js
function addMarker(location) {
  const latLng = { lat: location.lat, lng: location.lon };
  const marker = new google.maps.Marker({
    position: latLng,
    map: map,
    icon: 'images/dot.svg'
  });

  marker.addListener('click', () => {
    createInfoWindow(marker, location);
  });
}
```

Just like a jQuery event listener, we pass in the type of event (`'click'`), and then a callback function that will run once the marker is clicked. In this case, we want to run a function called `createInfoWindow`, and pass in the `marker` object as well as the `location` object. We need to pass in the `marker`, as we need to specify which marker the info window should open over, and `location` holds the data about the bike point, which we are going to display inside the info window itself.

Let's write the `createInfoWindow` function. Underneath `addMarker` add the following:

```js
function createInfoWindow(marker, location) {
  const infowindow = new google.maps.InfoWindow({
    content: `
    <div class="infowindow">
      <h3>${location.commonName}</h3>
    </div>
    `
  });

  infowindow.open(map, marker);
}
```

The syntax for creating a new info window is very similar to that of creating a marker or a map. We pass in an object which needs a `content` property. Here we pass in a string that can contain HTML, with classes and ids if necessary.

Finally we are going to ask the info window to open, and we need to specify which map and which marker it should open over.

Refresh your page and you should be able to click on the markers and see the name of each bike point. We also want to grab the available bikes and the available spaces data, but this will be slightly trickier to grab, as we will need to use the JavaScript [`.find()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find) method. We want to pull this data out of the `location` object again later, so rather than repeating ourselves, let's add it to the `location` objects when we first loop through them. 

Inside `getBikes`, inside the `.done()` of the AJAX request, add the following:

```js
function getBikes() {
  $.get('https://api.tfl.gov.uk/bikepoint')
    .done((response) => {
      locations = response;
      locations.forEach((location) => {
        location.noOfBikes = location.additionalProperties.find(obj => obj.key === 'NbBikes').value;
        location.noOfSpaces = location.additionalProperties.find(obj => obj.key === 'NbEmptyDocks').value;
        addMarker(location);
      });
    });
}
```

We are adding two new properties on to the `location` objects before we pass them to the `addMarker` function. The `.find()` method will return the first instance that matches the criteria specified. We want to loop through the `location.additionalProperties` array, and first of all find the object with a key of `NbBikes`, and then grab the `value` property from it. We can do the exact same with `NbEmptyDocks`.

By adding these properties to the `location` objects now we can use them again later on, without having to run the `.find()` method again.

Now, inside the `createInfoWindow` function, we can print these out as part of the info window content.

```js
function createInfoWindow(marker, location) {
  const infowindow = new google.maps.InfoWindow({
    content: `
    <div class="infowindow">
      <h3>${location.commonName}</h3>
      <p>Available bikes: <strong>${location.noOfBikes}</strong></p>
      <p>Free spaces: <strong>${location.noOfSpaces}</strong></p>
    </div>
    `
  });

  infowindow.open(map, marker);
}
```

Make sure that this is working by refreshing your browser, and clicking on a marker. You should see the number of spaces and number of bikes being printed on the page.

### Closing an info window

Currently, when we click on an info window, and click on another info window, the original one stays open. This could get annoying for the user, so ideally we want to shut any open info window before opening a new once.

In order to do this, we are going to create a global `infowindow` variable, which will be reassigned each time an info window is created. This will allow us to check if one exists and close it, before opening a new one.

At the top of your `app.js`, along with the other global variables, add the following:

```js
let infowindow = null;
```

We now need to remove the `const` before `infowindow` inside the `createInfoWindow` function. **This is important!** If we don't do this, the global `infowindow` variable is never used, and we can't check to see if one exists the next time that the `createInfoWindow` function is called. If `infowindow` is truthy, we simply call the `.close()` method on it.

```js
function createInfoWindow(marker, location) {
  if(infowindow) infowindow.close();

  infowindow = new google.maps.InfoWindow({
    content: `
    <div class="infowindow">
      <h3>${location.commonName}</h3>
      <p>Available bikes: <strong>${location.noOfBikes}</strong></p>
      <p>Free spaces: <strong>${location.noOfSpaces}</strong></p>
    </div>
    `
  });

  infowindow.open(map, marker);
}
```

Check that this is working by refreshing the browser and clicking on multiple markers. You should only have one info window open at a time. Much better!

### Filtering the markers

The final feature that we are going to implement is the ability to filter markers by `All Bike Points`, `Available Bikes`, and `Available Spaces`. There are lots of ways that you could approach filtering map markers. We are going to look at one way today.

First of all we need to add a form to the `index.html` file. Add this below the `<h1>` tag.

```html
<form>
  <div>
    <input type="radio" name="locations" id="all" value="all" checked>
    <label for="all">All Bike Points</label>
  </div>
  <div>
    <input type="radio" name="locations" id="bikes" value="bikes">
    <label for="bikes">Available Bikes</label>
  </div>
  <div>
    <input type="radio" name="locations" id="spaces" value="spaces">
    <label for="spaces">Available Spaces</label>
  </div>
</form>
```

You should have something that looks like this:

![Marker Filtering](https://user-images.githubusercontent.com/12997768/30499719-91add9ba-9a53-11e7-82d3-68631cab9db1.png)

We are going to listen for a `"change"` event on the radio buttons, and depending which radio button triggered the event listener, we will run a specific function.

First of all let's cache the radio buttons at the top of the `app.js` file.

```js
const $radios = $('input[type="radio"]');
```

Next we are going to add an event listener to the `$radios`.

```js
$radios.on('change', updateMap);
```

We haven't written `updateMap` yet, so let's do that now.

```js
function updateMap(e) {
  console.log('changed');
}
```

To start with, we are going to console log "changed" to make sure that the event listener is working. Remember, we want to test at each small incremental change to our code base. Make sure that you are seeing the console log as you click each radio button.

### Removing map markers

Before we can decide which markers should be shown on the map, we are going to remove all of them. In order to do this, we need an array of the current map markers. The easiest way to do this is to push each marker into an an array as it is created.

Create a global `markers` variable at the top of the file.

```js
const markers = [];
```

Next we are going to update the `addMarker` function so that we are pushing each marker into this `markers` array each time one is created.

```js
function addMarker(location) {
  const latLng = { lat: location.lat, lng: location.lon };
  const marker = new google.maps.Marker({
    position: latLng,
    map: map,
    icon: 'images/dot.svg'
  });

  marker.addListener('click', () => {
    createInfoWindow(marker, location);
  });

  markers.push(marker);
}
```

Next, create a `clearMarkers` function, which loops through each marker and calls the `.setMap()` method on it, passing in a `null` value. We then simply empty out the `markers` array.

```js
function clearMarkers() {
  markers.forEach(marker => marker.setMap(null));
  markers = [];
}
```

We are going to call this function each time one of the radio buttons is selected.

```js
function updateMap(e) {
  clearMarkers();
}
```

Test that this is working by refreshing the browser and checking that when you click a radio button, the map is cleared of markers.

### Control Flow

The next step is to work out which input has been checked. There are a couple of ways of doing this. One option would be to use the CSS `:checked` selector. The other is to pass in `e` to the `updateMap` function, and use `$(e.target)` to determine which radio button triggered the `change` event.

All we need to do then is use the `.val()` method to grab the value from the radio button. This will either be `all`, `bikes` or `spaces`. We will then use a `switch` statement to handle our control flow.

```js
function updateMap(e) {
  clearMarkers();

  const choice = $(e.target).val();

  switch(choice) {
    case 'all':
      getBikes();
      break;
    case 'bikes':
      showAvailableBikes();
      break;
    case 'spaces':
      showAvailableSpaces();
      break;
  }
}
```

The `getBikes` function is the original function that made the AJAX call to the TFL API. This is useful as it will pull in the bike points again, and ressign `locations` to be the most up-to-date data.

We haven't written the `showAvailableBike` function or the `showAvailableSpaces` function yet, so let's do that now.

### Only showing specific locations

We have the original array of bike points stored inside the global `locations` variable. If we only want to see bike points with available bikes, we can loop through this array and only add a marker if the `noOfBikes` property is truthy, i.e it is greater than 0. 

> **Note:** Depending on the time of the day, there might only be a handful of bike points with 0 bikes, so it's tricky to determine if everything is working correctly. You might want to check to see if there are more than 10 bike points instead.

Add the following function to the `app.js` file:

```js
function showAvailableBikes() {
  locations.forEach((location) => {
    if(location.noOfBikes) addMarker(location);
  });
}
```
The `showAvailableSpaces` function will be very similar. We could refactor our code to use a single function and pass in some arguments, but for readability now let's keep them seperate. 

```js
function showAvailableSpaces() {
  locations.forEach((location) => {
    if(location.noOfSpaces > 10) addMarker(location);
  });
}
```

Inside these functions we are using the additional `noOfBikes` and `noOfSpaces` properties that we added to the `location` objects earlier. This is really neat.

Test out your code by refreshing the browser. As you click on the radio buttons you should see markers being added and removed.

### Conclusion

This code could be refactored further, and generally improved in other ways. For example, we get a slight flickering as the markers are removed and added again. This is something to address in v2 of our app!

We have covered quite a lot of new syntax here, but you don't need to commit it all to memory right now. You have this example to look back on, as well as the excellent Google Maps documentation, and countless Stack Overflow posts.

Google Maps is incredibly widely used, so there are plenty of tutorials out there when it comes to more complex features. Having said that, Google Maps isn't the only maps API around. It is also work checking out [Polymaps](https://www.mapbox.com/).