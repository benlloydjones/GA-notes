# React Routing Lab: Criminals

In this session we'll build out a slightly more comprehensive app using AJAX and routing together. The app should be familiat to you, yep that's right, it's the criminals app!

## Installing React Router

Inside the starter code you'll see a single `App` component in `index.js`. This is where we will introduce our router and set up our routes.

With React Router, each "page" or "route" is a component, and React Router will display the component that matches the routes `path` prop.

First let's install React Router with yarn:

```sh
yarn add react-router-dom
```

Now we can include the parts of the package we need at the top of `index.js`:

```js
import React from 'react';
import ReactDOM from 'react-dom';

import { BrowserRouter, Route, Link } from 'react-router-dom';
```

* `BrowserRouter` is React Router's root element. It should wrap around our entire app. Just like `ReactDOM.render` it **must have only one root JSX element**.
* `Route` is a component which has two `props`: `path` which will be the URL of the route, and `component` which will be the component to display for that specific URL.
* `Link` is a component that will generate the correct `<a>` tag for us.

As you can see the `Route` component needs to take `component` as a `prop`, and our first route will be our list of criminals. So firstly we need to break this out into its own component. We'll take the `componentDidMount` and `deleteCriminal` method along for the ride:

```sh
mkdir src/components && touch src/components/CriminalsIndex.js
```
```js
import React from 'react';
import Axios from 'axios';

class CriminalsIndex extends React.Component {

  state = {
    criminals: []
  };

  componentDidMount() {
    Axios.get('/api/criminals')
      .then(res => this.setState({ criminals: res.data }))
      .catch(err => console.error(err));
  }

  deleteCriminal = ({ id }) => {
    Axios.delete(`/api/criminals/${id}`)
      .then(() => {
        this.setState(prevState => {
          const criminals = prevState.criminals.filter(criminal => criminal.id !== id );
          return { criminals };
        });
      });
  }

  render() {
    return (
      <ul id="criminals">
        {this.state.criminals.map(criminal => <li key={criminal.id}>
          <strong>{criminal.name}</strong>
          <em>{criminal.location}</em>
          <span className={'status ' + criminal.status.toLowerCase()}>{criminal.status.toUpperCase()}</span>
          <button className="delete" onClick={() => this.deleteCriminal(criminal)}>x</button>
        </li>)}
      </ul>
    );
  }
}

export default CriminalsIndex;
```

Ok, now let's update the `App` component to include our router goodness:

```js
import CriminalIndex from './components/CriminalsIndex';

class App extends React.Component {

  render() {
    return (
      <BrowserRouter>
        <main>
          <h1>Infamous Criminals</h1>
          <nav>
            <li><Link to="/">All Criminals</Link></li>
            <li><Link to="/new">Add Criminal</Link></li>
          </nav>
          <section>
            <Route path="/" component={CriminalsIndex} />
          </section>
        </main>
      </BrowserRouter>
    );
  }
}
```

Ok great, we've created a new `CriminalsIndex` route which takes care of loading in the data it needs and handles the delete button itself.

Now we're going to add a `CriminalsNew` route, which will display a form, handle the form submission, and redirect the user back to `CriminalsIndex` when the form has been processed.

Let's start with a basic classical component:

```sh
touch src/components/CriminalsNew
```
```js
import React from 'react';

class CriminalsNew extends React.Component {

  state = {
    criminal: {
      name: '',
      location: '',
      status: ''
    }
  }

  render() {
    return (
      <div>Form goes here</div>
    );
  }
}

export default CriminalsNew;
```

Here we've created an empty criminal in the component's `state` ready to hook up to the form. Firstly though let's just check that we can navigate to this "page".

Back in `index.js` let's hook it up using another `Route` component:

```js
class App extends React.Component {

  render() {
    return (
      <BrowserRouter>
        <main>
          <h1>Infamous Criminals</h1>
          <nav>
            <li><Link to="/">All Criminals</Link></li>
            <li><Link to="/new">Add Criminal</Link></li>
          </nav>
          <section>
            <Route path="/" component={CriminalsIndex} />
            <Route path="/new" component={CriminalsNew} />
          </section>
        </main>
      </BrowserRouter>
    );
  }
}
```

If we test the links in our navbar with Chrome, we'll see that when we navigate to `/new` we see both the `CriminalsIndex` **and** `CriminalsNew` components rendered to the screen.

This is not what we expected, but is actually a very nice feature of React Router. It allows us to easily nest routes, we can display a "page" which has tabs for example that can easily reveal new content using the `Link` component and a nested URL. Something like `http://exmaple.com/our-services/copywriting`. The `/our-services` route might display a list of services provided and `/copywriting` might be a specific service. React Router can easily show both the overview and detail at the same time if we so desire.

The reason why this happens is because `/` is a partial match of `/new`. They both start with `/` so React Router will display them both by default. To suppress this behaviour we can add the `exact` prop before `path`:

```js
<section>
  <Route exact path="/" component={CriminalsIndex} />
  <Route path="/new" component={CriminalsNew} />
</section>
```

Now React will only load the `CriminalsIndex` route if the path is _exactly_ `/`.

Ok, let's go back to our `CriminalsNew` route and flash it out a little.

The job of the `CriminalsNew` route is three-fold:

