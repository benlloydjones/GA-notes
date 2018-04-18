# JavaScript Objects

### Objectives
*After this lesson, students will be able to:*

- Compare objects and key-value stores to arrays as data structures
- Explain the difference between object properties and methods
- Create empty objects and objects with multiple properties and methods using object literal syntax
- Compare adding and retrieving properties to an existing object using the dot and bracket notations
- Access properties of an object using keys and helper methods (.hasOwnProperty)
- Iterate over the keys of an object to return and manipulate values

### Preparation
*Before this lesson, students should already be able to:*

- Create and manipulate variables with javascript
- Use the chrome dev tools console

Objects in JavaScript
=====

## Opening

### What is an object?

* Objects are a type of data structure that is nearly universal across programming languages, although they may have different names in different languages
* Like arrays, objects can hold multiple pieces of data of varying types; but unlike arrays, objects use named keys rather than indices to order and access those pieces of data
* Objects in general are made up of two things – properties and methods. Properties are data attached to an object that describe it or are related to it in some way. Methods are just functions, but because they're attached to an object, you can think of them as actions that the object can invoke on itself
* In JavaScript, an object is a type of key-value store, or a way to group many pairs of keys and values together, so sometimes it's used like a hash (in Ruby) or a dictionary (in other languages)

Example: A car has properties, a type of engine, a color, a certain number of seats etc. Following the same logic, a JavaScript object may have **properties** and **values** for these properties.

Aside from the values `null` and `undefined`, **everything in JavaScript is an object**.

### Collections of name-value pairs

Javascript objects work as lists of keys (**A property name**) and corresponding values (**A property value**).

This way of storing/reading data is widely used across programs and languages because it’s highly customisable and quick to implement.

A key can be either a name, a number or a string, the corresponding value to a key can be any value part of JavaScript, including arrays, `null` or `undefined`and even another object. Objects structures can therefore be nested (objects inside objects) and of any complexity.

## Creating Objects

#### Object constructor

The [Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) constructor creates an object wrapper for the given value.

```javascript
const myObject = new Object();
```

#### Object literal syntax

This is also called an [object initializer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer).

This is equivalent to the syntax above, and is the one we use to create JSON objects.

```javascript
const myObject = {};
```

## Object Properties

Objects in JavaScript **always** have properties associated with them.

You can think of a property on a JavaScript object as a type of variable that contains a value. The properties of an object can be accessed using "dot notation":

```javascript
const person = {
  name: 'Gerry'
};

person.name
=> 'Gerry'
```

You can define or re-assign a property by assigning it a value using `=` as you would a normal variable.

```javascript
const person = {
  name: 'Gerry'
};

person.name
=> 'Gerry'

person.name = 'Alex';
person.name
=> "Alex"
```

## Creating an object with properties

We are going to create an object `classroom` that contains properties `name` and `campus`:

```javascript
const classroom = new Object();
=> undefined

classroom.name = 'WDI 2';
=> 'WDI 2'

classroom.campus = 'London';
=> 'London'

classroom
=> Object { name: 'WDI 2', campus: 'London' }
```

#### Bracket notation

There is another way to set properties on a JavaScript object.

```javascript
classroom['name'] = 'WDI 2';
classroom['campus'] = 'London';
```

This syntax can also be used to read properties of an object:

```javascript
console.log(classroom['name']);
=> 'WDI 2';

const property = 'campus';

console.log(classroom[property]);
=> 'London';
```

