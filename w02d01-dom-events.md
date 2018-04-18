# DOM Events

### Objectives
*After this lesson, students will be able to:*

- Describe how javascript events works in the browser
- Explain how to handle to handle functions and execute code given some events
- Identify what the object `event` correspond to  

## Javascript, Event Driven development (5 mins)

One of the features of the World Wide Web that makes it so popular is its interactive nature. When a Web page is rendered, the client can interact with it. clicking on links and buttons to change pages or to make windows pop up, entering information in forms and view responses based on entries. In these and many other ways, Web pages are responsive to actions. In other words, Web pages are **"event-driven"**, reacting to events that initiated by the user such as mouse clicks or keyboard entries.

Most programs are **event-driven**, if you think about it...  

- When our web server runs, it sets up our app and then just sits there.
- It's not until something happens - an event - our visit to the web page - that our code runs.

We can define events on elements, and what JS to run when the event happens.

## A simple `click` event handler (5 mins)

We can add a simple click event to an element in two ways. Firstly, directly on the HTML:

```html
<button onclick="console.log('hello')">Click Me</button>
```

And secondly, in a javascript file linked to the HTML document:

```js
const button = document.querySelector('button');
button.onclick = function() {
  console.log('hello');
};
```

The second method is preferred, as it separates the JavaScript from the HTML, making our codebase cleaner, and easier to naviagte.

### The `event` keyword

Often, it's important to get more infomation about the javascript `event` that you are listening for. The window has a property called called `event` (`window.event`) that stores information about the last event executed by the browser. However, this information is also passed into each callback function of an event listener as it's first argument. In order to access this argument, we need to give it a name. The convention is `e` or `ev`. 

Whilst you can access the global `window.event` inside most callback functions, it is considered good practise to pass the argument into the function explicitly. This makes for more modular code.

Let's take a look at it:

```js
const button = document.querySelector('button');
button.onclick = function(e) {
  console.log(e);
};
```

> **Note:** Show the students the object in the console, and point out any significant properties.

`e.target` will tell us which element was clicked, so we can acces information about that element:

```js
const button = document.querySelector('button');
button.onclick = function(e) {
  console.log(e.target.innerHTML);
};
```

### `this`

When we attatch a function to an object, it is known as a **method**. We can use the keyword `this` to refer to the object that the function is attached to. Let's look at an example:

```js
const myObject = {
  name: 'Mike',
  age: 35,
  introduce() {
    console.log(`Hi, my name is ${this.name}, I'm ${this.age} years old!`);
  }
}

myObject.introduce();
=> "Hi, my name is Mike, I'm 35 years old!"
```

So in a similar way when we attach an event handler to a button, `this` refers to the button. This means we now have two ways of accessing the button:

```js
const button = document.querySelector('button');
button.onclick = function() {
  console.log(this.innerHTML);
};
```

### `this` and arrow functions

A word of warning: arrow functions behave differently than anonymous function when attached to objects, so `this` behaves differently.

```js
button.addEventListenr('click', () => {
  console.log(this.innerHTML);
});
```

This will not behave as expected, and will return `undefined`. So we either have to use the `e.target` method:

```js
button.addEventListenr('click', (e) => {
  console.log(e.target.innerHTML);
});
```

Or stick with a traditional anonymous function.

### The limitations of `onclick`

Unfortunately we can only assign one event listener to each event for an element in this way:

```js
const button = document.querySelector('button');

button.onclick = function() {
  console.log('hello');
};

button.onclick = function() {
  console.log(this.innerHTML);
};
```

Only the second event listenter will fire!

## `addEventListener` (5 mins)

The [`addEventListener()`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener) method attaches an event handler to a specified element.

The `addEventListener` method allows more than one event handler to be attached for the same event:

```js
const button = document.querySelector('button');

button.addEventListener('click', function() {
  console.log('hello');
});

button.addEventListenr('click', function() {
  console.log(this.innerHTML);
});
```

This is also the prevered method for assigning event handlers, so you should use this method from here on out.

The syntax is as follows:

```js
element.addEventListener(event, function, useCapture);
```

- The first parameter is the type of the `event` (like "click" or "mousedown").
- The second parameter is the `function` we want to call when the event occurs.
- The third parameter is an optional boolean value specifying whether to use event bubbling or event capturing. We'll get onto this later

## Click events / Mouse events (10 mins)

Open the first file: `click_events.html`

Let's look at 4 kinds of onclick events:

#### "click"

```js
button.addEventListener('click', () => {
  alert('I\'ve been clicked!');
});
```

#### "dblclick"

```js
button.addEventListener('dblclick', () => {
  alert('I\'ve been double clicked!');
});
```

#### "mousedown"

```js
button.addEventListener('mousedown', () => {
  alert('I\'ve been pressed down!');
});
```

#### "mouseup"

```js
button.addEventListener('mouseup', () => {
  alert('I\'ve been released!');
});
```

## Hover events (10 mins)

Open the next file: `hover_events.html`

#### "mouseover"

```js
img.addEventListener('mouseover', () => {
   console.log('mouseover!');
});

