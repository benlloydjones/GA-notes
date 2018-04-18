![ga_cog_large_red_rgb](https://cloud.githubusercontent.com/assets/40461/8183776/469f976e-1432-11e5-8199-6ac91363302b.png)

# Angular Services & Proxy Requests

### Objectives
*After this lesson, students will be able to:*

- Make a proxy request to an external API using the `request-promise` package
- Create an Angular service and use it in a controller

### Preparation
*Before this lesson, students should already be able to:*

- Use Angular to make an `$http` request

## Intro (10 mins)

When requesting data from external APIs, often we are faced with **CORS** issues. CORS stands for Cross-Origin Resource Sharing, and is used to keep a website and its users secure from the security risks involved with sharing resources across multiple domains.

Until a few years ago, things like web fonts and AJAX requests were normally restricted to the same-origin policy, which restricted their use between different domains. Now however, with the use of CORS, the browser and server can communicate to determine whether it is safe to allow a cross-origin request or not.

Fortunately, many useful external APIs such as Google Places have no CORS issues. This allows us to use AJAX (or `$http` in Angular) to make requests from our client side JavaScript to retrieve useful data. 

However, there are some APIs that restrict this type of request. This means that we need to make the call to the public API from our server side (our API), and then pass the data back to our Angular app. This is called a **proxy request**.

Today we are going to look at how to make a proxy request to the Skiddle API, which provides data about upcoming events. We will also look at how to make the request from our Angular app using a **service**.

## Getting an API key (10 mins)

Before we start, you will need to sign up for an API key from Skiddle. Google the Skiddle API documentation to get started. You will be asked for your name, your email and a site URL. The URL of your site can be `http://localhost:8000`. Check your email for your API key.

Next we need at add the API key to our `.zshrc` file. It should look something like this:

```
SKIDDLE_API_KEY=fac743ac8f65650e77dc76a0d36126941
```

**Remember to source your `~/.zshrc` file by typing `reload` in the terminal, or quitting the Terminal app and opening it back up.**

## Using `request-promise` (20 mins)

We have already used the npm package `request-promise` before when we set up oAuth with Github. It is a really useful package that allows us to make HTTP requests from our server side code. From the [documentation](https://github.com/request/request-promise):

> The simplified HTTP request client 'request' with Promise support. Powered by Bluebird.

Open up the `starter-code` and run `yarn install && bower install`. Whilst you are waiting for the packages to install, have a look through the files and directories in Atom. There is nothing new here - we have a RESTful Express API which is serving JSON data about cities, and an Angular app which is looping through the cities and rendering them on the page.

Let's install `request-promise`:

```bash
yarn add request-promise
```

Great! Now, let's create a controller so that we can use it to make our request to the Skiddle API. In the terminal:

```bash
touch controllers/skiddle.js
```

Before we start, let's have a look at the [Skiddle documentation](https://github.com/Skiddle/web-api/wiki) to see which parameters we need to pass in. Below are details of the parameters that we will need to pass in as a query string when we make a request:

Parameter | Description | Example
--- | --- | ---
`latitude ` | Specify a latitude to find nearby events | `53.000`
`longitude `| Specify a longitude to find nearby events | `-1.234`
`radius `| Find events within the specified miles radius | `10`

Inside `controllers/skiddle` we need to require the `request-promise` package, and then we can write the function that we want to run when we make the call from our Angular app to our Express API for the event data. 

```js
const rp = require('request-promise');

function skiddleProxy(req, res) {
  rp({
    url: 'http://www.skiddle.com/api/v1/events/search',
    method: 'GET',
    json: true,
    qs: {
      api_key: process.env.SKIDDLE_API_KEY,
      latitude: 51.02,
      longitude: -0.12,
      radius: 5
    }
  })
    .then((events) => {
      res.json(events);
    })
    .catch((err) => {
      res.json(err);
    });
}

module.exports = {
  proxy: skiddleProxy
};

```

Let's have a look at what is going on here. First of all we are requiring the `request-promise` package, which is going to allow us to make a proxy request from our API.

We then open up a new request, specify the `url` from the docs, and open up a `qs` object, which allows us to set the query parameters. We are pulling in the API key from our `.zshrc` file, and hard-coding in some latitude and longitide values. We will keep the origin hard-coded for this app, and we will pass in dynamic data from the Angular app later.

If the request is successful, we send the response back as JSON, and if it fails we send back the error. Then we export the function at the bottom. 

Now we need to add a route into our `config/routes.js` file to handle a request to our API, which will then run the `proxy` function. First require the new controller, and then add a route.

```js
const router = require('express').Router();

const cities = require('../controllers/cities');
const skiddle = require('../controllers/skiddle');

router.route('/cities')
  .get(cities.index)
  .post(cities.create);
router.route('/cities/:id')
  .get(cities.show)
  .put(cities.update)
  .delete(cities.delete);

router.get('/events', skiddle.proxy);

module.exports = router;
```

## Testing in Insomnia (5 mins)

We are now ready to test our proxy request in Insomnia. We have told our API that if it receives a `GET` request to `/events`, it should run the `proxy` function inside `controllers/skiddle`, which will in turn make a request to the Skiddle API.

Open up Insomnia and make a `GET` request to `http://localhost:7000/events`, and check out the response.

Have a look at the response, and notice where the data is. How will we drill down to find the array? It's going to be something like `response.data.results`.

## Requests with `$http` (20 mins)

Now that we have set up our Express API to make the call to Skiddle for us, we can use `$http` to request the data from our Angular app.

Inside `src/js/controllers/cities.js`, inside the `CitiesShowCtrl `, inject `$http` and `API`, and add the following request:

```js
CitiesShowCtrl.$inject = ['City', '$state', '$http', 'API'];
function CitiesShowCtrl(City, $state, $http, API) {
  const vm = this;

  vm.city = City.query($state.params);

  $http
    .get(`${API}/api/events`)
    .then((response) => {
      console.log(response);
    });
}
```

If you refresh your page, you should see the data from the Skiddle API request being logged in the console. Great! Let's store the events inside `vm.events`.

Remove the `console.log` and add the following:

```js
CitiesShowCtrl.$inject = ['City', '$state', '$http', 'API'];
function CitiesShowCtrl(City, $state, $http, API) {
  const vm = this;

  vm.city = City.query($state.params);

  $http
    .get(`${API}/api/events`)
    .then((response) => {
      vm.events = response.data.results;
    });
}
```

In order to render our events on the page, update the `src/js/views/cities.show.html`:

```html
<div class="row">
  <div ng-repeat="event in citiesShow.events" class="col-md-4">
    <div class="event">
      <img ng-src="{{ event.largeimageurl }}">
      <a href="{{ event.link }}" target="_blank">
        <h4>{{ event.eventname }}</h4>
        <h5>{{ event.venue.name }}</h5>
      </a>
      <h6>{{ event.date | date: 'fullDate'}}</h6>
      <div class="icons">
        <p><i class="fa fa-ticket" aria-hidden="true"></i> {{ event.entryprice }}</p>
        <p><i class="fa fa-users" aria-hidden="true"></i> {{ event.goingtocount }}</p>
      </div>
    </div>
  </div>
</div>
```

Refresh Chrome and check out your events!

## Passing Parameters via `$http` (5 mins)

At the moment we have our latitude and longitude hardcoded into our API request inside the `controllers/skiddle.js`. Ideally, we would like to pass them as parameters from the Angular app, so that we can load events that are specific to cities when we click on a city show page.

Inside `CitiesShowCtrl` we have the `lat` and `lng` stored on `vm.city`, however, we can only send these values to the Skiddle API once we definitely have them back from our database. Let's refactor the `.get()` method so that it uses a `.$promise`.

```js
City.get($state.params)
  .$promise
  .then((response) => {
    vm.city = response;
  });
```

Now, inside the `.then()`, we know we definitely have the lat and lng ready to pass to the `$http` request. Wrap the `$http` request inside a function called `getEvents()`, and call it at the end of the `.then()` block.

Update the `$http` request inside `CitiesShowCtrl`.

```js
CitiesShowCtrl.$inject = ['City', '$state', '$http', 'API'];
function CitiesShowCtrl(City, $state, $http, API) {
  const vm = this;

  City.get($state.params)
    .$promise
    .then((response) => {
      vm.city = response;
      getEvents();
    });

  function getEvents() {
    $http
      .get(`${API}/events`, { params: { lat: vm.city.lat, lng: vm.city.lng } })
      .then((response) => {
        vm.events = response.data.results;
      });
  }
}
```

Inside `controllers/skiddle` we can now update the request url to be:

```js
function skiddleProxy(req, res) {
  rp({
    url: 'http://www.skiddle.com/api/v1/events/search',
    method: 'GET',
    json: true,
    qs: {
      api_key: process.env.SKIDDLE_API_KEY,
      latitude: req.query.lat,
      longitude: req.query.lng,
      radius: 5
    }
  })
    .then((events) => {
      res.json(events);
    })
    .catch((err) => {
      res.json(err);
    });
}
```

`req.query` holds the query parameters that we passed in when making the `$http` request. This allows us to say `req.query.lat` and `req.query.lng`, and use the city's latitude and longitude.

If you refresh Chrome, and click on the different cities, you should see different events for each city. Cool!

## HTML5 Geolocation

The HTML Geolocation API is used to get the geographical position of a user. Since this can compromise privacy, the position is not available unless the user approves it.

If a user allows us to use the Geolocation API on their browser, we are going to display events nearby. If not, we will just use the lat and lng for London.

In the `CitiesIndexCtrl` add the following:

```js
CitiesIndexCtrl.$inject = ['City', '$http', 'API'];
function CitiesIndexCtrl(City, $http, API) {
  const vm = this;
  vm.all = City.query();

  // if the user has geolocation enabled
  if (navigator.geolocation) {
    // run the getCurrentPosition function, which takes a callback and receives the position object as an argument
    navigator.geolocation.getCurrentPosition((position) => {
      getEvents(position.coords.latitude, position.coords.longitude);
    });
  } else {
    // if geolocation is disabled, call getEvents and pass in London coords
    getEvents(51.02, -0.12);
  }

  function getEvents(lat, lng) {
    $http
      .get(`${API}/events`, { params: { lat, lng }})
      .then((response) => {
        vm.events = response.data.results;
      });
  }

}
```

Now, when the user visits the index page, we are going to grab their lat and lng using the Geolocation API, and pass this to the `$http` request. 

Add the following HTML to the index page.

```html
<h1>Events Near Me</h1>
<div class="events">
  <div class="row">
    <div ng-repeat="event in citiesIndex.events" class="col-lg-3 col-md-4 col-6">
      <div class="event">
        <img ng-src="{{ event.largeimageurl }}">
        <a href="{{ event.link }}" target="_blank">
          <h4>{{ event.eventname }}</h4>
          <h5>{{ event.venue.name }}</h5>
        </a>
        <h6>{{ event.date | date: 'fullDate'}}</h6>
        <div class="icons">
          <p><i class="fa fa-ticket" aria-hidden="true"></i> {{ event.entryprice }}</p>
          <p><i class="fa fa-users" aria-hidden="true"></i> {{ event.goingtocount }}</p>
        </div>
      </div>
    </div>
  </div>
</div>
```

We are using a simple `ng-repeat` to loop through the results and print them to the page.

## Angular Services (20 mins)

This is looking good! The only thing is that our code is now quite WET. We have quite a lot of duplicate code in our `CitiesIndexCtrl` and `CitiesShowCtrl`. The difference is that we want to pass a specific latitude and longitude, depending on if we are on the index page or the show page.

Angular services to the rescue! We can use a service to dry up our code by creating a reusable module that we can inject into our controllers when we need it.

In the terminal:

```bash
mkdir src/js/services
touch src/js/services/skiddle.js
```

Inside `src/js/services/skiddle.js` add the following:

```js
angular
  .module('eventApp')
  .service('skiddle', Skiddle);

Skiddle.$inject = ['$http', 'API'];
function Skiddle($http, API) {
  const vm = this;

  function getEvents(lat, lng) {
    return $http.get(`${API}/events`, { params: { lat: lat, lng: lng } })
      .then((response) => {
        return response.data.results;
      });
  }

  vm.getEvents = getEvents;
}

```

We can now inject this service into our `CitiesIndexCtrl` instead of `$http`. Inside `src/js/controllers/cities`:

```js
CitiesIndexCtrl.$inject = ['City', 'skiddle'];
function CitiesIndexCtrl(City, skiddle) {
  const vm = this;
  vm.all = City.query();

  getLocation();

  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        getEvents(position.coords.latitude, position.coords.longitude);
      });
    } else {
      getEvents(51, -0.12);
    }
  }

  function getEvents(lat, lng) {
    skiddle.getEvents(lat, lng)
      .then(response => vm.events = response);
  }

}
```

This is so much neater! Our controller is now much more readable. We are injecting our `skiddle` service, and we can then call the `getEvents` method, passing in our lat and lng. If we have a look inside the service you can see where we are then passing this on to our `$http` request. At the bottom of the service we are returning events, which means that inside our Angular controller, we can say `events = response;`. 

Finally, let's update the `CitiesShowCtrl` to use the new `skiddle` service. Inside `src/js/controllers/cities.js`:

```js
CitiesShowCtrl.$inject = ['City', '$state', 'skiddle'];
function CitiesShowCtrl(City, $state, skiddle) {
  const vm = this;

  City.get($state.params)
    .$promise
    .then((response) => {
      vm.city = response;
      getEvents();
    });

  function getEvents() {
    skiddle.getEvents(vm.city.lat, vm.city.lng)
      .then(response => vm.events = response);
  }
}
```

Much nicer! We are using the same service, and passing in the latitude and longitude, which is the only difference each time. This has made our code much dryer. 

## Conclusion (5 mins)

We have covered a lot of concepts in this lesson, starting with making proxy requests from our API, to requesting the data using `$http` in our Angular app, and finally refactoring our code to use a service. Hopefully you can see how useful services can be, especially when using the same API in multiple views and in multiple controllers.