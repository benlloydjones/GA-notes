# React Google Map Component

In this lesson we'll build out a quick Google Maps component. This will introduce us to a few more lifecycle hooks in React and also show us how we can incorporate a 3rd-party JavaScript library into a React project.

## The Starter Code

Take a quick look at the starter code. There's a `GoogleMap` component in `src/components` which is a classical component. Although this component will not need `state`, we will need to make use of some lifecycle hooks, so a functional component will not suffice here.

Inside `src/app.js` there's a simple `App` component which will render the `GoogleMap` component.

There are some basic styles in `src/scss/styles.scss` which will make our map `div` the height of the viewport, so we will be able to see the map render on the page.

#### Add your Google Maps API key

In `src/index.html` you will see the Google Maps script tag in the head of the project. Replace `YOUR_API_KEY` with an actual Google Maps API key. If you don't have one, [follow the instructions in the google maps documentation](https://developers.google.com/maps/documentation/javascript/get-api-key).

#### Start up the app

Once that's done you should start the app with `yarn start`. You should see **Google Map goes here...** on the screen.

## Getting the DOM element in the component

In order to make a google map, we should pass the DOM element we want to load the map into as the first argument of the `google.maps.Map` constructor. Normally we would grab the element with `document.getElementById('map')` or `$('#map')` if we're using jQuery.

React has its own method of grabbing an element from the DOM, once it has been rendered. We can pass a callback to a `ref` prop on the JSX tag, which receives the actual DOM element as an argument. We can then attach that element to the component using `this`:

```js
<div className="google-map" ref={element => this.mapCanvas = element}>Google Map goes here...</div>
```

We've created a `mapCanvas` property on the `GoogleMap` component which now contains the DOM element created by React inside the component's `render` function.

To ensure everything is working as expected we'll `console.log` our `mapCanvas` property inside the `componentDidMount` method:

```js
componentDidMount() {
  console.log(this.mapCanvas);
}
```

If the `render` method successfully rendered our `google-map` div, the `componentDidMount` method will fire, and here we can check that we have the DOM element stored in `this.mapCanvas`.

## Creating the map
Now that we have the element, creating the map is trivial:

```js
componentDidMount() {
  this.map = new google.maps.Map(this.mapCanvas, {
    center: { lat: 51.51, lng: -0.09 },
    zoom: 14
  });
}
```

We should now see a map on the page!

## Destroying the map

Since React creates and destroys (or removes) DOM elements frequently throughout the lifetime of the application, it's important that we release any memory that Google Maps has used in creating this map. If we didn't do this, after a while our application would start to get very laggy.

>**Note:** We only have to do this because of the way Google Maps works. React would normally handle this itself.

There is a `componentWillUnmount` lifecycle hook which allows for any logic to be performed just before React removes the component from the DOM. This is the ideal place to tidy up after ourselves:

```js
componentWillUnmount() {
  this.map = null;
}
```

For a basic map, it's as simple as setting the map instance to `null`.

## Adding a marker

When we create the map, let's add a marker to the center of the map.

```js
componentDidMount() {
  this.map = new google.maps.Map(this.mapCanvas, {
    center: { lat: 51.51, lng: -0.09 },
    zoom: 14
  });

  this.marker = new google.maps.Marker({
    map: this.map,
    position: { lat: 51.51, lng: -0.09 }
  });
}
```

Great, but now we need to update our `componentWillUnmount` method to handle the marker as well:

```js
componentWillUnmount() {
  this.marker.setMap(null);
  this.marker = null;
  this.map = null;
}
```

## A few extras

In the starter code there are some map styles in `src/config/mapStyles.js`. To get our map to use them we can require them in the component and attach them to the map settings:

```js
import mapStyles from '../config/mapStyles';

class GoogleMap extends React.Component {

  componentDidMount() {
    this.map = new google.maps.Map(this.mapCanvas, {
      center: { lat: 51.51, lng: -0.09 },
      zoom: 14,
      styles: mapStyles
    });

    .
    .
    .
  }

  .
  .
  .
}
```

## Adding the center via `props`:

We can also pass a center point for the map via `props`:

```js
componentDidMount() {
  this.map = new google.maps.Map(this.mapCanvas, {
    center: this.props.center || { lat: 51.51, lng: -0.09 },
    zoom: 14,
    styles: mapStyles
  });

  .
  .
  .
}
```

By using the `or` operator, we can use the center that has been passed into the component via `props` or a default center point if none is provided.

Let's update the `App` component to pass is a center point:

```js
class App extends React.Component {

  state = {
    center: { lat: 52.3755, lng: -2.317 }
  };

  render() {
    return (
      <GoogleMap center={this.state.center} />
    );
  }
}
```

And we're done! 💥