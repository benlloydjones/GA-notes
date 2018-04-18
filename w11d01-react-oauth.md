# OAuth in React

In this lesson we'll be building out a reusable OAuth button in React.

## Starter Code

### Server Side

We have our `oauth` controller in our Express app. We need to pull a `code` from the request body in order to authorise the user.

```js
qs: {
  client_id: process.env.GITHUB_CLIENT_ID,
  client_secret: process.env.GITHUB_CLIENT_SECRET,
  code: req.body.code
}
```
Our server will then send this code to Github along with the `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET`, which are stored in our environment variables.

We then get given an access token, which we can then use to access the user information. This information can then be stored in our database if it doesn't already exist.

A JWT can then be created and sent to the client, which can be used to authenticate the user and be checked on requests to restricted resources.

### Client Side

We have an `OAuth.js` helper class inside the `lib` directory.

```js
import queryString from 'query-string';

class OAuthHelper {
  static providers = [{
    name: 'github',
    url: '/api/oauth/github',
    authEndpoint: 'https://github.com/login/oauth/authorize',
    scope: 'user:email',
    clientId: 'a4d7dff539facb662d03'
  }];

  static getAuthLink(provider) {
    const qs = {
      scope: provider.scope,
      client_id: provider.clientId,
      redirect_uri: window.location.href
    };

    return `${provider.authEndpoint}?${queryString.stringify(qs)}`;
  }

  static getProvider(providerName) {
    const provider = this.providers.find(provider => provider.name === providerName);
    provider.authLink = this.getAuthLink(provider);
    return provider;
  }
}

export default OAuthHelper;

``` 
This class stores an array of providers, which can then be used to return a chosen provider, adding an authentication link in the process.

Different providers have slightly different values for properties, such as `scope`. We can use our custom provider objects to construct unique query strings for each provider, as can be seen in the `getAuthLink` method. Inside this method we use the `query-string` package to help create the correct URL query string based on the unique `scope`, `client_id` and `redirect_uri` for the chosen provider.

## Creating our button

Create a button component by first adding a new file:

```sh
touch src/components/auth/OAuthButton.js
```

It will be a classical component, so that we can make use of lifecycle methods:

```js
import React from 'react';

class OAuthButton extends React.Component {

  render() {
    return (
      <a className="btn btn-primary"></a>
    );
  }
}

export default OAuthButton;

```

Now in `auth/Login.js` we need to require and add the auth button:

```js
import React from 'react';
import OAuthButton from './OAuthButton';

class Login extends React.Component {

  .
  .
  .

  render() {
    return (
      <div>
        <LoginForm
          credentials={this.state.credentials}
          handleChange={this.handleChange}
          handleSubmit={this.handleSubmit}
        />
        <OAuthButton provider="github">Login with Github</OAuthButton>
      </div>
    );
  }
}

export default Login;

```

Having the text inside the `OAuthButton` tags in the `Login` component allows us to use `this.props.children` inside our `OAuthButton` component to render the text.

```js
import React from 'react';

class OAuthButton extends React.Component {

  render() {
    return (
      <a className="btn btn-primary">{this.props.children}</a>
    );
  }
}

export default OAuthButton;

```
We're using an anchor tag so that we can connect up the `href` attribute with the correct provider link.

First we need to import the `OAuth` helper class:

```js
import OAuth from '../../lib/OAuth'
```

For now, the easiest place to retrieve the provider is in our `render` method.

```
render() {
	const provider = OAuth.getProvider(this.props.provider);
	 
	return (
		<a className="btn btn-primary" href={provider.authLink}>
			{this.props.children}
		</a>
	);
}

```

The Github button should now redirect you to the Github Authorize page with the correct query string parameters.

## Retrieving the code

Now in `componentWillMount` we can check to see if there is a `code` parameter in the URL, which will have been sent from Github. 

We can also move our `provider` constant up from the `render` method.

```js
class OAuthButton extends React.Component {
  componentWillMount() {
    this.provider = OAuth.getProvider(this.props.provider);
    
    // if there's no code in the address bar stop here
    if (!this.props.location.search.match(/code/)) return false;
    
    // get query string out of address bar as an object
    const data = queryString.parse(this.props.location.search);
  }

  .
  .
  .
}

export default OAuthButton;
```

