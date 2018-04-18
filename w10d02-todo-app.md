# React To-do App

## Intro

We need to look more closely at the way React manages data. What better way than to build a todo app!

## Setup

- Install dependencies: `yarn install`
- Start webpack: `yarn start`

## Basic Layout

```js
import React from 'react';
import ReactDOM from 'react-dom';

import './scss/style.scss';

class App extends React.Component {

  render() {
    return (
      <main>
        <h1>You have 1 thing(s) to do!</h1>
        <ul>
          <li>Make a todo app</li>
        </ul>

        <TaskForm />
      </main>
    );
  }
}

const TaskForm = () => {
  return (
    <form>
      <input placeholder="Task" />
      <button>Add</button>
    </form>
  )
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
```

We're starting off with a basic layout. We have a list and a form, but they are not connected in any way yet.

## Adding todos to `state`

Let's move our initial todo to the App's `state`:

```js
constructor() {
  super();

  this.state = {
    todos: [{ task: 'Make a todo app' }]
  };
}
```

Now we can loop over the todos in `state` and render them on the page.

This way when the todos change, the view will automatically re-render.

>**Note**: Remember: whenever `state` or `props` changes React will re-render the relevant components.

```js
<ul>
  {this.state.todos.map((todo, i) => <li key={i}>{todo.task}</li>)}
</ul>
```

## Adding an `onChange` listener to the input

We need to hook up the `TaskForm` to the `App` component so we can eventually update the App's `state` with new tasks.

When a user submits the form, we need to be able to access the data. There are a few ways of doing this, but the preferred method is to store the form data on `state`.

Add a new property on the App's `state`:

```js
this.state = {
  todos: [{ task: 'Make a todo app' }],
  newTask: ''
}
```

We are going to change `newTask` whenever the user types something into the input.

Let's handle that with an event handler in the `App` component:

```js
handleChange(e) {
  console.log(e.target.value);  // e.target is in the <input>
  this.setState({ newTask: e.target.value });
}
```

We need to bind `this` in the constructor:

```js
constructor() {
  super();

  this.state = {
    todos: [{ task: 'Make a todo app' }],
    newTask: ''
  };

  this.handleChange = this.handleChange.bind(this);
}
```

This ensures that `this` inside the `handleChange` method points to the `App` instance, and not the `input` that we will attach the method to.

Now we can pass that event handler, and the `newTask` value down from `App` to `TaskForm` as a prop:

```js
<TaskForm handleChange={this.handleChange}
  newTask={this.state.newTask}
/>
```

Then use them inside the `TaskForm` component:

```js
const TaskForm = ({ handleChange, newTask }) => {
  return (
    <form>

      <input name="task"
        placeholder="Task"
        onChange={handleChange}
        value={newTask}
      />

      <button>Add</button>

    </form>
  );
}
```

As you type, you should see the value of the input in the console.

## Adding an `onSubmit` listener to the form

Once the form is submitted we need to add the new task to the App's todos array in the state. To do that we need to handle the form submit event.

As before let's write an event handler in the `App` component and pass it down to the `TaskForm` as a prop:

```js
handleSubmit(e) {
  e.preventDefault(); // prevent the form from refreshing the page

  this.setState(prevState => {
    // we cannot modify the todos array directly using `push`
    // we have to make sure we make a new copy of the array
    // `concat` behaves the same as `push` but returns a new array
    const newTodo = { task: prevState.newTask };
    const todos = prevState.todos.concat(newTodo);

    // we return the new state from `setState`
    return { todos, newTask: '' };
  });
}
```

> **Note**: The way we are updating the `todos` array here may seem a little long-winded, but its for a good reason. Check out the section on **Immutability** below for more info.

As before, let's bind `this` in the constructor, then pass this handler to the `TaskForm` through props:

```js
constructor() {
  super();

  this.state = {
    todos: [{ task: 'Make a todo app' }],
    newTask: ''
  };

  this.handleChange = this.handleChange.bind(this);
  this.handleSubmit = this.handleSubmit.bind(this);
}
```

```js
<TaskForm handleChange={this.handleChange}
  handleSubmit={this.handleSubmit}
  newTask={this.state.newTask}
/>
```

We can now hook it up to the form element:

```js
const TaskForm = ({ handleChange, handleSubmit, newTask }) => {
  return (
    <form onSubmit={handleSubmit}>

      <input name="task"
        placeholder="Task"
        onChange={handleChange}
        value={newTask}
      />

      <button>Add</button>

    </form>
  );
}
```

You should now be able to add a todo to the list!

## Immutability

It's important that we never change (or _mutate_) `state` directly.

