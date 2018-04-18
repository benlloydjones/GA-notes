# AJAX with React

There are a few different ways of making AJAX requests with React:

- **[Vanilla JavaScript](http://mdn.beonex.com/en/DOM/XMLHttpRequest/Using_XMLHttpRequest.html)**: light but very long-winded!
- **[jQuery](http://api.jquery.com/jquery.ajax/)**: yes you can use React and jQuery together, but you probably shouldn't!
- **[fetch](https://github.github.io/fetch/)**: an AJAX library that is in-built in Chrome and Firefox, which may become a part of HTML spec soon
- **[axios](https://github.com/mzabriskie/axios)**: promise-based AJAX requests similar to jQuery, but without the added bloat of all the other jQuery functionality
- **[SuperAgent](https://visionmedia.github.io/superagent/)** similar to jQuery and Axios but without promises.

Ultimately it's up to you, but its worth noting that React does not have its own AJAX library (unlike Angular with its `$http` module).

The two most popular are `fetch` and `axios`. Here's a quick summary of both of them:

## `fetch`

`fetch()` allows you to make network requests similar to XMLHttpRequest (XHR). The main difference is that the Fetch API uses Promises, which enables a simpler and cleaner API, avoiding callback hell and having to remember the complex API of XMLHttpRequest.

We don't need to install the Fetch API as it is in-built in Chrome and Firefox.

| Pros | Cons |
|:-----|:-----|
| Native to Chrome and Firefox | Clunky syntax |
| No installation | Can only handle strings so requires the developer to use `JSON.stringify` before sending data |
| Will likely become standard in all browsers | Two-stage process to get the JSON payload in the response |
| Uses promises | Requires the API handle `URLencoded` data |


#### Example POST request

```js
fetch('/api/cats', {
  method: 'POST',
  body: JSON.stringify(this.state.cat)
})
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.log(err));
```

### Codealong using `fetch`

Let's build out a little application using `fetch` to request data from the [REST Countries API](https://restcountries.eu/). We are going to hard code in a country name to the URL and display that countries name and flag on the page.

Open up the `starter-code` and run `yarn install` to install any dependencies, then run `yarn start`.

Have a think about some of the lifecycle hooks that we've looked at/talked about so far in this module.

#### Mounting (rendering)
- `componentWillMount()`
- `render()`
- `componentDidMount()`

#### Updating
- `componentWillReceiveProps()`
- `shouldComponentUpdate()`
- `componentWillUpdate()`
- `render()`
- `componentDidUpdate()`

#### Unmounting (destroying)
- `componentWillUnmount()`

Which one would make most sense to use? When should we make the AJAX request? We want to make the request once the component has rendered, so let's use **`componentDidMount()`**.

```js
import React from 'react';
import ReactDOM from 'react-dom';

import 'bootstrap-css-only';
import './scss/style.scss';

class App extends React.Component {

  componentDidMount() {
    fetch('https://restcountries.eu/rest/v2/name/canada')
      .then(res => res.json())
      .then(data => console.log(data))
      .catch(err => console.log(err));
  }

  render() {
    return (
      <h1>Hello World</h1>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
```

Check that you can see the data being console logged in the browser.

We want to display that data on the page. Let's add a `constructor` to the `App` component, and add `country` to the `state` object, setting it to `null` to begin with.

```js
class App extends React.Component {
  constructor() {
    super();

    this.state = { country: null };
  }
  
  ...

  render() {
    ...
  }
}
```

Update the `.then()` method to set the `country` to be equal to the first element in the array of data that was returned from the API.	

```js
componentDidMount() {
  fetch('https://restcountries.eu/rest/v2/name/canada')
    .then(res => res.json())
    .then(data => this.setState({ country: data[0] }))
    .catch(err => console.log(err));
}
```

Now rather than console logging the data, we have updated the state object using the `.setState()` method.

Next we want to update the `render()` method to display the data to the page.

```js
render() {
  return (
    <main className='container'>
      <h1>{this.state.country.name}</h1>
      <img src={this.state.country.flag} />
    </main>
  );
}
```

You should see the following error in the console:

```
Uncaught TypeError: Cannot read property 'name' of null
```

_Why is this happening?_

This is because when the page loads, we don't have the data back from the API yet, so React is trying to pull the `.name` property off `null`.

Update the `.render()` method to be the following:

```js
render() {
  return (
    <main className='container'>
      {this.state.country && <h1>{this.state.country.name}</h1>}
      {this.state.country && <img src={this.state.country.flag} />}
    </main>
  );
}
```

Here we are saying: _"If `this.state.country` is **truthy** (i.e it has the data has been returned from the API), print the country name"_. We are doing the same for image.

We can refactor this even further to be:

```js
render() {
  return (
    <main className='container'>      
      {this.state.country && [
        <h1 key={1}>{this.state.country.name}</h1>, // <- commma is important!
        <img key={2} src={this.state.country.flag} />
      ]}
    </main>
  );
}
```

This might looks a little bit confusing, but rememeber that when we `.map` over an array and print out a JSX element for each item in the array, the `.map` method returns an array. If the `render()` methods sees an array, it will create an element for each thing in the array. **Remeber to put a comma after each element in the array**.

If we were printing out lots of properties this syntax would **DRY** up our code a lot.

We could even display a _"Loading..."_ message whilst we wait for the data to be returned. The REST Countries API is very quick, so we might only see it for a split second, but some APIs are quite slow, so it's worth letting the user know that something is happening.

```js
render() {
  return (
    <main className='container'>

      {!this.state.country && <p>Loading...</p>}
      
      {this.state.country && [
        <h1 key={1}>{this.state.country.name}</h1>,
        <img key={2} src={this.state.country.flag} />
      ]}
    </main>
  );
}
```

## `axios`

Like Fetch, Axios is a promise-based HTTP client that works both in the browser and in a node.js environment. It basically provides a single API for dealing with XMLHttpRequests and node’s http interface.

There are some benefits of using Axios over Fetch. It has a syntax that is slightly simpler - we don't need the first `.then()` block that turns the response into JSON, and we don't need to stringify data before sending it as part of a POST request. Axios is also supported on all browsers, whereas Fetch is not yet standard in all browsers (check out Fetch browser support [here](http://caniuse.com/#feat=fetch)).

| Pros | Cons |
|:-----|:-----|
| Has a familiar jQuery-esq syntax | Requires installation |
| Simple to use | Only requires the API to handle `JSON` |
| Lightweight compared to jQuery |

#### Example POST request

```js
axios.post('/api/cats', this.state.cat)
  .then(data => console.log(data))
  .catch(err => console.log(err));
```

> **Note**: Throughout this course we'll be using `axios`.


### Codealong using `axios`

First of all let's install [`axios`](https://github.com/axios/axios) as a dependency:

```sh
yarn install axios
```

Then require it at the top of the `app.js` file:

```js
import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
```

Comment out (or delete) the `.fetch()` method inside `componentDidMount()` and add the following:

```js
componentDidMount() {
  // fetch('https://restcountries.eu/rest/v2/name/canada')
  //   .then(res => res.json())
  //   .then(data => this.setState({ country: data[0] }))
  //   .catch(err => console.log(err));

  axios.get('https://restcountries.eu/rest/v2/name/canada')
    .then(res => console.log(res))
    .catch(err => console.log(err));
}
```

Check out the console log in Chrome and notice that we have recieved a lot more information about the request. This time the information about the country is inside `.data`. We will need to say `res.data` in order to access the array of country information.

```js
componentDidMount() {
  // fetch('https://restcountries.eu/rest/v2/name/canada')
  //   .then(res => res.json())
  //   .then(data => this.setState({ country: data[0] }))
  //   .catch(err => console.log(err));

  axios.get('https://restcountries.eu/rest/v2/name/canada')
    .then(res => this.setState({ country: res.data[0] }))
    .catch(err => console.log(err));
}
```

Make sure that you can now see the country information again in Chrome.

## Independent Practice

_1. How would you display an error message to the user if the country can't be found? Try sending a request for a country that doesn't exist._

_2. How would you hide the "Loading..." message if there is an error?_

#### Solution:

```js
import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

import 'bootstrap-css-only';
import './scss/style.scss';

class App extends React.Component {
  constructor() {
    super();

    this.state = { country: null, error: null };
  }

  componentDidMount() {
    axios.get('https://restcountries.eu/rest/v2/name/banana')
      .then(res => this.setState({ country: res.data[0] }))
      .catch(err => this.setState({ error: err.message}));
  }

  render() {
    return (
      <main className='container'>
        {!this.state.country && !this.state.error && <p>Loading...</p>}
        
        {this.state.error && [
          <h1 key={1}>Oops! There was an error with your request</h1>,
          <p key={2}>{this.state.error}</p>
        ]}

        {this.state.country && [
          <h1 key={1}>{this.state.country.name}</h1>,
          <img key={2} src={this.state.country.flag} />
        ]}
      </main>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
```


**Note:** You can also make an AJAX request in an event handler like so:

```js
class MyComponent extends React.Component {

  deleteCat = () {
    axios.delete(`/api/cats/${this.state.cat.id}`)
      .then(() => console.log('Cat deleted!');
      .catch(err => console.log(err));
  }

  render() {
    return (
      <button onClick={this.deleteCat}>Delete</button>
    )
  }
}
```

## Further Reading

- [AJAX Requests in React: How and Where to Fetch Data](https://daveceddia.com/ajax-requests-in-react/)
- [Fetch API - David Walsh](https://davidwalsh.name/fetch)