For more details see [MDN's Documentation on Property Accessors](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Property_Accessors).

#### Using a variable as a property

We can add previously defined variables to an object as properties:

```js
const name = 'Jayne';
const object = {
  name: name
};

object;
=> Object { name: "Jayne" }
```

With ECMA6 we can use property value sorthand to simplify this:

```js
const name = 'Adrianna';
const nationality = 'Polish';
const dob = '1990-10-10';

const person = { name, nationality, dob };

person;
=> Object { name: "Adrianna", nationality: "Polish", dob: "1990-10-10" };
```

#### Destructuring

The opposite of this is known as _destructuring_. We can create variables based on the properties of an object:

```js
const person = { name: 'Adrianna', nationality: 'Polish', dob: '1990-10-10' };
const { name, dob, nationality } = person;

name;
=> "Adrianna";

nationality;
=> "Polish";

dob;
=> "1990-10-10";
```

#### Deleting properties

If you want to delete a property of an object (and by extension, the value attached to the property), you need to use the [`delete`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/delete) operator:

The following code shows how to remove a property:

```js
const classroom = { name: 'WDI 2', campus: 'London', start: '1/1/2000' };
delete classroom.start;
classroom
=> Object { name: "WDI 2", campus: "London" }
```

## Object methods

As we've said before, the value of a property can be anything in JavaScript, means we can also attach functions to objects properties. When a function is attached to a property, this function becomes a `method`. Methods are defined the exact same way as a function, except that they have to be defined as the property of an object.

```javascript
const classroom = {
  name: 'WDI 2',
  campus: 'London',
  start: '1/1/2000',
  sayHello: function() {
    console.log('Hello');
  }
};
```

We can also use the following syntax with ES6:

```js
const classroom = {
  name: 'WDI 2',
  campus: 'London',
  start: '1/1/2000',
  sayHello() {
    console.log('Hello');
  }
};
```

To call the method, we add a pair of parentheses to execute it:

```js
classroom.sayHello();
=> "Hello"
```

#### Assigning a previously defined function

We can attach regular functions to objects as methods, even after they are created.

```js
function sayHello() { console.log('Hello'); }

classroom.sayHello = sayHello;

classroom.sayHello();
=> "Hello"
```

## `this` for object references

In JavaScript, `this` is a keyword that refers to the current object. When used in a method on an object, it will always refer to the current object.


```js
var classroom = {
  name: 'WDI 2',
  campus: 'London',
  start: '1/1/2000',
  classInfo() {
    console.log(`This is ${this.name} and the class starts on ${this.start}`);
  }
};

classroom.classInfo();
=> "This is WDI 2 and it starts on 1/1/2000"
```

#### Enumerating properties of an object

There are three native ways to list the properties of an object:

* **for...in loops** This method traverses all enumerable properties of an object and its prototype chain
* **Object.keys(o)**  This method returns an array with all the own (not in the prototype chain) enumerable properties' names ("keys") of an object o.
* **Object.getOwnPropertyNames(o)** This method returns an array containing all own properties' names (enumerable or not) of an object o.

**Loop over an objects properties**


You can use the bracket notation with for...in to iterate over all the enumerable properties of an object.

```javascript
const myCar = { make: 'Ford', model: 'Mustang', year: 1969 };

for (const key in myCar) {
  console.log(key, myCar[key]);
}

for (const key in myCar) {
  console.log(`myCar.${key} = ${myCar[key]}`);
}
```

> **Note:** See this section from [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_Objects#Creating_new_objects#Objects_and_properties)

## Comparing Objects

In JavaScript, if two objects are created separately, they are distinct, even if they are given the same properties.

```javascript
const student1 = { name: 'Chris' };
=> undefined

const student2 = { name: 'Chris' };
=> undefined

student1 == student2;
=> false

student1 === student2;
=> false

student1 === student1;
=> true
```

> **Note:** If you're confused by the difference between `==` and `===` review MDN's notes on [equality](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Comparison_Operators#Equality_()) and [strict equality](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Comparison_Operators#Identity_strict_equality_())

## Independent Monkey Exercise (20 minutes)

- Create a `monkey` object, which has the following properties:

  - `name (String)`
  - `species (String)`
  - `foodsEaten (Array)`

  And the following methods:

  - `eatSomething(thingAsString)` which adds a new item into the monkey's `foodsEaten` array.
  - `introduce`: returns a string introducing itself, including its name, species, and what it's eaten.

- Create 3 monkeys total. Make sure all 3 monkeys have all properties set and methods defined.

- Exercise your monkeys by retrieving their properties and using their methods. Practice using both syntaxes for retrieving properties (dot notation and bracket notation).

## Conclusion (5 mins)

We will use objects in JavaScript every day, and you will have plenty of time to practice creating and using objects in Javascript. There are a lot of resources available on the web for you to dive deeper, but the most detailed and understandable one is probably MDN.

- [JavaScript Reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- [Intro to Object-Orientated Javascript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript)
- [Objects in Javascript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_Objects)