```js
this.state.todos[0].task = 'Never do this!'
```

This is bad. We have _mutated_ the array. React is now not sure if the state has actually changed.

Instead we should always use `setState` and pass a new object or array. The previous example should be refactored like so:

```js
this.setState(prevState => {
  const todos = prevState.todos.map((todo, i) => {
    if(i === 0) todo.task = 'Do do this!';
    return todo;
  });

  return { todos };
});
```

This may seem like a lot of work for nothing but it is the foundation upon which React works, and why it is so quick at updating the view.

It may take a little while to get used to, but you will get more comfortable with a lot of new array methods like:

- `map`
- `concat`
- `filter`
- `slice`

Which return new arrays, rather than modifying existing ones.

## Toggling a todo

We want a way to be able to indicate that a task has been completed by a user. We will use a simple click event on the `<li>` inside the list to toggle a `completed` property on the todo itself.

Firstly let's add that property to the initial todo in `state`:

```js
this.state = {
  todos: [{ task: 'Make a todo app', completed: false }],
  newTask: ''
}
```

Now we need to make sure that all new todos have this `completed` property, and that it is set to `false` on creation:

```js
handleSubmit(e) {
  e.preventDefault(); // prevent the form from refreshing the page

  this.setState(prevState => {

    const newTodo = { task: prevState.newTask, completed: false };
    const todos = prevState.todos.concat(newTodo);

    return { todos, newTask: '' };
  });
}
```

Since our `<li>` is going to become more complex, let's break it out into a new component:

```js
const Todo = ({ task }) => {
  return (
    <li>{task}</li>
  )
}
```

We can update the `App` component like so:

```js
<ul>
  {this.state.todos.map((todo, i) => <Todo key={i} {...todo} />)}
</ul>
```

>**Note**: I'm using the spread operator here `...todo`. It's a new feature of ES6. It's basically the same as:
>
>```js
><Todo key={i} task={todo.task} completed={todo.completed} />
>```
>
>You will see it used a lot in React, since it saves us a lot of typing!

Let's create our new event handler in `App`:

```js
// `index` is the index of the todo clicked on
// We are using it to determine which todo we want to toggle
toggleCompleted(index) {
  this.setState(prevState => {

    const todos = prevState.todos.map((todo, i) => {
    	// `i` is the index of the todo inside the `map` function
    	// if `i` matches `index` then we have found the todo that was clicked on
      if(i === index) todo.completed = !todo.completed;

      // we return the todo, either as it was, or toggled
      return todo;
    });

    return { todos };
  });
}
```

Not forgetting to bind `this` in the constructor:

```js
constructor() {
  super();

  this.state = {
    todos: [{ task: 'Make a todo app', completed: false }],
    newTask: ''
  };

  this.handleChange = this.handleChange.bind(this);
  this.handleSubmit = this.handleSubmit.bind(this);
  this.toggleCompleted = this.toggleCompleted.bind(this);
}
```

Now let's pass it down to the `Todo` component in props:

```js
<ul>
  {this.state.todos.map((todo, i) => <Todo key={i} {...todo} onClick={() => this.toggleCompleted(i) }/>)}
</ul>
```

We cannot pass `toggleCompleted` directly because we need to pass it an argument, so instead we can wrap it in an arrow function.

We now need to make the UI change depending on whether the todo is marked as completed or not:

```js
const Todo = ({ task, completed, onClick }) => {
  return (
    <li className={completed ? 'completed' : ''} onClick={onClick}>{task}</li>
  )
}
```

Here we are setting the class of the `<li>` to `completed` if the task is marked as being completed. There are some styles in the starter code which should modify the look of the todo when this happens.

## Changing the number of todos left to do!

Finally let's update the UI to indicate how many todos are remaining. For this we'll use a simple function in the `App` component:


```js
remainingTodos() {
  return this.state.todos.filter(todo => !todo.completed);
}
```

We can use it inside the App's `render` function like so:

```js
<h1>You have {this.remainingTodos().length} things to do!</h1>
```

This function will be called every time the App renders. Because React re-renders the component every time state changes, this will happen every time a task is clicked on, or added to the array.

## Conclusion

You may be feeling like this is a lot of hard work for very little pay off, and it is for an app this simple. However as applications grow, and we start to add routing and AJAX requests and more complex UI, React really comes into its own.

## Further Reading

- [React Homepage](https://facebook.github.io/react/) - there's a Todo App half way down the page under the title **An Application**.
- [React - State & Lifecycle](https://facebook.github.io/react/docs/state-and-lifecycle.html)
- [React - Handling Events](https://facebook.github.io/react/docs/handling-events.html)