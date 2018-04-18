---
title: Sass with Gulp
type: lesson
duration: '1:30'
creator:
    name: Alex Chin, Rane Gowan
    city: London
competencies: Server Applications, HTML & CSS
---

# Express SASS with Gulp

### Objectives
*After this lesson, students will be able to:*

- Understand the difference between SASS and SCSS
- Understand why SASS is useful
- Become familiar with some of the SASS syntax

### Preparation
*Before this lesson, students should already be able to:*

- Write CSS
- Write HTML


## Intro to SASS/SCSS - (10 mins)

[i]: Install the Sublime/Atom package SASS (cmd+shift+p)

- `language-sass` in Atom

[SASS](http://sass-lang.com/) stands for **Syntactically Awesome Style Sheets**.

CSS on its own can be fun but stylesheets are getting larger, more complex, and harder to maintain.

Sass is a CSS pre-processor with syntactic advancements. Stylesheets in the advanced syntax are preprocessed by the program, and turned into regular CSS stylesheets.

**Sass can be used in three ways:**

1. Command-line tool
2. Standalone Ruby gem
3. Plugin for any Rack-enabled framework, including Sinatra and Ruby on Rails.
4. Gulp plugin

The main GUI's for Sass are:

- [CodeKit](http://incident57.com/codekit/) (Paid)
- [Compass.app](http://compass.kkbox.com/) (Paid, Open Source)   
- [Hammer](http://hammerformac.com/) (Paid)
- [Koala](http://koala-app.com/) (Open Source)   
- [LiveReload](http://livereload.com/) (Paid, Open Source)  
- [Mixture](http://mixture.io/) (Paid)  
- [Prepros](http://alphapixels.com/prepros/) (Paid, Open Source)  
- [Scout](http://mhs.github.io/scout-app/) (Open Source)  

### What is a pre-processor?

Once you save your SASS file, the gem will take your pre-processed file and use the SASS Engine to save it as a normal CSS file that you can use in your web site.

You put in SASS and you get out -> CSS.

### Why do we use SASS?

SASS helps us write CSS in a cleaner, faster and more organized way. It also has very nice features that help us reuse code and thus write DRYer CSS documents.
**When using Sass, you'll write more efficient and time-saving CSS.**

- Cleaner code
- DRYer code
- Faster to write

## SASS vs SCSS

Sass is an extension of CSS3, it has lots great features like:

- Nesting
- Variables
- Mixins
- Selector inheritance
- ...and more.

Confusingly, there are 2 Sass syntaxes:

- **SCSS** (Sassy CSS): newer syntax, inspired by CSS3.
- **SASS** (indented syntax): older version, similar to Haml.

The most commonly used syntax is known as "SCSS" (for "Sassy CSS"), and is a superset of CSS3's syntax. **This means that every valid CSS3 stylesheet is valid SCSS as well**. SCSS files use the extension **.scss**.

The second, older syntax is known as the indented syntax (or just ".sass"). Inspired by Haml's terseness, it's intended for people who prefer conciseness over similarity to CSS. Instead of brackets and semicolons, SASS uses the indentation of lines to specify blocks. Files in the indented syntax use the extension .sass.

### SASS vs SCSS syntax

The difference between `scss` and `.sass`.

One of the confusing thins between SCSS and SASS is that we usually use SCSS, but we call it SASS.

The difference between scss and sass. You can look at the docs and the toggle between SASS and SCSS.

#### SASS

```
nav
  ul
    margin: 0
    padding: 0
    list-style: none

  li
    display: inline-block

  a
    display: block
    padding: 6px 12px
    text-decoration: none
```

#### SCSS

```
nav {
  ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  li { display: inline-block; }

  a {
    display: block;
    padding: 6px 12px;
    text-decoration: none;
  }
}
```


## Look through the Documentation

Let's take a look at the [documentation](http://sass-lang.com/guide).

#### Nesting

Often when writing CSS, we'll have several selectors that all begin with the same thing. For example, you might have:

_Write on the board:_

```css
nav ul {
  margin: 0;
  padding: 0;
  list-style: none;
}

nav ul li {
  display: inline-block;
}

nav ul li a {
  display: block;
  padding: 6px 12px;
  text-decoration: none;
}
```

Having to repeat ourselves can bequite tedious, especially when our file gets very large.

SASS allows us to avoid this by nesting the child selectors within the parent selectors.

```scss
nav {
  ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  li { display: inline-block; }

  a {
    display: block;
    padding: 6px 12px;
    text-decoration: none;
  }
}
```

#### Variables `$`

Sass allows us to declare variables that can be used throughout our stylesheet.

Variables begin with `$` and are declared just like CSS properties. They can have any value that's allowed for a CSS property, such as colors, numbers (with units), or text.

#### Mixins @

Mixins are basically like functions in CSS.

Mixins are one of the most powerful SASS features. They allow re-use of styles – properties or even selectors – without having to copy and paste them, or move them into a non-semantic class.

The real power of mixins comes when we pass them arguments. Arguments are declared as a parenthesized, comma-separated list of variables. Each of those variables is assigned a value each time the mixin is used.

<br>

## Starter code

Lets take a look at the starter code

```bash
.
├── gulpfile.js
├── package.json
├── server.js
├── src
│   ├── js
│   │   └── app.js
│   └── scss
│       └── main.scss
└── views
    ├── index.ejs
    └── layout.ejs

4 directories, 7 files

```

We have a basic express app with a few ejs view templates.

### Gulpfile

We will be using the `gulp-sass` gulp package to compile our sass into css.

```js
const gulp        = require('gulp');
const babel       = require('gulp-babel');
const sass        = require('gulp-sass');
const nodemon     = require('gulp-nodemon');
const cleanCSS 	  = require('gulp-clean-css');
const uglify      = require('gulp-uglify');
const browserSync = require('browser-sync').create();

gulp.task('es6', () => {
  return gulp.src('src/js/*.js')
  .pipe(babel({ presets: ['es2015'] }))
  .pipe(uglify())
  .pipe(gulp.dest('public/js'));
});

gulp.task('sass', () => {
  return gulp.src('src/scss/**/*.scss')
  .pipe(sass().on('error', sass.logError))
  .pipe(cleanCSS({ compatibility: 'ie8'}))
  .pipe(gulp.dest('public/css'));
});

gulp.task('serve', ['es6', 'sass'], () => {
  browserSync.init({
    proxy: 'http://localhost:3000',
    files: ['public/**/*.*'],
    browser: 'google chrome',
    port: 7000,
    reloadDelay: 500
  });

  return nodemon({ script: 'server.js'})
    .on('start', () => browserSync.reload());
});

gulp.task('default', ['sass', 'es6', 'serve'], () => {
  gulp.watch('src/scss/**/*.scss', ['sass']);
  gulp.watch('src/js/*.js', ['es6']);
  gulp.watch('views/**/*.ejs', browserSync.reload);
});
```

The reason for this is because browsers cannot read `sass` so we will have to link to the compliled `css` version in the `public` directory in order for our styling to be rendered.

We are also using gulp to do some other cool things!

- `gulp-clean-css` to minify our css so it can be rendered quicker.
- `browser-sync` so we can make changes in our code and not have to refresh the browser to see them.
- `babel` which we have seen before (es6).
- `nodemon` to run a nodemon server through gulp.


## Let's start writing some SASS

First, inside `src/sass` create a new `_variable.scss` file.

```bash
$ touch src/sass/_variables.scss
```

**Note:** The Sass gulp task will convert any file inside this sass directory unless it's got an underscore in front of the filename.

The reason why we've created this file is that it's a good idea to abstract your variables away from all your other stylesheets. You must make sure that it is loaded first though.

So add this to our `style.scss` at the top:

```scss
@import "variables";
```

**Note:** You don't need to add the file extension or the _ to the file name here.

#### Add a variable

In the `_variables.scss` file add:

```scss
$body-background-color: #f5f5f5;
```

Now in the `styles.scss` file you can change:

```scss
body {
  background: $body-background-color;
  font-family: Helvetica,Arial,sans-serif;
  font-size: 14px;
}
```

**Note:** You can use variables throughout any file that is required after, but not before.

Now looking inside the brower...

Nothing should change! If you have spelt something wrong, then you will see an error in your browser.

## Nesting

Using SASS, we can nest our elements within others in our stylesheet.

For instance, we want to target the "a" and "p" elements inside our footer div.

Let's look at the styling for the footer:

```scss
footer {
  width: 100%;
  height: 100%;
  background: #fff;
  padding: 1em 0;
}

footer p {
  color: rgba(0,0,0,0.5);
}

footer p a {
  color: #c69;
}

footer .date {
  color: #036;
}

footer ul.social_buttons li a.twitter {
  color: blue;
}

footer ul.social_buttons li a.fb {
  color: green;
}

footer ul.social_buttons li a.gplus {
  color: red;
}
```

With SCSS we can achieve this more efficiently.

Since, we've already defined a footer class earlier, let's nest the "a" element inside of it:

```css
footer {
  width: 100%;
  height: 100%;
  background: #fff;
  padding: 1em 0;
  p {
    color: rgba(0,0,0,0.5);
    a {
      color: #c69;
    }
  }
  .date {
    color: #036;
  }
  ul.social_buttons {
    li {
      a.twitter {
        color: blue;
      }
      a.fb {
        color: green;
      }
      a.gplus {
        color: red;
      }
    }
  }
}
```

## Using `&`

Even more targeted nested is also possible using SASS. Let's say we have defined a new class, ".date", and that this class is applied only to one of the "p" elements nested inside our footer.

```html
<footer>
  <p>
    Le Chinage, <a href="/">Home</a>.
  </p>
  <p class="date">
    &copy; 2015
  </p>
  <ul class="social_buttons">
    <li><a class="twitter" href="#">Twitter</a></li>
	 <li><a class="fb" href="#">Facebook</a></li>
	 <li><a class="gplus" href="#">Google+</a></li>
  </ul>
</footer>
```

The CSS would go from this:

```css
.date {
  color: #036;
}
```
To this SASS:

```scss
footer {
  width: 100%;
  height: 100%;
  background: #fff;
  padding: 1em 0;
  p {
    color: rgba(0,0,0,0.5);
    &.date {
      color: #036;
    }
    a {
      color: #c69;
    }
  }
  ul.social_buttons {
    li {
      a.twitter {
        color: blue;
      }
      a.fb {
        color: green;
      }
      a.gplus {
        color: red;
      }
    }
  }
}
```

The "&" allows us to target the parent "p" element inside that footer that has a "date" class. Without the "&", we would basically be applying to the "date" class on any elements nested inside the footer's "p" tags.

#### Another example of &:

Let's have a think about our list of social buttons in our html file:

```html
<ul class="social_buttons">
  <li><a class="twitter" href="#">Twitter</a></li>
  <li><a class="fb" href="#">Facebook</a></li>
  <li><a class="gplus" href="#">Google+</a></li>
</ul>
```

In our "styles.scss" file, we can refactor the scss for our social_buttons to be:

```scss
ul.social_buttons {
  li {
    a {
      &.twitter { color: blue; }
      &.fb { color: green; }
      &.gplus { color: red; }
    }
  }
}
```

Which is much DRYer! You are allowed to put these one properties on the same line.

**Note:** You would also use `&` when you were applying a hover style.

```scss
ul.social_buttons {
  li {
    a {
      &.twitter { color: blue; }
      &.fb { color: light-blue; }
      &.gplus { color: red; }
      &:hover { font-weight: 700; }
    }
  }
}
```

## Mixins

Now, let's have a closer look at the mixins we mentioned earlier.

Let's create a new css file called: `_mixins.scss`:

```bash
$ touch src/sass/_mixins.scss
```

Now we should import this after our `_variable.scss`:

```scss
@import "variables";
@import "mixins";
```

Remember that a mixin is like a function for scss. We can simply define a mixin in our stylesheet:

```scss
@mixin border-radius($radius) {
  -webkit-border-radius: $radius;
     -moz-border-radius: $radius;
      -ms-border-radius: $radius;
          border-radius: $radius;
}
```

It can take a parameter (`$radius`) which is a variable.

We can then use it at different places throughout the stylesheet:

```scss
main {
  padding: 1em;
  max-width: 320px;
  margin: 1em auto;
  background-color: #c69;
  color: #fff;
  @include border-radius(5px); /* and we're passing it the radius we want.*/
}
```

#### Mixin libraries

There are several Mixin libraries that you can use if you don't want to write your own mixins.

- [Bourbon](http://bourbon.io/)
- [Compass](http://compass-style.org/)

## Operators

We can also perform operations in our scss:

Lets' change:

```scss
main {
  max-width: 320px;
  padding: 1em;
  margin: 1em auto;
  background-color: #c69;
  color: #fff;
  @include border-radius(5px); /* and we're passing it the radius we want.*/
}
```

To be:

```scss
main {
  max-width: 320px * 2;
  padding: 1em;
  margin: 1em auto;
  background-color: #c69;
  color: #fff;
  @include border-radius(5px); /* and we're passing it the radius we want.*/
}
```

## Lighten and darken colours

And we can also manipulate colours:

```scss
main {
  max-width: 320px * 2;
  padding: 1em;
  margin: 1em auto;
  background-color: lighten(#c69, 20%);
  color: #fff;
  @include border-radius(5px); /* and we're passing it the radius we want.*/
}
```

## @Extend

This is one of the most useful but least used features of Sass. Using `@extend` allows you share a set of CSS properties from one selector to another. It helps keep your Sass very DRY. In our example we're going to create a simple series of messaging for errors, warnings and successes.

Add this to your html:

```html
<body>
  <div class="message">This is a message.</div>
  <div class="message success">This is a success message.</div>
  <div class="message error">This is a error message.</div>
  <div class="message warning">This is a warning message.</div>
```

Now let's create a new stylesheet specifically for `_errors.scss` and import it:

```bash
$ touch src/sass/_errors.scss
```

Then let's import the errors into our style.scss:

```scss
@import "variables";
@import "mixins";
@import "errors";
```

And these now add these styles to `_errors.scss`:

```scss
.message {
  border: 1px solid #fff;
  padding: 10px;
  color: #333;
}

.success {
  @extend .message;
  background: green;
}

.error {
  @extend .message;
  background: red;
}

.warning {
  @extend .message;
  background: yellow;
}
```

Now, let's take a look at the source generated by going into the browser and clicking view source and then clicking on `/sass/style.css`:

```scss
.message, .success, .error, .warning {
  border: 1px solid #fff;
  padding: 10px;
  color: #333;
}
```

So you can actually re-write the HTML code to be:

```html
<div class="message">This is a message.</div>
<div class="success">This is a success message.</div>
<div class="error">This is a error message.</div>
<div class="warning">This is a warning message.</div>
```

## Independent Practice (15 minutes)

> ***Note:*** _This can be a pair programming activity or done independently._

Convert the rest of the style.scss file to be as DRY as possible.

## Conclusion (5 mins)

SCSS knowledge is now an industry standard (or at the very least LESS). It's a really good skill to practise and it will actually help you to write better CSS.

Try to use it as much as possible for the rest of the course.