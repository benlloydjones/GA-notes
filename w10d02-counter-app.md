## React Components Lab

We're going to make a simple counter app, in order to demonstrate how to data flows through a React app.

The user will be able to **increment**, **decrement** and **reset** a counter.

There will be two components:

- `App`: the top-level component. This will handle the state of the counter.
- `Buttons`: this will be a child component of `App`. It will be responsible for displaying the buttons of the app, but will not have any state or logic of its own.

## Data flow

One of the things that React is known for is it uni-directional data flow. Data flows down from parent to child, but never from child to parent.

If a child component needs to update `state` in a parent component, the parent passes an event handler down via props. Although the event is triggered in the child component, the child does not contain the logic to update the parent. This child is totally unaware of any logic that is happening in the parent. It just assigns the event listener and nothing more.

<br />

![React Data Flow](https://user-images.githubusercontent.com/3531085/29128452-c81d269a-7d1b-11e7-947f-8b0fad79a048.png)

<br />

In the React community we say "Data flows down, actions flow up". Keep this in mind as we work through this app.

## The `App` component

Create a classical `App` component that with `state` containing a `counter` property set to `0`.

In the component's render function renders the `counter` state inside a `h1` tag.

```js
import React from 'react';
import ReactDOM from 'react-dom';

import 'bootstrap-css-only';

class App extends React.Component {

  constructor() {
    super();
    
    this.state = { counter: 0 };
  }

  render() {
    return (
      <main className="container">
        <h1>{this.state.counter}</h1>
      </main>
    )
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
```

## The `Buttons` component

The `<Buttons />` component will be a "dumb", functional component. It will render 3 buttons:

- `+` to increment the counter
- `-` to decrement the counter
- `C` to reset the counter

```sh
$ mkdir components
$ touch components/Buttons.js
```

```js
import React from 'react';

const Buttons = () => {
  return (
    <div>
      <button className="btn btn-primary">+</button>
      {' '}
      <button className="btn btn-primary">-</button>
      {' '}
      <button className="btn btn-primary">C</button>
    </div>
  )
}

export default Buttons
```

>**Note:** The `{' '}` part is just adding a space between the buttons. The could or maybe **should** be done with CSS, but since you might see it in online documentation and tutorials, its probably worth showing it here.

Import the `Buttons` component at the top of the `app.js` file:

```js
import Buttons from 'components/Button.js';
```

Let's render the `Buttons` component inside the `App` component under the `h1` tag.

>**Note:** You will need to wrap a div around the `h1` and `Buttons` elements, since React can only render one single parent element in a `render()` method.

```js
render() {
  return (
    <div className="container">
  	  <h1>{this.state.counter}</h1>
      <hr />
      <Buttons />
    </div>
  )
}
```

## Adding the event listeners

Since the events listeners we are creating should affect the state in the `<App />` component, we need to write them there. Let's create 3 event listeners in `App`:

```js
class App extends React.Component {

  constructor() {
    super();

    this.state = { counter: 0 };
  }
  
  increment() {
    this.setState(prevState => ({ counter: prevState.counter + 1 }))
  };

  decrement() {
    this.setState(prevState => ({ counter: prevState.counter - 1 }))
  };

  reset() {
    this.setState({ counter: 0 });
  };
  
  ...
  
}
```

### Correctly modifying `state`

It may be tempting to write the `increment` event listener like this:

```js
increment() {
  this.state.counter++;
};
```

But if you do you will receive a stern error from React. When we update state we must do so **immutably**. That means we cannot mutate state in that way. To help with this **React has a `setState` method which we must use when we modify state**.

When the new state relies on the previous or current state, we should pass a callback function like so:

```js
this.setState(prevState => ({ counter: prevState.counter + 1 }));
```

Here we want to increment the counter by 1, so therefore we need to know the current state of the counter before we add 1 to it.

When the new state does not rely on the previous state, we can just pass an object of what we want the state to be:

```js
this.setState({ counter: 0 });
```

When we reset the counter, we just want to set it back to 0, it doesn't matter to us what state the counter was at before, so in this case we can just pass an object representing what we want state to be.

### The problem with `this`

Unfortunately if we apply these event listeners to our buttons, when they fire `this` will refer to the button that was clicked on. This is rather annoying because we need `this` to refer to the `<App />` component so we can update `state`.

To do this, we need to use `.bind()` to force this to be what we want it to. Let's update the `constructor()` method accordingly:

```js
class App extends React.Component {

  constructor() {
    super();
    
    this.state = { counter: 0 };
    
    this.increment = this.increment.bind(this);
    this.decrement = this.decrement.bind(this);
    this.reset = this.reset.bind(this);
  }
  
  increment() {
    this.setState(prevState => ({ counter: prevState.counter + 1 }))
  };

  decrement() {
    this.setState(prevState => ({ counter: prevState.counter - 1 }))
  };

  reset() {
    this.setState({ counter: 0 });
  };

  render() {
    .
    .
    .
  }
}
```

Ok great, now `this` will behave as expected in our event listeners.

## Passing the event listeners via props

We can now send the event listeners to the `Buttons` component via props:

```js
render() {
  return (
    <div>
  	  <h1>{this.state.counter}</h1>
      <hr />
      <Buttons increment={this.increment}
        decrement={this.decrement}
        reset={this.reset}
      />
    </div>
  )
}
```

Inside the `Buttons` component we can grab the event listeners from props and hook them up to the relevant buttons using the ES6 destructuring syntax inside the agument of the arrow function declaration:

```js
const Buttons = ({ increment, decrement, reset }) => {
  return (
    <div>
      <button className="btn btn-primary" onClick={increment}>+</button>
      {' '}
      <button className="btn btn-primary" onClick={decrement}>-</button>
      {' '}
      <button className="btn btn-primary" onClick={reset}>C</button>
    </div>
  );
}
```

You should now have a working counter app!

## Consider the following questions:

- Why do we use `className` instead of `class` on the buttons?
- Why is there a difference between the way we use `setState` with the `decrement` and `reset` event handlers?
- What is this `{' '}` in the `Buttons` component?

Use Google to help you.

## Conclusion

This app was a little contrived, but hopefully its has helped you to understand data flow in React. Always remember: **data flows down, actions flow up.**

## Further reading

* [React Unidirectional Data Flow Explained](https://medium.com/@khbrt/react-unidirectional-data-flow-explained-71bc35858226)
* [Thinking In React](https://facebook.github.io/react/docs/thinking-in-react.html)