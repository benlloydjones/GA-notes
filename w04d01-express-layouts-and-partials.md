---
title: Express Partials and Layout
type: lesson
duration: '1:30'
creator:
    name: Alex Chin, Rane Gowan
    city: London
competencies: Server Applications
---

# Express Partials and Layout

### Objectives
*After this lesson, students will be able to:*

- Understand how to refactor your views using partials
- Understand how to use the `express-ejs-layouts`

### Preparation
*Before this lesson, students should already be able to:*

- How to create a basic Express application
- How to use the Express router

## DRYing up your views - (10 mins)

DRY is a very important software design pattern:

- **D**on't
- **R**epeat
- **Y**ourself

The opposite is WET:

- **W**rite
- **E**verything
- **T**wice

Obviously, as a codebase increases in size - you want to design your code so that it is as manageable as possible.

What you want to avoid is the scenario where you are changing some code and you have to look through lots of files to find all of the times where you have duplicated it.

## Creating a layout file

Let's have a look at the starter-code.

We're just using a basic app with a RESTful resource of books.

So far, we have used a few view files but in each of them we have added `<head>` code. This means that if we wanted to make a change to the the contents of `<head>`, we'd need to go through every file. This is not the best idea. This is not DRY.

Let's install a new npm module to help us fix this problem.

```bash
yarn add express-ejs-layouts
```

Now let's require that in `index.js`:

```js
const expressLayouts = require('express-ejs-layouts');
```

Now, we need to setup the middleware to use this package:

```js
// Use expressLayouts
app.use(expressLayouts);
```

### layout.ejs

What this package is going to do is look for a file (by default) called `layout.ejs`, before rendering your view file, and insert your view file into this layout. This means that anything that is consistent on every page (head, header etc) you can just include in one place.

Let's have a look at this and create the file:

```bash
touch views/layout.ejs
```

Into this file, let's copy the contents of our `home.ejs` file **except** the contents of `main`:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Express Layouts</title>
    <link rel="stylesheet" href="style.css">
  </head>
  <body>
    <header>
      <nav>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/about">About</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>
      </nav>
    </header>
    <main>
    
    </main>
    <footer>
      <h6>Made with &#9825; by General Assembly &copy;2016</h6>
    </footer>
  </body>
</html>

```

This is the bit of code that is repeated in all of our view files isn't it?

### yielding content

Inside the files:

- `home.ejs`
- `about.ejs`
- `contact.ejs`

Delete all of the content **EXCEPT** what is **INSIDE** the `<main>`.

Now go back to the `layout.ejs` and add this new tag inside `<main>`:

```ejs
<%- body %>
```

**Note:** We are using a `-` here and not a `=`. 

This tag is loading the contents of a view file into the layout file at this point.

Let's run this code. It should look exactly the same as it did! Except now, it is much more manageable.

## Partials

EJS allows us to work with partials even though it doesn't have native support for a layout file. 

Let's first move our header into a partial.

```bash
mkdir views/partials
touch views/partials/_header.ejs
```

Starting the filename with an underscore is a naming convention for partials.

Now let's cut all of the header code into that file. It should look like this:

```ejs
<header>
	<nav>
   		<ul>
      		<li><a href="/">Home</a></li>
         	<li><a href="/about">About</a></li>
         	<li><a href="/contact">Contact</a></li>
       </ul>
   </nav>
</header>
```

Now where that code was, we need to 'include' this file. We used to do this by writing:

```
<%- include ./partials/_header %>
```

Let's use it in `layout.ejs`:

```ejs
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>RESTful App</title>
  </head>
  <body>
    <%- include ./partials/_header %>
    <main>
      <%- body %>
    </main>
  </body>
</html>
```

We can also create one for the footer.


### <%-, <% or <%= 

All three of these syntaxes work:

```ejs
<%- include ./application/_header %>
<%- include("./application/_header") %>
<% include ./application/_header %>
```

However, if you try to use `<%=`:

```ejs
<%= include("./partials/_header") %>
```

You will see:

```html
<header> <nav> <ul> <li><a href="/">Home</a></li> <li><a href="/about">About</a></li> <li><a href="/contact">Contact</a></li> </ul> </nav> </header>
```

This is the RAW html. This is because `<%= code %>` escapes html by default. You can have a look at the docs [here](https://github.com/tj/ejs).

### Best Practise? 

Use this syntax as it's in the official documentation.

```ejs
<%- include ./partials/_header %>
```

## Commenting in EJS

You might have noticed that commenting in EJS is a little annoying.

To comment in EJS, you need to use:

```ejs
<%# code %>
<%#- code %>
<%#= code %>
```

So put a hash after the %.

## Conclusion (5 mins)

There are a few different templating languages other than EJS. You will probably come across them in different projects. [This](https://garann.github.io/template-chooser/) is quite a good website for selecting which one you might want to use.