* Display a form
* Send the form data to the API
* Redirect the user back to the `CriminalsIndex` route

The form would make a create "dumb" functional component, since in a full RESTful app it would likely be reused. Let's make that first:

```sh
touch src/components/CriminalsForm.js
```
```js
import React from 'react';

const CriminalsForm = (props) => {
  return (
    <form>
      <div>
        <label htmlFor="name">Name:</label>
        <input type="text"
          id="name"
          name="name"
          placeholder="Prof. Moriarty"
        />
      </div>
      <div>
        <label htmlFor="location">Location:</label>
        <input type="text"
          id="location"
          name="location"
          placeholder="Reichenbach Falls, CH"
        />
      </div>
      <div>
        <label htmlFor="status">Status:</label>
        <select id="status"
          name="status"
        >
          <option value="" disabled>- - Please Select One - -</option>
          <option value="Alive">Alive</option>
          <option value="Dead">Dead</option>
          <option value="Unknown">Unknown</option>
        </select>
      </div>
      <div>
        <button>Submit</button>
      </div>
    </form>
  );
};

export default CriminalsForm;
```

Now let's render that in the `CriminalsNew` component:

```js
import React from 'react';
import CriminalsForm from './CriminalsForm';

class CriminalsNew extends React.Component {

  state = {
    criminal: {
      name: '',
      location: '',
      status: ''
    }
  }

  render() {
    return (
      <CriminalsForm />
    );
  }
}
```

We need to pass the `criminal` data from `state` into the `CriminalsForm`, so we can set the `value` attribute of each form element with the relative data:

```js
class CriminalsNew extends React.Component {

  state = {
    criminal: {
      name: '',
      location: '',
      status: ''
    }
  }

  render() {
    return (
      <CriminalsForm criminal={this.state.criminal} />
    );
  }
}
```

Now we can update the form, setting a `value` on each form element:

```js
const CriminalsForm = ({ criminal }) => {
  return (
    <form>
      <div>
        <label htmlFor="name">Name:</label>
        <input type="text"
          id="name"
          name="name"
          placeholder="Prof. Moriarty"
          value={criminal.name}
        />
      </div>
      .
      .
      .
      <div>
        <button>Submit</button>
      </div>
    </form>
  );
}
```

Next we need to update `state` in the `CriminalsNew` form as the user types. This may seem slightly unusual but it the way that React prefers to handle forms. We'll create a `handleChange` method in `CriminalsNew`, and then pass it into `CriminalsForm` and attach it to each form element:

```js
class CriminalsNew extends React.Component {

  state = { ... }

  handleChange = (e) => {
    const criminal = Object.assign({}, this.state.criminal, { [e.target.name]: e.target.value });
    this.setState({ criminal })
  }

  render() {
    return (
      <CriminalsForm
        criminal={this.state.criminal}
        handleChange={this.handleChange}
      />
    );
  }
}
```

The `handleChange` method may look a little complicated, but it really boils down to the new ES6 `Object.assign` method. Here we are superimposing properties onto objects from left to right. So we start with an empty object, and superimpose the state's `criminal` object, then superimpose the data that the user is typing, using the name as the key, and the value as the property. Here's an example of what this might look like at some point during this process:

```js
const criminal = Object.assign({}, { name: '', location: '', status: '' }, { name: 'Prof. Moriarty' });

console.log(criminal); // => { name: 'Prof. Moriarty', location: '', status: '' }
```

In this way we are able to update state in an **immutable** way.

Let's attach this to the form elements in `CriminalsForm`:

```js
const CriminalsForm = ({ criminal, handleChange }) => {
  return (
    <form>
      <div>
        <label htmlFor="name">Name:</label>
        <input type="text"
          id="name"
          name="name"
          placeholder="Prof. Moriarty"
          value={criminal.name}
          onChange={handleChange}
        />
      </div>
      .
      .
      .
      <div>
        <button>Submit</button>
      </div>
    </form>
  );
}
```

Great, as we type we should be updating the `state` in `CriminalsNew`.

Finally we need to create a `handleSumbit` method to handle the form submission and redirect the user:

```js
import React from 'react';
import Axios from 'axios';

class CriminalsNew extends React.Component {

  state = { ... }

  handleChange = (e) => {
    ...
  }

  handleSubmit = (e) => {
    Axios.post('/api/criminals', this.state.criminal)
      .then(() => this.props.history.push('/'))
      .catch(err => console.log(err));
  }

  render() {
    return (
      <CriminalsForm
        criminal={this.state.criminal}
        handleChange={this.handleChange}
        handleSubmit={this.handleSubmit}
      />
    );
  }
}
```

The `handleSubmit` method should see a lot more familiar. We're using `Axois` to make the AJAX call passing the data `this.state.criminal` as the second argument.

In the `.then()` block we are redirecting using `this.props.history.push('/')` with the URL we want to redirect to as the only argument. The `history` object has been added to `props` by React Router for this very reason.

Finally we need to hook up the `handleSubmit` to the form:

```js
const CriminalsForm = ({ criminal, handleChange, handleSubmit }) => {
  return (
    <form onSubmit={handleSubmit}>
      .
      .
      .
    </form>
  );
}
```

Cool, we're all done. We should now be able to add and delete our crims at will!