![ga_cog_large_red_rgb](https://cloud.githubusercontent.com/assets/40461/8183776/469f976e-1432-11e5-8199-6ac91363302b.png)

# CSS Selectors Basics

### Objectives
*After this lesson, students will be able to:*

- Describe the syntactical and functional relationship between selectors, properties, and values
- Style all elements of a particular HTML element on a web page
- Describe the difference between class and id selectors
- Apply styles to specific elements by selecting elements with classes and ids
- Apply a set of styles to children of a specific class or tag
- Change the style of a specific element using an inline style


### Preparation

*Before this lesson, students should already be able to:*

- Write basic HTML
- Use a text editor
- Open the chrome console and inspect elements.

> Note: As instructors demonstrate different CSS properties, be sure to explain and point out the property being used.

## What is CSS? Intro (5 mins)

If HTML is a set of instructions telling the browser what to display, CSS tells it how to display it.

CSS stands for:

- **C**ascading
- **S**tyle
- **S**heet

It provides the browser with precise instructions on how to style each element we want displayed on the page and can affect the text format - like font, size, color - the size and position of various objects on the page, colors, spacial layouts, etc. There are literally hundreds of different properties we can use to style HTML elements on a webpage.

## Let's write some CSS - Codealong (20 mins)

Create a new folder with a HTML page:

```bash
$ mkdir css-basics
$ cd css-basics
$ touch index.html
$ atom .
```

First, add a basic HTML structure to your `index.html` file:

```html
 <!DOCTYPE>
 <html>
   <head>
	 <title>Intro to CSS</title>
   </head>
 <body>
 	<h1>Intro to CSS</h1>
 </body>
 </html>
```

#### Adding CSS

There are three different ways to use CSS to style your HTML:

- External style sheet
- Internal Style sheet
- Inline style

Let's take a look at each one.

#### Inline CSS

If you're looking to add a unique style for a single HTML element, you can use an inline style.  It can also be used to test different styles, initially, or for quick fixes, as it's much easier to change a single element on the page than to find and change the source CSS file.  

To use inline styles, add the style attribute to the relevant tag. The style attribute can contain any CSS property. The example shows us changing the HTML body's background to light grey:

```html
 <!DOCTYPE>
 <html>
   <head>
	 <title>Intro to CSS</title>
   </head>
   <body style="background: lightgrey">
     <h1>Intro to CSS</h1>
   </body>
 </html>
```


Open this HTML file in browser and let's see what we have - a light grey page!

Inline CSS has a lot of downsides, though, so try to avoid using it on your projects and during class.

#### Style Sheets

Style sheets can be written in your HTML (internal) or in a separate CSS file (external).  Whatever style sheet you use, the CSS syntax is the same. We build our CSS with a selector - usually the name of the HTML tag, a specific class of elements, or an element with a unique ID:

```css
selector {
  property_1: value_1;
  property_2: value_2;
}

```

Do not forget the curly brackets or the semi-colon after the value!

The last semi-colon can be omitted but it's optional.


#### Internal Style Sheets

If a _single page_ has a unique style, you could use an internal style sheet - these are defined and written in your HTML using the `<style>` element, inside the head section of an HTML page:

```html

 <!DOCTYPE>
 <html>
   <head>
   <style>
    body {
      background: black;
    }
   </style>
	 <title>Intro to CSS</title>
   </head>
 <body>
   <h1>Intro to CSS</h1>
 </body>
 </html>

```

Just like before, if you open the index.html with your browser, you'll notice the body background has changed. We've selected the body element and instructed the browser to color it black.


#### External Style Sheets

With just one file - your external style sheet - you can modify the styles of your entire website.  That's really powerful and helps keep your code organized and separate.

To link the stylesheet to the HTML file, inside the `<head>` tags, we need to add a self-closing `<link>` tag, indicating the type of relations (`rel="stylesheet"`) and the file path.  But first, let's create a css file within our css directory.

```bash
mkdir css
touch css/style.css

```

We often have a specific folder for stylesheets, as we can have several in one application, and we're doing that now with our `/css` folder.

Then we can move the CSS from our internal style sheet to our external style sheet and add the file path (`href="css/style.css"`) to our HTML file:

```html
<!DOCTYPE>
<html>
  <head>
    <title>Intro to CSS</title>
  <link rel="stylesheet" href="css/style.css">
  </head>
<body>
  <h1>Intro to CSS</h1>
</body>
</html>
```

And let's add some more html to our index.html:


```html
<!DOCTYPE>
<html>
  <head>
    <title>Intro to CSS</title>
  <link rel="stylesheet" href="css/style.css">
  </head>

  <body>
    <p>This is a paragraph</p>

    <div>This is a div</div>
    <div>This is another div</div>
  </body>
</html>
```


Now, let's add the CSS we had - plus some more - to our stylesheet file:

```css
body {
  font-family: sans-serif;
}

p {
  color: blue;
}

div {
  border-width: 1px;
  border-style: solid;
  border-color: black;
}

```

We have added a rule to the body tag that will change all of the text to have a san-serif typeface, and added rules that will change the color of all paragraph tags to have the font-color "blue" and add a 1px black border to each div on the page, since the selector targets the `<div>` elements.  Refresh your browser and check it out.

Luckily for us, CSS gives us some nice shortcuts that we'll go over throughout this lesson, and we can combine the `div` border styles into this:

```css
border: 1px solid black;
/*border-width: 1px;
border-style: solid;
border-color: black;*/
```

We can add the same styles to multiple elements by adding a comma between each one, before declaring the styles, like this:

```css
h1, h2 {
	color: pink;
}
```

This will make the h1 and the h2 elements pink.

Notice, we can comment out CSS with `/* your css */`.

## Differences between Classes and IDs - Demo (15 mins)

#### The Class Selector

The class selector finds elements with a specific class, and as an attribute, class allows us to target several elements that may share similarities. Note that:

- Classes are **NOT** unique
- You can use the same class on multiple elements
- You can use multiple classes on the same element
- You can select a class using `.class-name {}`

Watch me add some HTML to our index.html and then style those elements by selecting the classes associated with them:

```html
<!DOCTYPE>
<html>
  <head>
  <title>Intro to CSS</title>
  <link rel="stylesheet" href="css/style.css">
  </head>

  <body>
    <p>This is a paragraph</p>

    <div>This is a div</div>
    <div>This is another div</div>

    <div class="comment">
    	This div has a class
    </div>

    <div class="comment">
    	This div has a class
    </div>

    <div class="comment">
    	This div has a class
    </div>
  </body>

</html>
```

Now, for the style:

```css
body {
  font-family: sans-serif;
}

p {
  color: blue;
}

div {
  border: 1px solid black;
}

.comment {
	font-weight: bold;
	color: #da70d6; /* orchid */
}
```

There are some css colours that are predefined, and you can use the words `white`, `black`, etc. There are some more obsure ones (`BlanchedAlmond`, `PapayaWhip`). Here is a [link](http://www.colors.commutercreative.com/) to all 140+ of them.

Alternatively we can use a hex code, which looks like this: `#da70d6`. The six digits of a hex code are in fact three two-digit numbers, each representing the level of red, green and blue. There is also RGBA and HSL notations, which you can read about [here](http://www.w3schools.com/cssref/css_colors_legal.asp).

If you refresh the browser, you can see the updates.  The browser selects all elements on the page with the `comment` class and alters the font-weight and color.

#### The ID Selector

The ID selector uses the id attribute of an HTML tag to find one specific element. We can give any name we want to our ID attribute, besides the obvious reserved words, such as tag names, etc.

- An ID is **unique** within a page.
- You should use the id selector when you want to find a single, unique element.
- In the CSS document, you use a hashtag (#) to denote an ID

How about we try it out?  Altering the HTML:

```html
<!DOCTYPE>
<html>
  <head>
  <title>Intro to CSS</title>
  <link rel="stylesheet" href="css/style.css">
  </head>

  <body>
    <p>This is a paragraph</p>

    <div>This is a div</div>
    <div>This is another div</div>

    <div class="comment">
    	This div has a class
    </div>

    <div class="comment">
    	This div has a class
    </div>

    <div class="comment">
    	This div has a class
    </div>

    <div id="message">
    	This div has an id
    </div>
  </body>

</html>

```

And now the style:

```css
body {
  font-family: sans-serif;
}

p {
  color: blue;
}

div {
  border: 1px solid black;
}

.comment {
	font-weight: bold;
	color: #da70d6; /* orchid */
}

#message {
	font-style: italic;
	color: #800080; /*purple*/
}
```

Sweet!

> Note: Explain what happens when more than one element is referenced with the same ID and how we'll get into specificity later.

## Style using Classes and IDs - Independent Practice (10 mins)

Using what we've done in class, see how far you can get through these exercises in 10 minutes:

1. make an unordered HTML list of the following animals:  

	- mouse  
	- canary  
	- penguin  
	- salmon  
	- cat  
	- goldfish  
	- dog  
	- sheep  
	- parakeet  
	- tuna  

2. using CSS classes do the following:

	- underline all of the mammals
	- make all the birds italic
	- make all the fish bold

3. using IDs apply the following colors:

	- make the mouse grey
	- make the goldfish gold
	- make the sheep steelBlue

If you aren't how to do something, use Google, for example, "How to underline text using CSS".

#### Multiple classes and multiple elements - Codealong (10 mins)

You can also chain classes together, applying several classes to one element:

Let's add:

```html
<!DOCTYPE>
<html>
  <head>
  <title>Intro to CSS</title>
  <link rel="stylesheet" href="style.css">
  </head>

  <body>
    <p>This is a paragraph</p>

    <div>This is a div</div>
    <div>This is another div</div>

    <div class="comment">
    	This div has a class
    </div>

    <div class="comment">
    	This div has a class
    </div>

    <div class="comment">
    	This div has a class
    </div>

    <div id="message">
    	This div has an id
    </div>

    <p class="first">This paragraph has the first class</p>

    <p class="second">This paragraph has the second class</p>

    <p class="first second">This paragraph element has both classes!</p>
  </body>

</html>

```

Then, create two classes in the CSS:

```css
body {
  font-family: sans-serif;
}

p {
  color: blue;
}

div {
  border: 1px solid black;
}

.comment {
	font-weight: bold;
	color: #da70d6; /* orchid */
}

#message {
	font-style: italic;
	color: #800080; /*purple*/
}

.first {
  color: green;
}

.second {
  font-size: 30px;
}
```

If we want to add specific styles to elements that possess two classes specifically, we can chain the selectors like this:

```
.first.second {
  /* Styles here */
}
```

This targets elements that have both the `first` and the `second` class.

As we can imagine, the possibilities are endless. There are many properties and values to work with and many ways to target specific elements. Two pages could have the same HTML content, and yet look dramatically different due to different CSS stylesheets.

We can even use classes/IDs with elements to select and style HTML. Lets add a short unordered list:

```html
<!DOCTYPE>
<html>
  <head>
  <title>Intro to CSS</title>
  <link rel="stylesheet" href="style.css">
  </head>

  <body>
    <p>This is a paragraph</p>

    <div>This is a div</div>
    <div>This is another div</div>

    <div class="comment">
    	This div has a class
    </div>

    <div class="comment">
    	This div has a class
    </div>

    <div class="comment">
    	This div has a class
    </div>

    <div id="message">
    	This div has an id
    </div>

    <p class="first">This paragraph has the first class</p>

    <p class="second">This paragraph has the second class</p>

    <p class="first second">This paragraph element has both classes!</p>

    <ul>
        <li class="same">This li is the same</li>
        <li class="same">This li is the same</li>
        <li class="same">This li is the same</li>
        <li class="same" id="different">This li is different</li>
    </ul>

  </body>

</html>
```

Imagine, we wanted a particular style to apply to all of the elements from the list but wanted other particular styles to apply to each item, individually. Definitely doable. Take a look at our CSS:

```css
body {
  font-family: sans-serif;
}

p {
  color: blue;
}

div {
  border: 1px solid black;
}

.comment {
	font-weight: bold;
	color: #da70d6; /* orchid */
}

#message {
	font-style: italic;
	color: #800080; /*purple*/
}

.first {
  color: green;
}

.second {
  font-size: 30px;
}

.first.second {
  text-decoration: underline;
}

li {
  text-align: center
}

li.same {
  font-size: 20px;
}

li#different {
  font-weight: bold;
}
```

Now, all our list items are centered, and because they all have the class of `same` they have a font size of 20px, but because the last one also has an id of `different`, it also gets a font weight of bold.

Notice here that we have combined an element selector with a class/id selector, for example `li.same`, which means *"add these styles to a `<li>` tag with the class of `same`"*.

If we wanted to target an element that is specifically inside another element, that's no problem either.

Add the following to your html:

```html
<div>
  <p>This is a paragraph inside a div</p>
</div>

```

And in your css:

```css
div p {
  color: tomato;
}
```

The space between the `div` and the `p` means that the selector is looking for a `<p>` tag inside a `<div>`.


## Specificity in CSS - Intro (10 mins)

One of the most important concepts with CSS is specificity. Imagine you select an element by it's class and give it some style; then, on the next line, you select the same element by it's element name and it's ID - how does the browser know what style to apply?  Well, every element gets a score and it's this score that dictates what CSS property is applied.

[Specificity Calculator](http://specificity.keegan.st/)

Every selector has its place in the specificity hierarchy, and if two selectors apply to the same element, the one with higher specificity wins.  Overall, there are four distinct factors that define the specificity level of a given selector: inline styles, IDs, classes+attributes and elements.  You can calculate CSS specificity with CSS Specificity Calculator:

<img src="https://css-tricks.com/wp-content/csstricks-uploads/specificity-calculationbase.png" />

### Calculating specificity

<img src='https://css-tricks.com/wp-content/csstricks-uploads/cssspecificity-calc-1.png' />

*This is calculated as 113*

<img src='https://css-tricks.com/wp-content/csstricks-uploads/cssspecificity-calc-2.png' />


*This is calculated as 23*

<img src='https://css-tricks.com/wp-content/csstricks-uploads/cssspecificity-calc-4.png' />

*This is calculated as 1000*

A couple of rules to think about:

- If two selectors apply to the same element, the one with higher specificity wins
- When selectors have an equal specificity value, the latest rule is the one that counts
- When selectors have an unequal specificity value, the more specific rule is the one that counts
- Rules with more specific selectors have a greater specificity
- The last rule defined overrides any previous, conflicting rules
- The embedded style sheet has a greater specificity than other rules
- ID selectors have a higher specificity than attribute selectors
- You should always try to use IDs to increase the specificity
- A class selector beats any number of element selectors

_Taken from SmashingMagazine.com_

> Note: Read through these briefly with students but ask students to review on their own [here](http://www.smashingmagazine.com/2007/07/css-specificity-things-you-should-know/)


## Practising with specificity

Before we finish this lesson, let's have a look at specificity in action.

Create an unordered list of the following characters:

```html
<ul>
  <li class="character">Kylo Ren</li>
  <li class="character">Han Solo</li>
  <li class="character">Rey</li>
  <li class="character">Finn</li>
  <li class="character">Poe Dameron</li>
</ul>
```

In the CSS let's add:

```css
.character {
  color: purple;
}
```

We can see that all the lis have turned purple as they all have a class of `character`.

If we wanted to override the color for Rey, we could add a `female` class to her li, and in the CSS add the following:

```css
.character {
  color: purple;
}

.female {
  color: red;
}
```

This `.female` style has the same specificity as the `.character` above, but thanks to the rules of Cascading Style Sheets, it will override that style because it comes afterwards. If we switch these styles around, we can see that the `.character` style will override the `.female` style.

Open up the Chrome console and inspect the list. If you click on Rey's li you will be able to see that the `color: purple` that is coming from the `.character` style has been crossed out, and the style from `.female` is being used instead. The Chrome inspector will be incredibly useful for this type of bug fixing, as you will be able to see exactly where the styles are coming from for each particular element.

Let's have a look at how ids affect specificity. Give Poe an id of `pilot`, and in the CSS add:

```css
#pilot {
  color: blue;
}
```

We can see that his li has turned blue. It doesn't matter where in the style sheet we put this code, it will always override the styling coming from the `character` class, as an id has a higher specificity value than a class. This is one of the reasons why you should avoid using ids as much as possible for styling purposes, and stick to classes or combinations of classes; if you need to override a style it is harder to do if that style is coming from an id.

Finally let's look at combining an element selector with a class selector.

In your CSS add:

```css
li.character {
  color: green;
}
```

Having these two selectors together gives us a higher specifity value than a single class will give, so no matter where on the page it is placed it will override the `.character` styles and the `.female` styles, but Poe's `pilot` id still wins.

If you are ever styling and getting frustrated that the styles you expect to see are not appearing in the browser, make sure that you open up the Chrome console and inspect the element to check if your style is being overridden by something more specific.

## Conclusion (5 mins)

CSS can be really fun or a total nightmare. You have to remember a few rules, but once you have them mastered, it's great to see your webpage come to life as you imagined.

- Describe the differences between classes and IDs.
- Identify the popular CSS properties we used today.
- What are the use cases for inline styling vs. internal/external style sheets?