![ga_cog_large_red_rgb](https://cloud.githubusercontent.com/assets/40461/8183776/469f976e-1432-11e5-8199-6ac91363302b.png)

## Intro to jQuery


###Learning Objectives:

- Understand what jQuery is, and when to use it
- Explain that jQuery is just Javascript
- Learn how to include jQuery in your projects
- Explaining the difference between 1.x vs. 2.x jQuery
- Introduce the `$` sign
- Introducing Document Ready vs DOMContentLoaded
- Comparing pure Javascript to jQuery
- Understand how to apply jQuery selectors to manipulate DOM elements
- Explain what a jQuery object is and how to use it

<br>
---

### Timings:
| **Section** | **Timing** | **Summary** |
|-------------|------------|-------------|
| **Opening**: What is jQuery? | 10 mins | A brief introduction to jQuery and Javascript libraries. Explain that jQuery is just Javascript.            
| **We Do**: Installing jQuery | 10 mins | A look at the options of how to include jQuery in your projects
| **I Do**: Minification | 5 mins | A brief explanation of minification as the students may not have seen this before
| **I Do**: 1.x vs. 2.x jQuery | 5 mins | A quick explanation of the different versions of jQuery   
| **I Do**: `$` (The Dollar Sign) | 10 mins | Explanation of the dollar sign and what it means
| **We Do**: Document Ready vs DOMContentLoaded | 10 mins | Setup an HTML page and explain the importance of waiting until the DOM is ready 
| **We Do**: DOM manipulation with jQuery | 10 mins | Practise selecting elements with jQuery
| **I Do**: A jQuery object?! | 10 mins | A look at the difference between a jQuery object and a DOM element
| **We Do**: Changing content | 10 mins | Changing some content with jQuery
| **We Do**: Changing CSS | 10 mins | Changing CSS with jQuery
| **Closure** | 10 mins | Summary of the lesson          
| **Questions** | 10 mins | Any questions?

<br>
---

###Connection to a long term learning goal 

jQuery is an industry standard that WDI Students need to be confident with.

<br>
---

###Before Class (Student Pre-work)

[Please list any readings, practice problems, videos that would be helpful to complete before this lesson, prior knowledge to link]

<br>
---

###Related Homework	

- [jQuery's website](http://code.jquery.com/)

<br>
---

Intro to jQuery
=====

## Opening: What is jQuery?

> **jQuery:** The Write Less, Do More, JavaScript Library.

Not to be confused with [Jake Weary](https://en.wikipedia.org/wiki/Jake_Weary).

jQuery is a 3rd-party library that makes tasks like HTML document traversal and manipulation, event handling, animation, and Ajax much simpler with an easy-to-use API that works across a multitude of browsers.

### What is a library?

A **library** is just a collection of code, predominantly reusable methods, that serve a particular purpose.

### So, as a library, what does jQuery offer us?

- jQuery helps us manipulate the DOM, allowing us to perform complex manipulations in less code with less hassle
- jQuery's syntax was developed to mimic CSS selector syntax, making code easier to develop, read, and manage
- The syntax is shorter, and we're lazy!
- jQuery deals with many cross-browser compatibility issues for us

### jQuery is just Javascript

> jQuery is just Javascript

> jQuery is just Javascript

> jQuery is just Javascript

Many people think of jQuery as being different to Javascript however, it is just a library written in Javascript of useful methods and logic.

<br> 

## We Do: Installing jQuery

jQuery is a client side library, which means we need to include it in our HTML. To do this, we have two options:

#### 1. Reference jQuery from a server on the internet

Directly from [jQuery's website](http://code.jquery.com/):

```html
<script src="http://code.jquery.com/jquery-1.11.1.min.js"></script>
```

From a CDN (content delivery network) like [CDNJS](https://cdnjs.com/) or [Google Hosted Libraries](https://developers.google.com/speed/libraries/):

```html
<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
```

What is the benefit of this? Browsers keep a track of the files they have downloaded. If another website also used this CDN file then your browser won't make a request to download the file again which speeds up your website's loading speed.

#### 2. Download a copy of jQuery to host on your own server

[CDNJS](http://www.cdnjs.com), [Google Hosted Libraries](https://developers.google.com/speed/libraries/), and the [jQuery site](http://www.jquery.com) will all allow you to download a copy of jQuery to include in your projects.

<br>

## I Do: Minification

**What's with the 'min.js' in the name of the jQuery file?**

If you look carefully at the filenames of the jQuery versions you download, or just look at the URL in the "src" attribute for each script tag above, you'll notice something at the end of each file name — namely, that they end in 'min.js'. This means the javascript code has been minified.

#### Minified? Did I read that right?

Yep. You did. Minification is the process of making a javascript file smaller by (among other things): 

- Removing all line breaks and whitespace
- Reducing the length of variable and function names
- Stripping out all comments

Minification can significantly reduce the size of a javascript file, and in turn, significantly decrease the time it takes our browsers to load the file into memory.

#### What is the difference?

In jQuery's 1.11.1's case, the original (unminified) code is about 276 kilobytes, whereas the minified code is only 94 kilobytes. That makes the minified version **one-third** the size of the original - not bad!

#### Non-minified

Minified scripts can be difficult to read, so most servers that host jQuery and other libraries will also offer the original (non-minified) version of the code so developers can understand the code.

**Even if you don't fully understand the code, it's a good exercise to visit code.jquery.com and take a look at minified and non-minified jQuery.**

<br>

## I Do: 1.x vs. 2.x jQuery

If you've visited the [jQuery website](http://code.jquery.com), you'll see that there are two major versions in development.

- The **1.x branch** is the most cross-browser-compatible version of the jQuery core.
- The **2.x branch**, while offering some new features, is not compatible with older web browsers — most notably, it's not compatible with Internet Explorer versions 8 and below.

<br>

## I Do: `$` (The Dollar Sign)

Before we get started with jQuery, we should have a look at the `$`. 

The `$` is nothing but an alias for the jQuery library. 

If we have a look at the unminified jQuery code on [Google's CDN](https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.js) we can see at the bottom there is the code:

```
window.jQuery = window.$ = jQuery;
```

Essentially by using either `$` or `jQuery` followed by either a `.` or directly by `()` we can access the methods in the jQuery library.

## We Do: Adding jQuery to an existing project

We're going to work through an existing JavaScript project, updating the codebase to use jQuery.

Open up the starter code, and run it with `http-server -p 8000` in the root directory.

You should have the following file structure: 

```bash
├── css
│   └── style.css
├── index.html
└── js
    ├── pure-js.js
    └── with-jquery.js
```

The app is currently using the `pure-js.js` file. During this session we'll copy this code over to the `with-jquery.js` file and update it there, so at the end, you will be able to see the similarities and differences.

To start with, copy all the code from the `pure-js.js` file into the `with-jquery.js` file, update the `<script>` tag in `index.html` and add the jQuery cdn link:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Pure JS to jQuery</title>
    <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
    <script src="js/jquery-js.js" charset="utf-8"></script>
  </head>
  <body>
	.
	.
	.
  </body>
</html>
```

### DOMContentLoaded

The first thing we can update is the `DOMContentLoaded` event listener. Since this is such a fundamental part of a JavaScript file, the creators of jQuery wanted to simplify it.

With jQuery we can do this:

```js
$(document).ready(() => {
  ...
});
```

Which is cool, but if that isn't simple enough for you, there is a shorthand:

```js
$(() => {
  ...
});
```

Whoa! That's tight!

### Selecting elements

There are several ways of selecting elements with pure JS:

```js
document.getElementById('heading');
document.getElememtsByClassName('buttons');
document.getElementsByTagName('div');
document.querySelector('#header .list');
document.querySelectorAll('.italic');
```

With jQuery the process has been significantly simplified:

```js
$('#heading');
$('.buttons');
$('div');
$('#header .list');
$('.italic');
```

The syntax is the simplest in jQuery: `$(selector);`. It is the equivalent of `.querySelectorAll` in pure js, but requires hardly any typing whatsoever!

Let's update the first two lines of code:

```js
const $feelingDiv = $('#feeling');
const $buttons = $('button');
```

#### Variable assignment and selection

If you use variable assignment when doing a selection, a [`jQuery object`](https://learn.jquery.com/using-jquery-core/jquery-object/) is returned.

**Note**: Normal DOM elements have methods and properties, a jQuery object just adds a few more methods and properties to the selected object. Just think about a jQuery object as a supercharged DOM element!

We prepend `$` to variable names when a variable is going to be a jQuery object to help us remember what that variable is for:

```js
const $paragraphs = $('p'); 
```

This would return a jQuery object containing all `<p>` tags on your web page.

However, we don't HAVE to prepend '$' to our variables. It's just so we can remember what a variable is being used for:

```js
const paragraph = $('p');
```

This is functionally identical to the version above that includes the `$` in front of `paragraph`.

### Looping through elements

jQuery also simplifies looping thorough collections of elements. With pure js we **must** use a for loop to iterate over multiple elements:

```js
for(let i=0, len=buttons.length;i<len;i++) {
  const button = buttons[i];
  ...
}
```

But with jQuery we can use `.each` instead:

```js
$buttons.each((i, button) => {
  const $button = $(button);
  ...
});
```

> **Note:** jQuery's `.each` method is similar to the `.forEach` method except **the first two arguments are reversed!**

### Assigning event handlers to multiple elements

The main reason to loop over collections of elements in jQuery is to assign the same event handler to multiple elements:

```js
for(let i=0, len=buttons.length;i<len;i++) {
  buttons[i].addEventListener('click', (e) => {
    // do something here...
  });
}
```

However with jQuery you can add an event listener to a collection without the need for a loop at all:

```js
$buttons.on('click', (e) => {
  // do something here...
});
```

Notice how much simpler the syntax for adding an event listener is as well:

```js
.on(nameOfEvent, callback);
```

So an example of an event listener to watch for a `submit` event on a form would be:

```js
$form.on('submit', (e) => {
  e.preventDefault();
  // do something ...
});
```

Nice huh? Let's update our click event assignment:

```js
  $buttons.on('click', (e) => {
    const newFeeling = e.target.textContent;
    feelingDiv.textContent = newFeeling;

    if(newFeeling === 'Sassy') {
      feelingDiv.style.color = 'pink';
      feelingDiv.style.fontFamily = 'cursive';
      feelingDiv.style.fontSize = '40px';
    }
    if(newFeeling === 'Silly') {
      feelingDiv.style.color = 'orange';
      feelingDiv.style.fontFamily = 'fantasy';
      feelingDiv.style.fontSize = '32px';
    }
    if(newFeeling === 'Sad') {
      feelingDiv.style.color = 'grey';
      feelingDiv.style.fontFamily = 'serif';
      feelingDiv.style.fontSize = '36px';
    }
    if(newFeeling === 'Submarine') {
      feelingDiv.style.color = 'lightBlue';
      feelingDiv.style.fontFamily = 'sans-serif';
      feelingDiv.style.fontSize = '30px';
    }
  });
```

### Changing content

Pure JS has two main ways of updating the content of an element:

```js
element.innerHTML = '<h1>New HTML Content</h1>';
element.textContent = 'New text content, (HTML elements no supported)';
```

The equivaluent in jQuery is the much simpletr `.html` and `.text` methods.

To change the content, we pass an argument:

```js
$element.html('<h1>New HTML Content</h1>');
$element.text('New text content, (HTML elements no supported)');
```

And to get the current content, we pass no argument:

```js
$element.html();
=> '<h1>New HTML Content</h1>';

$element.text();
=> 'New text content, (HTML elements no supported)'
```


Sweet, let's update the content assignment now:

```js
const newFeeling = $(e.target).text();
$feelingDiv.text(newFeeling);
```

### Changing CSS

Pure JS uses the following syntax to modify the CSS of an element:

```js
element.style.propertyName = value;
```

With jQuery there are two different ways:

```js
$element.css(propertyName, value);
$element.css({ propertyName: value });
```

Let's use the latter to update our code:

```js
if(newFeeling === 'Sassy') {
  $feelingDiv.css({ color: 'pink', fontFamily: 'cursive', fontSize: '40px' });
}
if(newFeeling === 'Silly') {
  $feelingDiv.css({ color: 'orange', fontFamily: 'fantasy', fontSize: '32px' });
}
if(newFeeling === 'Sad') {
  $feelingDiv.css({ color: 'grey', fontFamily: 'serif', fontSize: '36px' });
}
if(newFeeling === 'Submarine') {
  $feelingDiv.css({ color: 'lightBlue', fontFamily: 'sans-serif', fontSize: '30px' });
}
```

Ooh that's nice!

## Closure

The great thing about jQuery is it save you having to type so much code to do simple, repetitive tasks. But not only is it more concise, it's also more **readable** which also helpes increase productivity.

There are SO many things you can do with jQuery, we have just scratched the surface.

You don't HAVE to use it, [you might not need jQuery](http://youmightnotneedjquery.com/).

However, everyone uses it as good programmers are lazy!

**The jQuery Documentation is really good**

The documentation on [jQuery's website](http://code.jquery.com/) is really good. It has great examples.