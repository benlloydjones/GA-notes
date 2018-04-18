---
title: ng-class & CSS animation
type: Lesson
duration: "1:25"
creator:
    name: Emily Isacke
    city: London
competencies: Front-end frameworks
---

# ng-class & CSS Animation

### Objectives
- Apply a CSS class using transition for subtle animation
- Implement keyframe animations

### Preparation
- Create a basic Angular app
- Be familiar with `ng-class`

## Intro (5 mins)

Angular is a super dynamic front-end framework, and one of the things you'll do most often when building a front-end is apply CSS classes to style elements on the page. Having the ability to change those styles based on data is really powerful and can enable you to make some really dynamic interface designs. You certainly have the skills to do this with plain-old logic, but Angular gives us a tool built for this purpose – `ngClass`. We have already had a look at `ngClass`, and the different ways we can implement it, and now we're going to look at how to combine this with CSS animations.

We're going to add some subtle animation to our design, including a sliding navigation, animated hover states and menu icon that changes from a burger to a cross when clicked. Little things like this can really boost the credibility of your design – if you use it well. We will be looking at two types of animation, _CSS transitions_ and _keyframe animations_. We will go into more detail as we move through the lesson, but here are some brief definitions of these two types of animation.

### CSS Transitions

Transitions work by updating a CSS property from one value to another when the transition is triggered. There are lots of ways of triggering a transition, such as on hover, when an element is active, checked or disabled. For example, you could decrease the opacity of a button when it's hovered over, and animate that change so that it's a gradual fade.

```css
button {
  transition: opacity 0.5s ease;
  opacity: 1;
}

button:hover {
  opacity: 0.7;
}
```

### Keyframe Animations

Keyframe animations are similar to transitions, in that they can be used to change properties from one value to another, but they differ in how they are defined. You define them by identifying the keyframes that make up your animation and giving that set of keyframes a name. Then, you can invoke those keyframes anywhere you want, using CSS selectors.

You can be much more granular in regards to timing with keyframe animations, and you can also animate multiple properties using one keyframe animation, for example, color, opacity and size.

```css
@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  80% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}
```

> **Note:** Demonstrate the solution code here, and point out the bits that we are going to look at, i.e the burger menu, the sliding menu, the hover states on the links and form submit button.

Open up the `starter-code` and run the following in the terminal:

```sh
npm i
atom .
gulp
```

## Setting a `<body>` class (15 mins)

Navigate to `http://localhost:7000` in Chrome and you should see the following:

![Home](http://i.imgur.com/kwTF8OV.png)

If you have a look at the `starter-code` in Atom, you should notice that we have `ui-router` already set up. If you navigate to `/about` and `/contact` in the URL bar, you will see the following:

![About](http://i.imgur.com/Fyp9T3y.png)

![Contact](http://i.imgur.com/gtLT9bl.png)

These correspond to the views that are found in `src/js/views`. If you remember from the demo of what we are building today, each of the pages on the site should have a different background color. This background color is added to the `<body>`, and we are going to give each page a different `<body>` class by listening out for a `ui-router` state change in the `MainCtrl`.  

Having a class on the `<body>` that changes depending on state is really useful, and you might want to use it in your projects, so make a note. Perhaps you only want a background image on certain pages, or want to hide an element on a particular page. By adding a dynamic body class, we are able to do this much more easily.

In `src/js/controllers/main.js` update the controller to be:

```js
angular
  .module('portfolioApp')
  .controller('MainCtrl', MainCtrl);

MainCtrl.$inject = ['$transitions'];
function MainCtrl($transitions){
  const vm = this;

  $transitions.onSuccess({}, (transition) => {
    vm.pageName = transition.$to().name;
  });
}
```

Here we are saying that every time we change state, we want to update the value of `vm.pageName` to be whatever the name of the state is that we are changing to, i.e the name we have given the state in `src/js/config/router.js`. This will either be 'home', 'about' or 'contact'. We can now use `ng-class` to add this value as a class to the `<body>`.

In `src/index.html` update the `<body>` tag to be:

```
<body ng-controller="MainCtrl as main" ng-class="main.pageName">
```

Open up the Chrome dev tools and inspect the body element. Depending on which page you are on, you should see that the body has a class of either 'home', 'about' or 'contact'. Finally we need to update the CSS to use these classes.

Change the following:

```css
body {
  background-color: grey;
}
```

To be:

```css
body {
  &.home {
    background-color: $pale-pink;
  }
  &.contact {
    background-color: $dark-pink;
  }
  &.about {
    background-color: $medium-pink;
  }
}
```

Nice! Now, when you switch between pages, you should see these new colours being used as the body background colours.

## Animated burger menu (30 mins)

Next we are going to work on the animated burger menu, which toggles between the three lines (burger) to a cross when clicked. Add the following HTML to the `index.html`, below the `<nav>` and above the `<main>`.

```html
<div class="menu">
  <div class="burger">
    <span></span>
    <span></span>
    <span></span>
    <span></span>
  </div>
</div>
```

The div with the "menu" class will make the circle, the div with the "burger" class will be centered inside the circle, and will hold the lines, and the spans will be styled to make up the icons (burger and cross). We will use CSS transitions to change the burger into the cross on click.

First of all we are going to create the white circle, and position it in the top right hand corner of the screen:

```css
.menu {
  position: fixed;
  top: 20px;
  right: 20px;
  height: 50px;
  width: 50px;
  background-color: white;
  border-radius: 50%;
  z-index: 3;
  box-shadow: 0px 3px rgba(0, 0, 0, 0.15);
  cursor: pointer;
}
```

Next we are going to position the "burger" div in the center, using the `@extend` to grab the `.centered-styles` class defined at the top of the file.

```css
.menu {
  position: fixed;
  top: 20px;
  right: 20px;
  height: 50px;
  width: 50px;
  background-color: white;
  border-radius: 50%;
  z-index: 3;
  box-shadow: 0px 3px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  .burger {
    width: 20px;
    height: 15px;
    @extend .centered-styles;
  }
}
```

To create the burger icon, we are going to add styles to the spans as follows:

```css
.menu {
  position: fixed;
  top: 20px;
  right: 20px;
  height: 50px;
  width: 50px;
  background-color: white;
  border-radius: 50%;
  z-index: 3;
  box-shadow: 0px 3px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  .burger {
    width: 20px;
    height: 15px;
    @extend .centered-styles;
    span {
      display: block;
      position: absolute;
      height: 3px;
      width: 100%;
      background: $pale-pink;
      border-radius: 3px;
      opacity: 1;
      left: 0;
      transform: rotate(0deg);
      transition: all .25s ease-in-out;
      &:nth-child(1) {
        top: 0px;
      }
      &:nth-child(2),
      &:nth-child(3) {
        top: 6px;
      }
      &:nth-child(4) {
        top: 12px;
      }
    }
  }
}
```

Note a few things here. The line `transition: all .25s ease-in-out` is saying that we want to add this transition to `all` properties of the spans, for example, the `top` property and the `transform` property. `.25s` is the amount of time the transition should happen over, and `ease-in-out` is the type of animation. You can read more about different types of animation [here](https://developers.google.com/web/fundamentals/design-and-ui/animations/the-basics-of-easing), and there is a useful tool that allows you to play around with the different types [here](https://matthewlein.com/ceaser/).

You should see something that looks like this:

![Imgur](http://i.imgur.com/RIrcbke.png)

We are now going to toggle a class ("open") on and off the "menu" div, which will allow us to apply different styles depending on whether or not the class is present.

In order to do this we will add an `ng-click` to the "menu" div, as well as an `ng-class` attribute:

```html
<div class="menu" ng-class="{ 'open': main.menuIsOpen }" ng-click="main.menuIsOpen = !main.menuIsOpen">
```

Here we are saying that each time you click on the menu div, the value of `main.menuIsOpen` will become the opposite of what it was before, i.e true if false, or false if true. This will toggle the class of "open" on the "menu" div.

Finally all we need to do is add some styles to the "menu" div when it has the "open" class.

```css
.menu {

  ...

  &.open {
    .burger {
      span {
        background-color: $pale-blue;
        &:nth-child(1) {
          top: 6px;
          width: 0%;
          left: 50%;
        }
        &:nth-child(2) {
          transform: rotate(45deg);
        }
        &:nth-child(3) {
          transform: rotate(-45deg);
        }
        &:nth-child(4) {
          top: 6px;
          width: 0%;
          left: 50%;
        }
      }
    }
  }
}
```

Test that this is working by clicking on the menu icon. You should see the following:

![Imgur](http://i.imgur.com/gz278xb.png)

When the "open" class is applied, the two lines that were sitting on top of each other in the middle, creating the middle burger line, rotate 45 degrees in opposite directions, and the top and bottom lines move to the center of the "burger" div, and collapse to be `0%` width. When we remove the "open" class, this is all reversed, and the spans are back to being rotated 0 degrees.

### Sliding navigation (15 mins)

Let's add the sliding navigation that you saw in the demo of the site. The majority of the SCSS has already been done and is in your `src/scss/style.scss` file, so let's add the HTML. Inside `index.html` add the following above the burger icon.

```html
<nav>
  <div class="left">
    <h2>My Portfolio</h2>
  </div>
  <div class="right">
    <div class="links">
      <ul>
        <li><a ui-sref="home" ui-sref-active="active">Home</a></li>
        <li><a ui-sref="about" ui-sref-active="active">About</a></li>
        <li><a ui-sref="contact" ui-sref-active="active">Contact</a></li>
      </ul>
    </div>
  </div>
</nav>
```

In Chrome you should see the following:

![Nav](http://i.imgur.com/RzNvjlo.png)

This is good, but we only want the navigation to appear when we've clicked on the menu button. We need to update the SCSS slightly, by changing the `left` value on the div with the class of left, and the `right` value on the div with the class of right in the `<nav>`. They should both change from `0` to `-50%`, which will move them out of the view.

```css
&.left {
  background-color: $medium-blue;
  left: -50%;
  h2 {
    @extend .centered-styles;
    font-size: 36px;
    color: rgba(0, 0, 0, 0.5);
  }
}
&.right {
  background-color: $pale-blue;
  right: -50%;
}
```

We can use the same `main.menuIsOpen` value to determine when to add the "open" class to the `<nav>`, so we should add the same `ng-class` attribute as we did to the menu icon.

```html
<nav ng-class="{ 'open': main.menuIsOpen }">
```

Finally we need to add styles to the nav if it has the class of "open".

```css
nav {

  ...

  &.open {
    > div {
      &.left {
        left: 0;
      }
      &.right {
        right: 0;
      }
    }
  }
}
```

Test to see that this is working in Chrome. Note that the smooth transition is coming from the following transition property that is being applied to the divs that are immediate children of the nav:

```
transition: all 0.5s ease-in-out;
```

In order for the menu to close again once the link is clicked, we need to update the `MainCtrl`, so that we set the value of `pageName` back to being false.

```js
MainCtrl.$inject = ['$transitions'];
function MainCtrl($transitions){
  const vm = this;

  $transitions.onSuccess({}, (transition) => {
    vm.pageName = transition.$to().name;
    vm.menuIsOpen = false;
  });
}
```

### Keyframe Animations (20 mins)

Next we are going to look at how to use keyframe animations to add a little bit of movement to our site. The first one we are going to add is a slight bounce to the navigation links on hover.

First we should define our animation and give it a name. We are going to call it `bounce`, but it could be anything. We can break keyframe animations down into what we want to happen, at what point during the animation.

In this instance, we are going to move the element up and down by a few pixels using the `transform` property.

```css
@keyframes bounce {
  0% {
    transform: translateY(0);
  }
  25% {
    transform: translateY(-2px);
  }
  50% {
    transform: translateY(1px);
  }
  75% {
    transform: translateY(-1px);
  }
  100% {
    transform: translateY(0);
  }
}
```

Now, to use the animation, we needed to add it to the styles for that element. We are going to add it to the `<a>` tags inside the "links" div, and say that we want it to last for `0.75s`.

```css
.links {
  @extend .centered-styles;
  ul {
    li {
      line-height: 1.5;
      a {
        font-size: 26px;
        color: white;
        display: block;
        &:hover {
          color: rgba(0, 0, 0, 0.5);
          animation: bounce 0.75s; // add here
        }
        &.active {
          color: white;
          opacity: 0.5;
          text-decoration: line-through;
          animation: none; // add here
        }
      }
    }
  }
```

We can also cancel the animation if the link is already active, by adding `animation: none`.

Finally we are going to add a subtle "pulse" animation to the contact form submit button. Let's first define the animation:

```css
@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.015);
  }
  100% {
    transform: scale(1);
  }
}
```

And them to use it, let's add it to the button styles in the form:

```css
button {
  @extend .form-styles;
  color: $pale-pink;
  box-shadow: 0px 3px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  &:hover {
    animation: pulse 1s infinite;
  }
}
```

Notice here that we can add `infinite` to our animation, which means that it will keep running as long as we hover over the button, unlike the links which once run the `bounce` animation once and then stop.

## Conclusion

We can use CSS transitions and keyframe animations without Angular, but hopefully you can see how simple and effective it can be to combine these with Angular and `ng-class`. Getting animation to look professional is tricky, so whilst it may be tempting to add lots of animations to your site, it is better to keep things subtle than to overdo it.