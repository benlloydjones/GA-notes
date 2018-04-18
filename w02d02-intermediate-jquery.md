![ga_cog_large_red_rgb](https://cloud.githubusercontent.com/assets/40461/8183776/469f976e-1432-11e5-8199-6ac91363302b.png)

# Intermediate jQuery

### Learning Objectives:

- Explain how to setup click handlers in jQuery
- Explain some of the useful jQuery methods to select elements
- Explain how to add and remove elements from the DOM
- Explain how to iterate with jQuery
- Explain event delegation

<br>
---

### Timings:
| **Section** | **Timing** | **Summary** |
|-------------|------------|-------------|
| **Opening** | 10 mins | A quick recap of what we have covered in jQuery
| **We Do**: Event Handlers | 10 mins | Compare jQuery `.on()` with `addEventListener`
| **We Do**: `this` inside event handler callback | 10 mins | Have a look at `this` inside an event handler callback 
| **We Do**: Showing and hiding elements | 15 mins | Take a look at various ways of showing and hiding elements in jQuery  
| **We Do**: Adding DOM elements | 10 mins | A quick look at appending and prepending elements in jQuery     
| **We Do**: Alternative Selector Methods | 10 mins | Looking at useful methods that jQuery gives us to select DOM elements
| **We Do**: Iteration | 10 mins | A look at jQuery's each method 
| **We Do**: Event Delegation in jQuery | 10 mins | How to delegate events in jQuery         
| **Closure** | 10 mins | Summary of the lesson                           
| **Questions** | 10 mins | Any questions?

<br>
---

###Connection to a long term learning goal 

jQuery is a useful tool that makes doing a lot of things easier. It is an industry standard and WDI Students should be very comfortable using it.

<br>
---

###Before Class (Student Pre-work)

Students should have completed the Intro to jQuery lesson.

<br>
---

###Related Homework	

- Read some of the jQuery [documentation](http://api.jquery.com/)

<br>
---

Intermediate jQuery
=====

## Opening

We've had a look at how to get started using jQuery, how to include it in our projects and how to use basic CSS syntax to select DOM elements on the page. However, jQuery as a library can do many, many more things.

#### Starter code

[i]: Send over the starter code.

The starter code is basically a HTML grid. We're going to play with it and see what we can do with jQuery.

![jquery-grid](https://cloud.githubusercontent.com/assets/40461/8374236/17083bae-1bf4-11e5-8393-8dd3c7d494c2.jpg)

<br>

## We Do: Event Handlers

We're going to  start with looking at event handlers in jQuery. Let's remind ourselves of the event handler in pure Javascript, [`addEventListener`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener):

```javascript
var element = document.getElementById('id');
element.addEventListener("click", function() { /* Do something */ });
```

There is quite a lot to type here! Luckily jQuery provides us with an easier syntax to handle events.

**Note**: In addition, we already know that jQuery helps us to write code that works cross-browser. In this particular instance, this would be very helpful because `addEventListener` is not supported in IE8.

### Document Ready

Remember that jQuery gives us a cross-browser way of listening for the document to be ready before executing code, called [`.ready()`](https://api.jquery.com/ready/)?

Let's open `app.js` and add a document ready. Console log "Ready" when the document has loaded

```javascript
$(() => {
  console.log("Ready.");
});
```

### jQuery "on"

The jQuery [`.on()`](http://api.jquery.com/on/)  method attaches event handlers to the currently selected **set** of elements in the jQuery object. 

**Note**: The fact that you can attach event listeners to multiple items simultaneously is really helpful because you don't have to loop!

Let's add an example:

```javascript
$('li').on('click', function() {
  console.log('Clicked');
});
```

- `click` is the type of event, you can also have the same as pure javascript
- For a full list of web event types, please see the Mozilla [documentation](https://developer.mozilla.org/en-US/docs/Web/Events)
- `function` is an anonymous callback function. You can also use a named function.

#### Shorthand methods

There are a few shorthand methods for `.on()` events such as `.click()`, `.dbclick()`, `.hover()` etc...

- Check the [documentation](http://api.jquery.com/category/events/) for more shortcut methods

**Note**: People often mistake these methods as being deprecated in favour of `on` (or the other way around), this is not the case.

#### Test by clicking on a square

You can see that if you click on any of the `li` elements, the event hander is fired.

**Note**: As of jQuery 1.7, the .on() method provides all functionality required for attaching event handlers. For help in converting from older jQuery event methods, see: 

- [`.bind()`](http://api.jquery.com/bind/)
- [`.delegate()`](http://api.jquery.com/delegate/)
- [`.live()`](http://api.jquery.com/live/)

To remove events bound with `.on()`, see: 

- [`.off()`](http://api.jquery.com/off/). 

To attach an event that runs only once and then removes itself, see: 

- [`.one()`](http://api.jquery.com/one/).

<br>

## We Do: `this` inside event handler callback

Once we have a triggered an event, inside the callback the value of `this` will be the DOM element that fired the event. We often want to convert this DOM element into a jQuery object so that we can use further jQuery methods.

Using `this`, let's get some information about the `li` that we clicked:

```javascript
$('li').on('click', function() {
  console.log($(this).attr('class'));
});
```

However, we need to use `e.target` with arrow functions:

```js
$('li').on('click', (e) => {
  console.log($(e.target).attr('class'));
});
```

<br>

## We Do: Showing and hiding elements

Once we have a jQuery object to manipulate, jQuery provides us with lots of useful methods to do common UI tasks. One very common task that you will need to do is to show or hide elements (or content) based on a user's interaction. 

There are however some methods that people often get a little confused about as they appear to do quite similar things:

- [`.show()`](http://api.jquery.com/show/)
- [`.hide()`](http://api.jquery.com/hide/)
- [`.fadeIn()`](http://api.jquery.com/fadeIn)
- [`.fadeOut()`](http://api.jquery.com/fadeOut/)
- [`.remove()`](http://api.jquery.com/remove/)

#### Show/Hide

One common task would be to show or hide an element. Let's look at the jQuery method `.hide()` in jQuery 1.4.3 and above:

```javascript
.hide( duration [, easing ] [, complete ] )
```

- **duration**: A string or number determining how long the animation will run.
- **easing**: A string indicating which easing function to use for the transition.
- **complete**: A function to call once the animation is complete.

Change the previous code to be:

```javascript
$('li').on('click', function() {
  $(this).hide();
});
```

The matched elements will be hidden immediately, with no animation. This is roughly equivalent to calling `.css( "display", "none" )`, except that the value of the display property is saved in jQuery's data cache so that display can later be restored to its initial value. If an element has a display value of `inline` and is hidden then shown, it will once again be displayed `inline`.

#### Example

The `hide()` function takes a callback, which we can play with by doing:

```javascript
$('li').on('click', function() {
  const $element = $(this);
  $element.hide('slow', 'swing', () => {
    setTimeout(function(){
      $element.show();
    }, 1000);
  });
});
```

Here we are using the `setTimeout` api to delay a method call of `show` to re-display the element.

**Note**: `.show()` is roughly equivalent to calling `.css( "display", "block")`, except that the display property is restored to whatever it was initially. If an element has a display value of `inline`, then is hidden and shown, it will once again be displayed `inline`.

#### FadeIn/FadeOut

If you want to have a little more "animation", jQuery also has a method called `fadeOut()` which is similar to `hide()`. The opposite is `fadeIn()`.

```javascript
$('li').on('click', function() {
  const $element = $(this);
  $element.fadeOut("slow", function(){
    setTimeout(function(){
      $element.fadeIn('slow');
    }, 1000);
  });
});
```

**Note**: The `.fadeIn()` and `.fadeOut()` methods animate the opacity of the matched elements. 

#### Remove

We can also use the method `remove()` to completely remove an element from the DOM tree.

```javascript
$('li').on('click', function() {
  $(this).remove();
});
```

Similar to [`.empty()`](http://api.jquery.com/empty/), the `.remove()` method takes elements out of the DOM. Use `.remove()` when you want to remove the element itself, as well as everything inside it. In addition to the elements themselves, all bound events and jQuery data associated with the elements are removed. To remove the elements without removing data and events, use [`.detach()`](http://api.jquery.com/detach/) instead.

<br>

## We Do: Adding DOM elements

Sometimes in a dynamic web application, user-input is meant to trigger the addition or removal of content or functionality. Using jQuery, we can easily create new DOM elements and insert them into the DOM.

#### Append

Let's append the `li` to the end of the grid when a user clicks in it, with the jQuery method [`.append()`](http://api.jquery.com/append/):

```javascript
$('li').on('click', function() {
  $('.grid').append(this);
});
```

We're using `this`, which means we directly reference a DOM element. If we wanted to duplicate this element and append it, we could use the jQuery method [`.clone()`](http://api.jquery.com/clone/):

```javascript
$('li').on('click', function() {
  $('.grid').append($(this).clone());
});
```

We have now added a new element onto the end of the grid.

#### Prepend

Notice that the element we are adding is being added as the last element in our container element, `.grid`. We can use a similar method, [`.prepend()`](http://api.jquery.com/prepend/) if we wanted to add the element as the first element in the container.

```javascript
$('li').on('click', function() {
  $('.grid').prepend($(this).clone());
});
```

<br>

## We Do: Alternative Selector Methods

We're going to have a look at some alternative selector methods provided by jQuery:

- [`.parent()`](http://api.jquery.com/parent/)
- [`.children()`](https://api.jquery.com/children/)
- [`.siblings()`](http://api.jquery.com/siblings/)
- [`.next()`](https://api.jquery.com/next/)
- [`.prev()`](https://api.jquery.com/prev/)
- [`.closest()`](http://api.jquery.com/closest/)
- [`.parents()`](http://api.jquery.com/parents/)
- [`.find()`](http://api.jquery.com/find/)

#### Parent

In the previous example, we are using a selector `$('.grid')` to target the parent `ul` of the `li` that we clicked on.

jQuery helpfully gives us a few methods that allow us to do tasks like this without hardcoding values.

We can change the previous code, which relied on `$('.grid')` to use the jQuery method `.parent()`:

```javascript
$('li').on('click', function() {
  $(this).parent().append($(this).clone());
});
```

#### Children

We can also select all children of a particular parent using the method [`.children`](https://api.jquery.com/children/). This example is a little bit silly but:

```javascript
$('li').on("click", function() {
  const $lis = $(this).parent().children();
  $lis.each((i, li) => {
    $(li).fadeOut(300 * i+1);
  });
});
```

- First we select the `parent` of the `li` that we clicked
- Then we select all of that parent's child elements with `children`
- Then we loop through the array of these children
- And `fadeOut` the element
- ...setting the time as `300` multiplied by the item's index in the loop `+ 1` as the first index will be 0 and would therefore disappear instantly (`300*0 = 0`)

#### Siblings

We can also use the method `siblings` to select the clicked element's direct siblings.

```js
$('li').on('click', function() {
  const $lis = $(this).siblings();
  $lis.each((i, li) => {
    $(li).fadeOut(300 * i+1);
  });
});
```

#### Next & Prev

Two really useful methods that jQuery provides are the [`.next()`](https://api.jquery.com/next/) and [`.prev()`](https://api.jquery.com/prev/) methods.

`.next()` gets the immediately following sibling of each element in the set of matched elements. 

If a CSS selector is provided as an argument, it retrieves the next sibling only if it matches that selector.

```javascript
$('li').on('click', function() {
  $(this).next().fadeOut(300);
});
```

Or the opposite, `.prev()` gets the immediately preceding sibling of each element in the set of matched elements, optionally filtered by a selector.

```javascript
$('li').on('click', function() {
  $(this).prev().fadeOut(300);
});
```

#### Closest and Parents

The  and  methods are similar in that they both traverse up the DOM tree. The differences between the two, though subtle, are significant:

- [`.closest()`](http://api.jquery.com/closest/) looks at all ancestors, as well as the originating element, and returns the **first** match.
- [`.parents()`](http://api.jquery.com/parents/) looks at all ancestors, starting with the parent, and returns all matches.
- [`.parent()`](http://api.jquery.com/parent/) only looks at the immediate ancestor.

Let's look at an example:

```javascript
$('li').on('click', function(){
  $(this).closest('ul').css('width', '100px');
});
```

#### Find

Given a jQuery object that represents a set of DOM elements, the `.find()` method allows us to search through the descendants of these elements in the DOM tree and construct a new jQuery object from the matching elements. The `.find()` and `.children()` methods are similar, except that the latter only travels a single level down the DOM tree.

```javascript
$('body').find('li').css('background', 'grey');
```

<br>

## We Do: Iteration

Another extremly common task to do in Javascript is to iterate over a collection of objects or elements and do something to each of them.

Normally, we would need to write a `for` loop in pure Javascript. However, jQuery has a really usefule method [`.each()`](http://api.jquery.com/each/) that we can use instead.

Let's do something to each of our `li` elements when the DOM is ready:

```javascript
const $lis = $('li');
$.each($lis, function(index, element){
  $(element).slideUp(1000 * index+1);
});
```

Here we are using the jQuery method [`.slideUp()`](http://api.jquery.com/slideup/). See also, [`.slideDown()`](http://api.jquery.com/slidedown/) and [`.slideToggle()`](http://api.jquery.com/slidetoggle/). 

<br>

## We Do: Event Delegation in jQuery

Event delegation can be a confusing topic for those who are unfamiliar with the concept. But, luckily, it's really simple. Let's change our code back to:

```javascript
$('li').on('click', function(){
  $(this).parent().append($(this).clone());
})
```

What happens when we click on an element that we added by Javascript?! Let's think about it. 

- When the DOM loaded, we looked for all of the `li` elements 
- To each of those `li` elements we attached a click handler

**Question**: Was this new `li` in the DOM?

**Answer**: No!

So, we need to reattach a listener to any newly created elements. We can to this in two ways:

### Clone with events

We can clone an element **and** its event handlers by passing a boolean to the `.clone` method:

```javascript
$('li').on('click', function(){
  $(this).parent().append($(this).clone(true));
});
```

> **Note**: we can also clone the element's childrens events as well (deep clone with events) by passing a second boolean to the clone method:
> ```$(this).clone(true, true)```


### Event Delegation

With event delegation, we simply add a single event listener to an ancestor element. Then we specify what type of target element we want to look for.

```javascript
$('ul').on('click', 'li', function(){
  $(this).parent().append($(this).clone());
});
```

Then, when the user clicks on one of its child elements, an `li`, we only check to see if the target of the click was, in fact, an `li`. If it was, we proceed per usual.

### Advantages

- Only attach one event listener to the page, rather than five hundred (in our example)
- Dynamically created elements will still be bound to the event handler.

<br>

## Closure

There are lots of different things you can do with jQuery. Please read the documentation for more things you can do with this really powerful library!