We can now make a `POST` request to Github to authenticate the user. First we need to import axios:

```js
import axios from 'axios';
```

Then we can make the `POST` request:

```js
componentWillMount() {
  .
  .
  .
  
  const data = queryString.parse(location.search);
  
  axios.post(this.provider.url, data)
    .then(res => Auth.setToken(res.data.token));
}
```

We are now technically logged in, so we want to redirect the user to the homepage. To do this we need to import `withRouter` from `react-router-dom` and export the component wrapped in `withRouter`. This allows us to access `history` in props:

```js
import { withRouter } from 'react-router-dom';

.
.
.

export default withRouter(OAuthButton);
```

We can now use `this.props.history.push` to perform the redirect:

```js
componentWillMount() {
  .
  .
  .
  
  const data = queryString.parse(location.search);
  
  axios.post(this.provider.url, data)
    .then(res => Auth.setToken(res.data.token))
    .then(() => this.props.history.push('/'));
}
```

## Clean up

We now have a couple of issues. If the user hits the back button in the browser, it will reveal the code, which can cause an error if it is used more than once.

We can use the `replace` method on the `history` object to overwrite the last location visited.

```js
componentWillMount() {
  .
  .
  .
  
  const data = queryString.parse(location.search);
  
  axios.post(this.provider.url, data)
    .then(res => Auth.setToken(res.data.token))
    .then(() => this.props.history.replace(this.props.location.pathname))
    .then(() => this.props.history.push('/'));
}
```

We also have no way to differentiate between different codes from different OAuth providers. Therefore, we need to know which button the user clicked on so that we can be sure we are using the correct code for the chosen provider.

We can use `localStorage` to store the correct provider when the button is clicked.

```js
setProvider = () => {
  localStorage.setItem('provider', this.props.provider);
}

render() {
	return (
		<a 
		  className="btn btn-primary" 
		  href={provider.authLink} 
		  onClick={this.setProvider}
		>
		  {this.props.children}
		</a>
	);
}

```

We can then add an condition to the initial expression inside `componentWillMount` to make sure that the provider in `localStorage` is the same as the provide that has been clicked:

```js
componentWillMount() {
  this.provider = OAuth.getProvider(this.props.provider);

  // if there's no code in the address bar OR the provider does not match the one in localStorage stop here...
  if(!location.search.match(/code/) || localStorage.getItem('provider') !== provider) return false;
  .
  .
  .
}
```

Once we have set the token, we also want to clean up any items that have been set in `localStorage`, using `localStorage.removeItem('provider')`:

```js
componentWillMount() {
  .
  .
  .
  
  const data = queryString.parse(location.search);
  
  axios.post(this.provider.url, data)
    .then(res => Auth.setToken(res.data.token))
    .then(() => localStorage.removeItem('provider'))
    .then(() => this.props.history.replace(this.props.location.pathname))
    .then(() => this.props.history.push('/'));
}
```

## Sending a `redirectUri` to the server

Github does not require a redirect URI to be send from the server-side controller when requesting an access token, but facebook (and some other oAuth providers) does.

Let's send the redirect URI to the server, so that they could be used if needed.

The redirect URI we'll need to use for our `OAuthButton` to work is the page that we are on when we click the button. We can get this programmatically with the following:

```js
window.location.origin + window.location.pathname
```

Let's add this in our `componentDidMount()` method:

```js
componentDidMount() {
  .
  .
  .
  const data = queryString.parse(this.props.location.search);
  data.redirectUri = window.location.origin + window.location.pathname;
  
  axios.post(this.provider.url, data)
    .then(res => Auth.setToken(res.data.token))
    .then(() => localStorage.removeItem('provider'))
    .then(() => this.props.history.replace(this.props.location.pathname))
    .then(() => this.props.history.push('/'));
}
```

Ok great, so now our client side `OAuthButton` should behave in exactly the same way as `satellizer` does with Angular, which means we can comfortably re-use our server-side code from before.

💥

