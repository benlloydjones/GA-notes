![ga_cog_large_red_rgb](https://cloud.githubusercontent.com/assets/40461/8183776/469f976e-1432-11e5-8199-6ac91363302b.png)

# CSS Box Model and Positioning

### Objectives
*After this lesson, students will be able to:*

- Describe the difference between block, inline, and inline-block elements
- Adjust element spacing using padding and margin
- Create floating elements to position content removed from the standard document flow
- Explain the difference between and use cases of static, relative, fixed, & absolute positioning
- Create a page with multicolumn layout

### Preparation
*Before this lesson, students should already be able to:*

- Write basic CSS
- Write basic HTML
- Use the chrome console

### An Intro to The Box Model

All HTML elements can be considered boxes. Even if you see a circle, it's living within a box.

The CSS box model describes this principal - a box wraps around all HTML elements, and it consists of: margins, borders, padding, and the actual content.  This model allows us to place a border around elements and space elements in relation to other elements.

With CSS properties and values, it is possible to apply specific styles to each of these elements, and change the way they behave and/or display on the page.

### The Box Model and its components

> Note: Open up the `box-model-example.html` file in the browser to demo the next section.

Have a look at the screenshot below. Chrome provides us with tools that make it super easy to see the margin, border or padding an element has been given. By clicking on the element in the 'Elements' tab, or by hovering over it with the inspector tool, we can immediately see what's going on. The margin has an <span style="color:orange">orange</span> overlay, the border has a <span style="color:gold">yellow</span> overlay (not always that easy to see on darker colours), the padding has a <span style="color:green">green</span> overlay and the content is in <span style="color:blue">blue</span>. 

![CSS Box Model](http://i.imgur.com/aXdc7wB.jpg)

In the 'Styles' tab of the console we can also see a visual representation of the box model, annotated with values of each property for that particular element. Hovering over each part of the model will highlight the space taken up by that property in the DOM. 


![Box Model Diagram](http://i.imgur.com/obPbbtB.png)

From this diagram we can see that the element has been given a margin of **40px**, a border with a width of **5px** and padding of **20px**.

But what do these different layers mean, and how are they relating to one another?


* **Margin** - clears an area around the border; the margin does not have a background color, it is completely transparent

* **Border** - a border that goes around the padding and content; the border is affected by the background color of the box

* **Padding** - clears an area around the content; the space between the content and the border; the padding is affected by the background color of the box

* **Content** - The content of the box, where text and images appear

## Box Model Demo - Codealong (5 mins)

Let's write some code so that we can visualize what we're talking about.

- Create a new directory called `css-box-model`
- Navigate inside that directory
- Create html page called `index.html`
- Create a new directory called `css` 
- Create a file inside that directory called `style.css`
- Add some `html` boilerplate code
- Link your stylesheet in the `head` of the html

Let's add some HTML to our boilerplate:

```html
<body>
  <div class="box">CSS Box Model</div>
</body>
```

Now let's write some CSS:

```css
body {
  font-family: sans-serif;
}

.box {
  background-color: dodgerblue;
  font-size: 20px;
  font-weight: bold;
}
```

If we open up our `index.html` file in Chrome, we can see that there is white gap around the edges of the square - it isn't sitting flush up against the edge of the window. Open up the Chrome dev tools and click on the body tag in the elements tab.

![CSS Box Model Example](http://i.imgur.com/HZ6EEeB.png)

The orange that you can see going all the way around is a margin on the body tag, but if we didn't define this in our CSS then where is it coming from?

### Default Browser Stylesheets

The reason this happens is because browsers all have default stylesheets (known as user agent stylesheets) that are loaded in automatically, without us asking them to be. Default browser stylesheets tend to include styles for things like heading tags, paragraph tags, lists, forms, tables etc.

The result of this is not always desired, depending on the design we are trying to create, however they can be useful if a websites CSS fails to load (the horror!). If the developer that wrote the HTML has done it in a semantic way, e.g. used appropriate heading tags, the website should still be readable. 

One of the main issues with default browser stylesheets is that each browser has slightly different defaults, which means that our carefully designed site might look perfect in Chrome, but different in Firefox. One option is to include a [Reset CSS](http://cssreset.com/scripts/eric-meyer-reset-css/) stylesheet, which will remove all styles set by the browser, thus leaving you with a clean slate. However it means that all your heading tags will be the same size as your paragraph tags, and it is up to you as a developer to create a typographic hierarchy. 

The other option is to use [Normalize CSS](https://necolas.github.io/normalize.css/), which is a stylesheet that only changes properties that browser default stylesheets affect, and regulates them all so that your website will look the same in all browsers. 
 
In this instance we are going to include a Normalize CSS stylesheet, so that we keep the typographic styles but get rid of the margin on the `body`.

In the terminal run the following:

```bash
$ touch css/normalize.css
```

Navigate to the Normalize CSS website in the browser and copy and paste the CSS into your `normalize.css file`.

We need to link this file in the `head` of our `index.html`, but it is **very** important to remember to link it **above** your link to the `style.css` file. If you remember from the lesson on specificity, styles that are defined below other styles will take precedence, (if they have the same or higher values of specificity), therefore we need to link the Normalize CSS styles first, so that we can then override these with our custom styles later on.

This looks better now, the blue box is now sitting right in the corner of the screen.

### Layers of the Box Model

Let's get go into some more detail and practice with each of these elements of the box model.

#### Margin

The margin is the space around the element. The larger the margin, the more space between our element and the elements around it. We can adjust the margin to move our HTML elements closer to or farther from each other.

Let's start with our margins. Adjusting our margins not only moves our element relative to other elements on the page but also relative to the "walls" of the HTML document.

If you want to specify a particular margin, to a particular side, you can do it like this:

```css
.box {
  margin-top: /*some value*/
  margin-right: /*some value*/
  margin-bottom: /*some value*/
  margin-left: /*some-value*/
}
```

> Note: Demonstrate altering each of these values in the dev tools for the div selector.

You can also set an element's margins all at once: you just start from the top margin and go around clockwise (going from top to right to bottom to left). For instance,

```css
.box {
  margin: 20px 40px 20px 40px;
}
```

You can do top-bottom and side-side - let's add this to our css for now:

```css
.box {
  margin: 20px 40px;
}
```

You can even do top-side-bottom, and it will assume that the value you gave for the first side (the right hand side) will be the same for the left hand side). 

```css
.box {
  margin: 100px 40px 20px;
}
```

Finally, we can set the margin to be the same value for all sides like this:

```css
.box {
  margin: 40px;
}
```

#### Border

We've talked briefly about borders - the border is the edge of the element. It's what we've been making visible every time we set the border property.

Borders can be set in two ways, just like your margins and just like we've talked about previously.

Lets add some thick borders to our div:

```css
.box {
  background-color: dodgerblue;
  font-size: 20px;
  font-weight: bold;
  margin: 40px;
  border-width: 5px;
  border-color: navy;
  border-style: solid;
}
```

You can also set an elements border properties all at once (like we did with margin) by using the shorthand:

```
border: 5px solid navy;
```

#### Padding and Content

The padding is the spacing between the content and the border. We can adjust this value with CSS to move the border closer to or farther from the content.

Padding can be set in two ways, just like your margins.

```css
.box {
  padding-top: /*some value*/
  padding-right: /*some value*/
  padding-bottom: /*some value*/
  padding-left: /*some-value*/
  
  /*or*/
  
  padding: 20px 40px 20px 10px;
}
```

Lets add some padding to our `<div>` from the dev tools.

```css
.box {
  padding: 20px;
}
```

If we nudge this value up and down using the arrow keys we can see the space between the border and the content increasing and decreasing.

Update the `.box` styles in your CSS to include 20px of padding.

```css
.box {
  background-color: dodgerblue;
  font-size: 20px;
  font-weight: bold;
  margin: 40px;
  border: 5px solid navy;
  padding: 20px;
}
```

### Using the box-sizing property

A key thing to understand when it comes to the box model is how an elements height and width is calculated by default. 

In your CSS file add a width to your `.box` styles.

```css
.box {
  background-color: dodgerblue;
  font-size: 20px;
  font-weight: bold;
  margin: 40px;
  border: 5px solid navy;
  padding: 20px;
  width: 250px;
}
```

Now inspect the element with the inspector tool in Chrome. Notice that the width that pops up is 300px.

![CSS Box Model Example](http://i.imgur.com/TInPhX6.png)

If we set the width of div to be 250px, then where does the value of 300px come from?

```
5px border + 20px padding + 250px content + 20px padding + 5px border = 300px total
```

This is thanks to a CSS property called box-sizing. The following is an excerpt from [W3Schools](http://www.w3schools.com/cssref/css3_pr_box-sizing.asp), explaining what the box-sizing property does. 

> The box-sizing property is used to tell the browser what the sizing properties (width and height) should include.

> Should they include the border-box? Or just the content-box (which is the default value of the width and height properties)?

If the box-sizing property is set to content-box (which is default for all elements), when we give an element a width of 250px, the total width of that element is equal to 250px plus any padding and any border that the element has. 

If we want to make the element 250px wide in total, including padding and border, we can set the box-sizing property to be border-box.

At the top of our CSS file let's add the following:

```css
* {
  box-sizing: border-box;
}
```

The star selector means "add these styles to every element".

Using the inspector tool, check out the width of the element now. 250px! Much better.

But what is the benefit of using `box-sizing: border-box`? Think about it like this - if I want the `<main>` tag of my website to take up 960px exactly, but I also want to add some padding to that element, I will need to do some maths to work out the width I need give it. I will need to minus the padding from 960px, and then every time I update the padding I will also need to update the value of the width property. Annoying!

If I define the value of the box-sizing property to be border-box, we don't need to worry about that. I can set the width of the `<main>` tag to be 960px, and adjust the padding until I'm happy with the way it looks.

### Using the display property

> Note: Open up the `display-examples.html` file in the browser to demo the next section.

Now that we've looked at the basics of the box model, let's have a look at how it comes into play when we have multiple elements on the page.

If we duplicate the div so that we have three of them in our HTML we can see that even though three divs would fit next to each other, they automatically stack on top of each other. 

We can change all this with the first positioning property we'll learn, the `display` property and the four values we can use: inline, block, inline-block, and none.

* A **block** element has some whitespace above and below it and does not tolerate any HTML elements next to it. This makes the element a block box. It won't let anything sit next to it on the page and if no width is set it will expand naturally to fill its parent container. Examples of block elements are: `<p>`, `<div>`, `<form>`, `<header>`, `<nav>`, `<ul>`, `<li>`, and `<h1>`.

* An **inline** element has no line break before or after it. This makes the element sit on the same line as another element, but without formatting it like a block. It only takes up as much width as it needs (not the whole line). Inline places all your elements on a single line. The bad news is that it doesn't maintain their "box"ness. Inline elements will ignore top and bottom margin settings, but will apply left and right margins and any padding. They will also ignore width and height properties. Examples of inline elements are: `<a>`, `<span>`, `<b>`, `<em>`, `<i>`, `<cite>`, `<mark>`, and `<code>`.

* An **inline-block** element is placed as an inline element (on the same line as adjacent content), but it behaves as a block element (you can add padding etc.). This makes the element a block box but will allow other elements to sit next to it on the same line.

* If you assign **none** as the value of the display, this will make the element and its content disappear from the page entirely!

![Block vs. Inline](http://i.imgur.com/K3oqeFn.png)

To illustrate this, let's duplicate the div a few more times and add some new classes:


```html
<div class="box inline-block">CSS Box Model</div>
<div class="box inline-block">CSS Box Model</div>
<div class="box inline-block">CSS Box Model</div>

<div class="box block">CSS Box Model</div>
<div class="box block">CSS Box Model</div>
<div class="box block">CSS Box Model</div>

<div class="box inline">CSS Box Model</div>
<div class="box inline">CSS Box Model</div>
<div class="box inline">CSS Box Model</div>
```

Add the following CSS:

```css
.inline {
  display: inline;
}

.block {
  display: block;
}

.inline-block {
  display: inline-block;
}
```

By hovering over the elements with the inspector tool we can see that only the block and inline-block elements accept width, the margin-top and the margin-bottom, but they all accept the padding and the margin-left and margin-right.

![inline-block vs. block vs. inline](http://i.imgur.com/hnGg5W1.png)

In your CSS comment out the margin style and refresh your browser.

Notice the gap between the inline and inline-block elements. This happens because inline and inline-block elements are treated as if they are words sitting next to each other in a sentence, and therefore there is a gap between each 'word'. There are a few [hacks](https://css-tricks.com/fighting-the-space-between-inline-block-elements/) to get around this, such as using negative margin, however there is another option that uses floats, which we will cover a little later in this lesson. 

### Using the position property

Another CSS property, "position", can take `relative` or `absolute` values, among others.

For the next part of the lesson we are going to work with some new HTML. Comment out the divs we've been working with so far. And add the following:

```html
<main>
  <img src="http://fillmurray.com/400/400">
</main>
```

Underneath the image tag add some Lorem Ipsum inside `<p>` tags. Atom will generate you some Lorem Ipsum if you type "Lorem" and then hit the tab key.

Duplicate your paragraph 10 times.

In your CSS file add the following styles to the `<main>` tag:

```css
main {
  width: 800px;
  margin: 0 auto;
  border: 2px solid #333;
  padding: 10px;
}
```

Notice the value for the margin property here. By saying `margin: 0 auto` we are asking for the element to be given 0 margin top and bottom, and `auto` margin left and right. This will center our element on the page, by splitting the left and right margin equally. **This is one of the most common ways of creating a basic page layout, so take note!**

Unfortunately we can't ask the margin to be auto top and bottom - CSS isn't always our friend. There are ways to center something both horizontally and vertically - we will come on to those later. 

#### Relative Positioning

Declaring `position: relative` allows you to position the element top, bottom, left, or right relative to where it would normally occur. Let's add some CSS to our image.

```css
img {
  position: relative;
  top: 100px;
}
```

If we have a look in the browser we can see that the image has moved 100px down from where it would normally be. If you open your dev tools and inspect the styles of the element you can click this property on and off and see if move from it's original position to it's new position.

#### Static Positioning

HTML elements are positioned static by default. A "static positioned" element is always positioned according to the normal flow of the page and are not affected by the top, bottom, left, and right properties.

Again, the default positioning for all elements is static. This means that no positioning has been applied and the elements occurs where they normally would in the document.

You rarely explicitly declare `position: static` like this because it is the default.

#### Fixed Positioning

An element with fixed position is positioned relative to the browser window.  It will not move even if the window is scrolled, so a fixed positioned element will stay right where it is creating an effect a bit like the old school "frames" days.

Let's change the position of the image from relative to fixed, and add a 'top' value of 10px and a 'left' value of 10px;

```css
img {
  position: fixed;
  top: 10px;
  left: 10px;
}
```

As we scroll down the page, we can see that the image is fixed 10px from the top and 10px from the left of the corner of the browser window.

#### Absolute Positioning

Specifying `position: absolute` _removes the element from the flow of document_ and places it exactly where you tell it to be.

```css
img {
  position: absolute;
  top: 10px;
  left: 10px;
}
```

Unlike `position: fixed`, the image will move with the page as it scrolls, but it will stay exactly 10px from the top of the browser window and 10px in from the left. Also notice how the text does not wrap around the image. This makes the position property a poor choice for creating responsive layouts.

#### Combining Relative and Absolute Positioning

An element with "relative positioning" gives you the control to "absolutely position" children elements inside of it. This might not be obvious at first - that's probably because this isn't intuitive, at all. Let's look at an example.

![css position relative](https://i.imgur.com/LRd7lBy.png)

The relative positioning on the parent is what matters here. This what would happen if we forgot that:

![](https://i.imgur.com/0vGcPFL.png)

In this small example, it doesn't seem to matter much, but it really is a significant change.

⇒ The "absolutely positioned" elements are positioning themselves in relation to the body element, instead of their direct parent. So if the browser window grows, that element in the bottom left is going to stick with the browser window, not hang back inside, like it was the case in the previous example.

Don't worry if this doesn't make sense to you right now - we are going to do some practice with absolute and relative positioning.

Quite often you will want to position an element absolutely in relation to it's parent. Let's update our CSS so that our picture of Bill is positioned absolutely in relation to the `<main>` element.
 
In your CSS add `position: relative` to the styles for `main`.

```css
main {
  width: 800px;
  margin: 0 auto;
  border: 2px solid #333;
  padding: 10px;
  position: relative;
}
```

If we check in the browser we can see that the image is now positioned 10px from the top and 10px from the left of the `<main>` tag, instead of the browser window.

If we open up the dev tools, and remove `position: relative` from the block, we can see that the rectangle moves to the top right hand corner of the browser window. If you give an element `position: absolute` it will position itself in relation to it's most immediate parent with a position that is set to either relative, absolute or fixed, else it will position itself to the browser window. 

## Floats and Clears - Intro (10 min)

The float property specifies whether or not a box (or an element) should float; essentially, it determines whether text will be wrapped around the element.

<p style="text-align: center">
<img src='https://cloud.githubusercontent.com/assets/40461/8234489/3b61ef02-15d4-11e5-8864-435fb6e0c3cc.png'>
</p>

There are four valid values for the float property. "Left" and "right" float elements those directions, respectively. "None" (the default) ensures the element will not float and "inherit" which will assume the float value from that elements parent element.

#### Clear

All elements will float next to floated items until they are specifically cleared, using the `clear` property. In the diagram below notice how the `<footer>` is sitting next to the element that has been floated left, as it has not been cleared.

<p style="text-align: center">
<img src="https://cloud.githubusercontent.com/assets/40461/8234478/287c1156-15d4-11e5-9901-ba9090a5bf70.png">
</p>

### Using floats and clears to create columns

Update your CSS styles for your the `<img>` tag to be the following:

```css
img {
  float: right;
}
```

Refresh your browser and have a look at what happens. The text is now wrapping around the image, and the image has floated over to the right hand side. By adding `float: right` we are moving the element to the right but also saying "allow content to sit to the left of me". 

In your CSS change the value of the float property from `right` to `left`. Now we are saying "allow content to sit to the right of me". Even if the next element in the flow of the HTML is a block element it will sit next to a floated element. Add `margin-right: 20px` to the image to give the text some breathing room.

Go to your HTML and delete or comment out all but one of the paragraphs of placeholder text, and refresh your browser. What's going on! The `<main>` tag doesn't seem to want to 'contain' the floated image. This is because a floated element exists outside of the regular document flow, so the height of the `<main>` is determined instead by the height of the `<p>` tag.

If our `<main>` element didn't have a border it wouldn't matter as much, but if we want the border to sit nicely around all of our elements we will need to do a little bit of CSS trickery. 

In your CSS add `overflow: auto` to the styles for `main`:

```css
main {
  width: 800px;
  margin: 0 auto;
  border: 2px solid #333;
  padding: 10px;
  position: relative;
  overflow: auto;
}
```

Refresh the browser. Much better! But why does this work? If you define the `overflow` property of an element to be anything other than `visible` (the default), you establish a new Block Formatting Context. If you want to read more about what that means you can do so [here](https://www.w3.org/TR/CSS21/visuren.html#block-formatting). If you don't fancy reading about it you'll just have to embrace the magic!

#### Clearfix

There is another way of dealing with collapsing parent elements, that was mentioned in your pre-work. This is called the "clearfix" hack. If you google "clearfix" you will find lots of blog posts that talk about which is the "best" version. A lot of the time the version you use will depend on the browsers you need to support.

The following is one that is widely used. The idea is that you give any element you need to clear a class of 'clearfix', and an `:after` element will be added to the DOM which will clear all the floated elements and force the parent to contain it.

```CSS
.clearfix:after {
	content: "",
	display: table,
	clear: both
}
```  

#### Floats with clears

While floats make other elements aware of their location and get text hugs, clears make other elements aware and are told not to touch.

Let's add a `<footer>` element to our HTML, before the close of the `<main>` tag.

```html
<footer>Made with &hearts; at GA</footer>
```

Refresh the browser and notice how even though a footer is a block element, it is sitting up next to the image. If we want to tell the footer to sit below the image we can add the following to our CSS:

```
footer {
  clear: both;
}
```

When we say `clear: both` we are saying "I'm not sure how much space this element is going to take, but whatever it is, don't let anything sit on the left or right of me". Refresh the browser and your footer should now sit below the image.

Finally let's add some padding and text formatting to our footer.

```
footer {
  clear: both;
  padding-top: 10px;
  text-align: center;
}
```

Cool! Hopefully you can see how we can begin to create basic website layouts without too much code. 

## Conclusion (5 mins)

- Compare the elements of The Box Model - margin, border, padding, content.
- How do floats work with clears to create a multicolumn layout?
- Compare inline-block, block, and inline.