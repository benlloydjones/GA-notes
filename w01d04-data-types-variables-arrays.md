# Data Types, Variables and Arrays

### Objectives
*After this lesson, students will be able to:*

- Explain that you can use the Chrome console shell to play with Javascript
- Introduce the various Data Types
- Explain what arrays are and why they are useful
- Introduce some of the most useful array methods

## Opening (10 mins)

JavaScript is an object oriented dynamic language with types and operators, standard built-in objects, and methods. Its syntax comes from the Java and C languages, so many structures from those languages apply to JavaScript as well.

#### Chrome Console

For this lesson, we're going to use the Chrome Console shell.

Let's open up the console, `cmd+alt+j`.

## Data Types (10 mins)

Let's start off by looking at the building block of any language: the types. JavaScript programs manipulate values, and those values all belong to a type. JavaScript's types are:

> ***Primative Data Types:*** _A data type provided by a programming language as a basic building block_

> ***Composite Data Types:*** _A more complicated data type which can be compsosed of primative data types_

### Primative Data Types

- [`Number`](a)
- [`String`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
- [`Boolean`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)

### Composite Data Types

- [`Object`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- [`Function`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- [`Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
- [`Date`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- [`RegExp`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp)

### Special Data Types

* [`null`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/null)
* [`undefined`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined)

New in ECMAScript 6!

- [`Symbol`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol)

And there are some built-in [`Error`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) types as well. Things are a lot easier if we stick with the list above, though.

#### typeof()

To check if a variable is a certain type, we can use [`typeof()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof)

```js
typeof 37 === 'number';
=> true

typeof {} === 'object';
=> true

typeof null === 'object';
=> true

typeof function(){} === 'function';
=> true
```

## Numbers (10 mins)

Numbers in JavaScript are **"double-precision 64-bit format IEEE 754 values"**, according to the spec. This has some interesting consequences. There's no such thing as an integer in JavaScript, so you have to be a little careful with your arithmetic if you're used to math in C or Java. Watch out for stuff like:

```js
0.1 + 0.2;
=> 0.30000000000000004
```

In practice, integer values are treated as 32-bit ints (and are stored that way in some browser implementations), which can be important for bit-wise operations.

#### Arithmetic Operators

The standard [arithmetic operators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators#Arithmetic_operators) are supported, including addition, subtraction, modulus (or remainder) arithmetic and so forth.

```js
1 + 2;
=> 3

2 - 5;
=> -3

5 / 2;
=> 2.5

6 * 2;
=> 12
```

#### Math Object

There's also a built-in object called [`Math`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math) if you want to perform more advanced mathematical functions and constants:

```js
Math.sqrt(9);
=> 3

Math.round(9.5);
=> 10

Math.ceil(10.2);
=> 11

Math.floor(6.9);
=> 6

Math.PI
=> 3.141592653589793;

Math.random();
=> 0.7198309201452662;
```

### Converting Strings to Integers

#### parseInt()

You can convert a string to an integer using the built-in [`parseInt()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseInt) function. This takes the base for the conversion as an optional second argument, which you should always provide:

```js
parseInt('123', 10);
=> 123

parseInt('010', 10);
=> 10
```

If you want to convert a binary number to an integer, just change the base:

```js
parseInt('11', 2);
=> 3
```

#### parseFloat()

Similarly, you can parse floating point numbers using the built-in [`parseFloat()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseFloat) function which uses base 10 always unlike its `parseInt()` cousin.

```js
parseFloat('11.2');
=> 11.2
```

#### Unary operator

You can also use the unary `+` operator to convert values to numbers:

```js
+'42';
=> 42
```

### Assess

Ask the class, what will these return?

```js
parseInt('10.2abc', 10);
=> 10

parseFloat('10.2abc');
=> 10.2

+'10.2abc';
=> NaN
```

The `parseInt()` and `parseFloat()` functions parse a string until they reach a character that isn't valid for the specified number format, then return the number parsed up to that point. However the "+" operator simply converts the string to `NaN` if there is any invalid character in it.

#### NaN

A special value called [`NaN`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NaN) (short for "Not a Number") is returned if the string is non-numeric:

```js
parseInt('hello', 10);
=> NaN
```

**`NaN` is toxic**: if you provide it as an input to any mathematical operation the result will also be `NaN`:

```js
NaN + 5;
=> NaN
```

You can test for `NaN` using the built-in [`isNaN()`](ttps://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/isNaN) function:

```js
isNaN(NaN);
=> true
```

#### Infinity

JavaScript also has the special values [`Infinity`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Infinity) and `-Infinity`:

```js
1 / 0;
=> Infinity

-1 / 0;
=> -Infinity
```

You can test for `Infinity`, `-Infinity` and `NaN` values using the built-in [`isFinite()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/isFinite) function:

```js
isFinite(1/0);
=> false

isFinite(-Infinity);
=> false

isFinite(NaN);
=> false
```

## Strings (10 mins)

Strings in JavaScript are sequences of characters. More accurately, they are sequences of [Unicode characters](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Values,_variables,_and_literals#Unicode), with each character represented by a 16-bit number.

#### Length

To find the length of a string, access its [`length`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/length) property:

```js
'hello'.length;
=> 5
```

#### Wait, Strings have methods?!

There's our first brush with JavaScript objects! Did I mention that you can use strings like objects too?

Strings have other [methods](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String#Methods) as well that allow you to manipulate the string and access information about the string:

```js
'hello'.charAt(0);
=> "h"

'hello, world'.replace('hello', 'goodbye');
=> "goodbye, world"

'hello'.toUpperCase();
=> "HELLO"
```

There is no method for built-in capitalization. You would have to do:

```js
var greeting = 'hello';
greeting.charAt(0).toUpperCase() + greeting.slice(1);
```

#### String concatenation

The [`+` operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Arithmetic_Operators#Addition) also does string concatenation:

```js
'hello' + ' world';
=> "hello world"
```

If you add a string to a number (or other value) everything is converted in to a string first. This might catch you up:

```js
'3' + 4 + 5;
=> "345"

3 + 4 + '5';
=> "75"
```

**Note**: Adding an empty string to something is a useful way of converting it.

Also in ECMAScript6 it is now possible to use backtick notation to concatinate strings like so:

```js
var a = 'hello';
var b = 'world';
`${a} ${b}!`;
=> "hello world!"
```

## Null & Undefined (10 mins)

JavaScript distinguishes between:

- `null` a value that indicates a deliberate non-value
- `undefined` that indicates an uninitialized value — that is, a value hasn't even been assigned yet.

We'll talk about variables later, but in JavaScript it is possible to declare a variable without assigning a value to it. If you do this, the variable's type is `undefined`. `undefined` is actually a constant.

```js
var a;
=> undefined

a
=> undefined
```

## Booleans (10 mins)

JavaScript has a boolean type, with possible values `true` and `false` (both of which are keywords). Any value can be converted to a boolean according to the following rules:

#### All of the following become false when converted to a Boolean

- `false`
- `0`
- `''` (empty string)
- `NaN`
- `null`
- `undefined`

#### All other values become true when converted to a Boolean

You can perform this conversion explicitly using the `Boolean()` function:

```js
Boolean('');
=> false

Boolean(234);
=> true

Boolean('a');
=> true
```

However, this is rarely necessary, as JavaScript will silently perform this conversion when it expects a boolean, such as in an `if` statement (see below). For this reason, we sometimes speak simply of "true values" and "false values," meaning values that become `true` and `false`, respectively, when converted to booleans.

Alternatively, such values can be called **"truthy"** and **"falsy"**, respectively.

Boolean operations such as `&&` (logical _and_), `||` (logical _or_), and `!` (logical _not_) are supported.

## Variables (10 mins)

JavaScript's numeric operators are `+`, `-`, `*`, `/` and `%`.

#### Assignment Operators

Values are assigned using `=`, and there are also compound assignment statements such as `+=` and `-=`.

```js
var x = 1;
=> 1

x += 5;
=> 6
```

You can use `++` and `--` to increment and decrement respectively. These can be used as prefix or postfix operators.

#### Declaring variables

New variables in ECMAScript 6 are declared using either the [`var`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/var), [`let`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let), or [`const`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const) keyword:

```js
var a;
=> undefined

let b;
=> undefined
```

If you declare a variable without assigning any value to it, its type is `undefined`.

```js
const c;
=> Uncaught SyntaxError: Missing initializer in const declaration
```

However, attempting the same thing with `const` causes an error!

`const` as defines a constant, which means it **cannot** be re-assigned:

```js
var firstname = 'Alex';
=> undefined;
firstname = 'Mike';
=> "Mike"

const lastname = 'Chin';
=> undefined
lastname = 'Hayden';
=> Uncaught TypeError: Assignment to constant variable.
```

When deciding which keyword to use, always favour `const`. If you need a variable to change, use `let`. You should only use `var` if the other two are not suitable.

#### Global variables

It is not possible to define variables without `var`, `let` or `const`.

```js
x = 1;
=> 1
```

The above is a property assignment. First Javascript tries to resolve `x` against the scope chain. If it finds `x` anywhere in that scope chain, it performs an assignment; if it doesn't find `x`, **only** then does it create `x` property on a global object (**which is a top level object in a scope chain**).

```js
window.x;
=> 1
```

Now, notice that it doesn't declare a global variable, it creates a global property.

#### Block scope

An important difference from other languages like Java is that in JavaScript, **blocks do not have scope**; only functions have scope. (The block is delimited by a pair of curly brackets.)

```js
{
  statement_1;
  statement_2;
}
```

So if a variable is defined using `var` in a compound statement (for example inside an `if` control structure), it will be visible to the entire function.

However, with ECMAScript Edition 6, [`let`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let) and [`const`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const) declarations allow you to create block-scoped variables.

```js
// with let
var name = 'Mike';
{
  let name = 'Alex';
}

name;
=> 'Mike'
```

In the example above a new variable is created inside the if block which is only avaiable within the if block;


## Arrays (10 mins)

JavaScript arrays are used to store multiple values in a single variable.

#### Using the JavaScript Keyword new

One way of creating arrays is as follows:

```js
const a = new Array();
=> undefined

a[0] = 'dog';
=> "dog"

a[1] = 'cat';
=> "cat"

a[2] = 'hen';
=> "hen"

a
=> ['dog', 'cat', 'hen']

a.length;
=> 3
```

#### Using an Array Literal

A more convenient notation is to use an array literal:

```js
const a = ['dog', 'cat', 'hen'];

a.length;
=> 3
```

#### Length method

The `length` method works in an interesting way in Javascript. It is always one more than the highest index in the array.

So `array.length` isn't necessarily the number of items in the array. Consider the following:

```js
const a = ['dog', 'cat', 'hen'];
a[100] = 'fox';
a.length; // 101
```

**Remember**: the length of the array is one more than the highest index.

#### Getting from an array

If you query a non-existent array index, you get `undefined`:

```js
const a = ['dog', 'cat', 'hen'];
=> undefined

typeof a[90];
=> undefined
```

## Independent practise (40 mins)

Using Google to help you, solve the following problems:

> **Note:** When using Google, remember to add the language you are using. "How do I turn a string in to an array" is not as good as "How do I turn a string into an array with javascript"!

1. Turn a string into an array of words, using `String.split`:
	- `'Hi there, my name is Mike' => ['Hi', 'there', 'my', 'name', 'is', 'Mike']`

2. Get `World` from the string `'Hello World!'` using `String.substr`:
	- `'Hello World!' => 'World'`

3. Capitalize a word using a combination of `String.toUpperCase` and `String.substr`:
	- `roberto => 'Roberto'`

4. Convert a string to a number using `parseInt`
	- `'12' => 12`

5. Convert a decimal number to a string with 2 decimal places using `Number.toFixed`
	- `15.827993 => '15.82'`

4. Join two arrays of strings using `Array.concat`.
	- `['Mike', 'Emily'] ['Will', 'Ajay'] => ['Mike', 'Emily', 'Will', 'Ajay']`

5. Take an array of words and turn them into a string with pipes `|` between each word using `Array.join`.
	- `['cloud', 'house', 'mountain', 'field'] => "cloud|house|mountain|field"`

6. Make a new array of the 2nd and 3rd elements of an array using `Array.slice`
	- `['hippo', 'giraffe', 'lion', 'hyena'] => ['giraffe', 'lion']`

7. Find the index of the word "pizza" in the following array with  `Array.indexOf`.
	- `['salad', 'burger', 'pizza', 'soup'] => 2`

8. Sum the contents on an array of numbers using `Array.reduce`.
	- `[1,2,3] => 6`

9. Take an array of strings and turn it into an array of numbers indicating the length of each string using `Array.map`.
	- `['Los Angeles', 'New York', 'Huston'] => [11, 8, 6]`

10. Take an array of numbers and return only the ones that are divisible by 3. You will need `Array.filter` and the modulus `%` operator.
	- `[1,2,3,4,5,6,7,8,9,10] => [3,6,9]`

11. Order an array of strings alphabetically with `Array.sort`.
	- `['Mohammed', 'Katheryn', 'Aaron', 'Amanda'] => ['Aaron', 'Amanda', 'Katheryn', 'Mohammed']`

12. Turn an array of numbers into an array of strings using `Array.map` and `Number.toString`
	- `[5,10,15,20,25] => ['5','10','15','20','25']`

13. Convert a phrase to title case, using `String.split`, `Array.map`, `String.toUpperCase`, `String.substr` and `Array.join`
	- `'the wind in the willows' => 'The Wind In The Willows'`


## Conclusion (10 mins)

- Summary of the lesson.
- Any questions?