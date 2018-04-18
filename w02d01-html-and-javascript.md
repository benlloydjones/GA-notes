# HTML and Javascript

### Objectives
*After this lesson, students will be able to:*

- Explain to students how to load JavaScript into an HTML file
- Explain why it is better to have seperate files
- Understand how to use `.prompt()`
- Understand how to use `alert()`
- Explain what the `DOMContentLoaded` event is and why we need to use it

### Preparation
*Before this lesson, students should already be able to:*

- Must have covered the intro to HTML lesson
- Must have covered the intro to JS lesson

## HTML and Javascript

## Instructions

When developing our JavaScript, we are going to want to write it in a file and then run that file in a browser. We don't want to write everything in the console! Let's look at how we can setup our files so that we can run Javascript in our browsers:

### Address bar?!

You can run javascript directly from the address bar, don't know why you would want to do that?

```
javascript:alert("hello");void(0);
```

### HTML file

A much better way would be to create an HTML file and load that in the browser:

```sh
$ touch index.html
$ subl .
```

Inside this HTML file we want to scaffold a basic page template:

```html
<!DOCTYPE>
<html>
<head>
  <title>HTML and JS</title>
</head>
<body>

</body>
</html>
```

You can open it in your browser by right-clicking on the file in the sidebar of Sublime and selecting "Open in Browser", or by using the `open` command in the terminal, or by dragging the file into the browser icon.

#### Script tag

We can run Javascript using a script tag:

```html
<script type="text/javascript">
  alert("hello");
</script>
```

The "type" attribute was required in HTML 4, but optional in HTML5.

Script tags however can take a `src` option:

```html
<script type="text/javascript" src="./app.js"></script>
```

It will now look for an `app.js` file in the same directory as the `index.html`.

```sh
$ touch app.js
```

Inside this file let's add:

```js
alert("Loaded.");
```

Great! This is how we should be including our JS for now.


### `window.prompt()` 

JavaScript operates in a host environment and relies on API's to handle input and output.

`window.prompt()` is a method that displays a dialog box that prompts the visitor for input.


### `window.alert()`

The alert() method displays an alert box with a specified message and an OK button.

An alert box is often used if you want to make sure information comes through to the user.


### `DOMContentLoaded`

HTML documents are loaded by the browser from top to bottom. When the browser finds a script tag, it pauses while it loads that script into memory then continues to load the rest of the document.

If we include our script in the `<head>` tag of the document, the browser will attempt to run that script **before the `<body>` has loaded**.

Consider the following example:

`index.html`

```html
<!DOCTYPE>
<html>
<head>
  <title>HTML and JS</title>
  <script src="./app.js"></script>
</head>
<body>
	<button>Click Me!</button>
</body>
</html>
```
`app.js`

```js
const button = document.querySelector('button');
button.addEventListener('click', () => {
  console.log('You clicked me!');
});
```

If we run this code, nothing will happen when we click the button, because the `<button>` element wasn't there at the time the script was loaded.

However, once the browser has loaded all of the HTML document and build the DOM in memory, it fires an event on the `window` called `DOMContentLoaded`. We can use this event to run our script **only when the DOM is ready**:

```js
window.addEventListener('DOMContentLoaded', () => {

  const button = document.querySelector('button');
  button.addEventListener('click', () => {
    console.log('You clicked me!');
  });
  
});
```

Great! Now the button will be there.

### Loading scripts in the body

Alternatively we can load our script at the bottom of the page like so:

```html
<!DOCTYPE>
<html>
<head>
  <title>HTML and JS</title>
</head>
<body>
	<button>Click Me!</button>
	<script src="./app.js"></script>
</body>
</html>
```

This is perfectly acceptable, and will improve perceived page load times, however purists would argue that since a `script` tag is not part of the visual content of the page, it should be in the head.

The choice is ultimately yours, but you will come across both styles during your career!