```

#### "mouseout"

```js
img.addEventListener('mouseout', () => {
   console.log('mouseout!');
});
```

#### "mousemove"

```js
img.addEventListener('mousemove', () => {
   console.log('mousemove!');
});
```

## Form events (10 mins)

Open the next file: `form_events.html`

Like click events, forms are very common things to have to deal with on a website.

#### "focus"

```js
input.addEventListener('focus', () => {
   console.log('focus!');
});
```

#### "blur"

```js
input.addEventListener('blur', () => {
   console.log('blur!');
});
```

#### "change"

```js
const radios = document.getElementsByClassName('radio');

for( var i=0; i<radios.length; i++ ) {
  radios[i].addEventListener('change', () => {
    console.log('Radio selected');
  });
}
```

#### "submit"

```js
form.addEventListener('submit', () => {
   alert('Form submitted');
   console.log('Form submitted');
   return false;
});
```

Let's run the code and submit the form, what happens?

The default browser behaviour for a `submit` event is to post the form data and then reload the page. We wont see our javascript executing due to this reload; we need some way to disable this default behaviour.

The event object (`e`) has a method `.preventDefault()` which we can use to prevent the reload of the page.

```js
form.addEventListener('submit', (e) => {
	e.preventDefault();
	
   alert('Form submitted');
   console.log('Form submitted');
   return false;
});
```

Now if you refresh the page and submit the form, notice how it does not reload the page and the javascript is visibily executed.

The methods and properties you have access to will be different for each event.

## Window events (10 mins)

Open the next file: `window_events.html`

As well as interacting with elements inside the page, like clicking items or interacting with forms. You can also access information when you change the browser window.

### "resize"

```js
window.addEventListenr('resize', (e) => {
  console.log('resizin\'!');
});
```

### "scroll"

```js
window.addEventListener('scroll', (e) => {
  console.log('scrollin\'!');
});
```

## Event Bubbling - Lowest to highest (10 mins)

Open the next file: `bubbling_events.html`

The concept of **event bubbling** was introduced to deal with situations where a single event, such as a mouse click, may be handled by two or more event handlers defined at different levels of the **Document Object Model (DOM)** hierarchy.

If this is the case, the event bubbling process starts by executing the event handler defined for individual elements at the **lowest level** (e.g. individual hyperlinks, buttons, table cells etc.). From there, the event bubbles up to the containing elements (e.g. a table or a form with its own event handler), then up to even higher-level elements (e.g. the BODY element of the page). Finally, the event ends up being handled at the highest level in the DOM hierarchy, the document element itself (provided that your document has its own event handler).

### Event Propagation

The term **event propagation** is often used as a synonym of event bubbling. However, strictly speaking, event propagation is a wider term: it includes not only **event bubbling** but also **event capturing**.

If we click on the smallest element on the screen (`#child2`) we can see that the click event travels up from `#child2` to `#child1` to `#parent`. We can stop this at any stage with the [`.stopPropagation()`](https://developer.mozilla.org/en-US/docs/Web/API/Event/stopPropagation) method:

```
child2.addEventListener('click', (e) => {
  e.stopPropagation();
  console.log('#child1 click');
});
```

As you can see the event stops at `#child1`;

### Event Capturing - Highest to lowest

Event capturing is the opposite of bubbling (events are handled at higher levels first, then sink down to individual elements at lower levels). Event capturing is supported in fewer browsers and rarely used; notably, Internet Explorer prior to version 9.0 does not support event capturing.

The [`addEventListener()`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener) has an optional parameter `useCapture`:

```
target.addEventListener(type, listener[, useCapture]);
```

Let's have a look what happens if we add `true` to the parent event listener.

```
parent.addEventListener("click", () => {
  console.log("#parent click");
}, true);
```

If you click on the yellow box, the parent element's event listener should fire first, then the 2nd child, then the 1st child.

> **Note:** You will need to remove `e.stopPropagation()` from the previous section to demonstrate this effectively

## Conclusion (5 mins)
Summary of the lesson

- Ask some questions