---
title: JavaScript `this`
type: lesson
duration: "1:25"
creator:
    name: Mike Hayden
    city: London
competencies: Programming, Server Applications
---

# JavaScript `this`

### Objectives
*After this lesson, students will be able to:*

- Explain what variables are and how they work
- Explain in a bit more detail what `this` means
- Learn a clear strategy to work out what `this` is

### Preparation
*Before this lesson, students should already be able to:*

- Understand how to write a function
- Understand how to declare a variable
- Understand that functions are first class objects


## Opening

What `this` is refers to in Javascript code, (`this` binding) is a constant source of confusion for the new JavaScript developer.

In this session we're going to take a deeper dive into what `this` is and why it's useful.

## How variables work

Before we get into this we need to understand exactly what variables (and arguments) are, and how they work.

#### Primitive data types

With _primitive_ data types, like strings and numbers, the value is allocated to the variable, a bit like a key/value pair. So in this sense we can say that the variable is like a container. It contains the data:

```js
let a = 10;
let b = a;

a = 11;

console.log(a);
=> 11

console.log(b);
=> 10
```

Here, because `a` refers to a primitive, when we define `b` it is also allocated the same value.

When we change `a`, it has no effect on `b`.

#### Composite data types

Let's look at a similar example with a more complex data type:

```js
let a = { name: 'Mike' };
let b = a;

b.name = 'Stephanie';

console.log(a); => { name: 'Stephanie' }
console.log(b); => { name: 'Stephanie' }
```

With _composite_ data types, like objects and arrays, the variable behaves like a pointer. It points to where the value is located in memory.

In the example above `a` and `b` are both pointing to the **same object**. We can access the object using either variable, so any change in that object will be seen using either variable.

## `this` is a pointer

`this` is a variable and because `this` is **ALWAYS** an object, it will behave like a pointer.

The thing that makes `this` confusing is that what it is pointing to depends on a few different factors.

#### Default

Let's start simple, with the default behaviour of `this`:

```js
this === window
=> true

function foo() {
  return this;
}

foo()
=> Window
```

By default, `this` points to the `window`. The `window` object is the edge of the universe for JavaScript, it is also how JS interacts with the browser.

#### Strict mode

If we add `'use strict';` at the top of our scripts, we tell the browser that we want to use a more strict set of rules when running our JavaScript files. This affects `this` very slightly when working with functions:

```js
'use strict';

this === window
=> true

function foo() {
  return this;
}

foo()
=> undefined
```

In strict mode, `this` in the functional scope is `undefined`. More on this later.


#### Implicit binding

When we call a function from the _context_ of an object, it is known as a **method**. When a method is called, `this` points to the `context`.

**Context** is a confusing word here, but very simply it means _the object that the method was called from_.

Let's look at an example:

```js
function foo() {
  return this;
}

const me = {
  name: 'Mike',
  foo: foo
}

foo();
=> Window

me.foo();
=> Object { name: 'Mike', foo: [function foo] }
```

When we call `foo` with no context, it returns the `window` (or `undefined` if we use strict mode).

When we call `foo` from the context of `me`, ie. `me.foo()`, `this` points to `me`.

This is known as _implicit_ binding. Where `this` points is _implied_ by the _context_.

A very common example of the use of implicit binding is with JavaScript event listeners:

```js
const btn = document.querySelector('button');
btn.onclick = function() {
  console.log(this);
}
```

In this example `this` is pointing to the button that was clicked.

#### Explicit binding

We can explicitly set where `this` is pointing using the methods `call` or `bind`.

##### Using `call`:

```js
function foo() {
  return this;
}

const me = {
  name: 'Mike',
  foo: foo
}

me.foo();
=> Object { name: 'Mike', foo: [function foo] }

me.foo.call(window);
=> Window
```

When we use `call`, we set what `this` points to **and** we call, or _invoke_ the function.

##### Using `bind`:

```js
function foo() {
  return this;
}

const me = {
  name: 'Mike',
  foo: foo.bind(window)
}

me.foo();
=> Window
```

With `bind`, we create a new function where `this` points to whatever we pass as the argument of `bind`.

## Overview of `this`

1. `this` is a variable
2. `this` always points to an object
3. Where `this` points is set **when a function is called**
4. When used in a function, `this` is the `window` (or `undefined` if we are using strict mode)
5. When called from the _context_ of an object, `this` points to that object
6. This can be _explicitly_ set using `call` or `bind`.


## Independent practise

Identify what `this` is pointing to in these examples:

```js
function foo() {
  return this;
}

foo();
```

**A:** `window`

```js
const obj = {
  bar() {
    return this;
  }
};

obj.bar();
```

**A:** `obj`

```js
const obj = {
  bar() {
    return this;
  }
};

const bat = obj.bar;

bat();
```

**A:** `window`

```js
function foo() {  
  function bar() {
    return this;
  }
  
  return bar();
}

foo();
```

**A:** `window`

```js
'use strict';

var obj = {
  foo() {  
    function bar() {
      return this;
    }
  
    return bar();
  }
}

obj.foo();
```

**A:** `undefined`

```js
'use strict';

function foo() {
  return this;
}

foo.call(this);
```

**A:** `window`;

```js
'use strict';

const objA = {};
const objB = {};

function foo() {
  return this;
}

objA.bar = foo.bind(objB);

objA.bar();
```
**A:** `objB`

