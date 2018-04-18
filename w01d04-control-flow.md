# Mastering Control Flow

### Objectives
*After this lesson, students will be able to:*

- Differentiate between true, false, 'truth-y', and 'false-y'
- Use if/else if/else conditionals to control program flow based on boolean conditions
- Use switch conditionals to control program flow based on explicit conditions
- Use comparison operators to evaluate and compare statements
- Use boolean logic (!, &&, ||) to combine and manipulate conditionals

### Preparation
*Before this lesson, students should already be able to:*

- Create Variables in javascript
- Use a text editor

## Logical operators and control flow (10 mins)

JavaScript supports a compact set of statements, specifically control flow statements, that you can use to incorporate a great deal of interactivity in your application.

#### Block Statements

Statements meant to be executed after a control flow operation will be grouped into what is called a **block statement**. These statements are wrapped into a pair of curly braces:

```js
{
  console.log("hello");
  console.log("roar");
}
```

#### Block scope

We've seen that the scope in JavaScript changes often. In the case of **block statements**, scope is created but only with `let` and `const`.

```js
let name = 'gerry';
{
  let name = 'jay';
}
console.log(name); // outputs gerry
```

## Conditional statements (10 mins)

Conditional statements are a way of essentially skipping over a block of code if it does not pass a boolean expression. JavaScript supports two conditional statements: `if`...`else` and `switch`.

#### if...else statement

`if(expr) { code }`

... means run the `code` block if `expr` is `true`

```javascript
if (1 > 0) { console.log('hi') }
//=> hi
```

When you need to test more than one case, you may use `else if`:

```javascript
let name = 'kittens';
if (name === 'puppies') {
  name += '!';
} else if (name == 'kittens') {
  name += '!!';
} else {
  name = '!' + name;
}
name === 'kittens!!'
//=> true
```

#### Ternary Operator

JavaScript has a ternary operator for conditional expressions. You can think about the ternary operator as a concise "if-else in one line":

```javascript
const age = 12;
//=> undefined

const allowed = (age > 18) ? 'yes' : 'no';
//=> undefined

allowed;
//=> "no"
```

## Truthy & Falsy (10 mins)

#### All of the following become false when converted to a Boolean

- `false`
- `0`
- `''` (empty string)
- `NaN`
- `null`
- `undefined`

#### All other values become true when converted to a Boolean

There is a simple way of verifying the thruthyness or falsiness of a value. When you add `!` in front of a value, the returned value will be the inverse of the value in a boolean. So if you add two `!` then you'll get the boolean value of the original one:

```javascript
!!1
//=> true

!!0
//=> false

!!-1
//=> true

!![]
//=> true

!!{}
//=> true

!!null
//=> false

!!""
//=> false
```

## Boolean/Logical Operators (5 mins)

[Logical operators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_Operators)

Logical operators will always return a boolean value `true` or `false`.

There are two "binary" operators that require two values:

- **AND**, denoted `&&`
- **OR**, denoted `||`

A third "unary" operatory requires only one value:

* **NOT**, denoted `!`

#### && (AND)

The `&&` operator requires both left and right values to be `true` in order to return `true`:

```javascript
true && true
//=> true
```

Any other combination is false.

```javascript
true && false
//=> false

false && false
//=> false
```

#### || (OR)

The `||` operator requires just one of the left or right values to be `true` in order to return true.

```javascript
true || false
//=> true

false || true
//=> true

false || false
//=> false
```

Only `false || false` will return `false`

The `!` takes a value and returns the opposite boolean value, i.e.

```javascript
!(true)
//=> false
```

The `&&` and `||` operators use short-circuit logic, which means whether they will execute their second operand is dependent on the first. This is useful for setting default values:

```javascript
const otherName = '';
const name = otherName || 'Jay';
```

In this case, if the first operand `otherName` is _falsy_, then we'll see that `Jay` will be returned. If othername is _truthy_ (e.g. it contains a value), it will get returned, and the second expression won't even be evaluated.

## Comparison Operators (10 mins)

[Comparisons](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Comparison_Operators) in JavaScript can be made using `<`, `>`, `<=` and `>=`. These work for both strings and numbers. This is both useful, and can be the source of frustration for some developers, since most languages do not implicitly convert strings to numbers the way that JavaScript does.

```javascript
'A' > 'a';
//=> false

'b' > 'a';
//=> true

12 > '12';
//=> false

12 >= '12';
//=> true
```

#### Equality Operator `==`

Equality is a bit more complex. There are 2 ways in JavaScript to verify equality.

When verifying equality using double equal `==`, JavaScript does a lot of the "type coercion" in the background. Like we mentioned above, if the operands have a different type (ie: the number `1` and the string `"1"`), JavaScript will try to change the type of both operands to check whether they are equal. This means that a lot of times, expressions will return equal more easily than if we were stricter about what things were equivalent. Some examples:

```javascript
'dog' == 'dog';
//=> true

1 == true;
//=> true
```

#### Equality Operator `===`

To avoid type coercion and measure equality more strictly, **use the triple-equals operator**. Because `===` more truly measures actual equality, we'll use this far more often when checking whether too things are, in fact, the same thing.

> **Note:** "Sameness" and "equality" have various definitions and can be somewhat "fuzzy". They can also differ by programming language. Because you'll often be measuring whether two things are equal, you should investigate the way this works carefully.

Some examples:

```javascript
1 === true;
//=> false

true === true;
//=> true

'hello' === 'hello';
//=> true
```

However, there are some incidents when it does not do what we expect, for example when working with empty objects or arrays:

```javascript
{} === {}
//=> false

[] === []
//=> false

[1,7] === [1,7]
//=> false
```

**Explanation**

The examples in the second set fail equality tests because both **object literals** and **arrays** are objects, and not just "primitive" values like strings, numbers, and booleans. Objects and arrays are complex collections of values, and when we refer to them, we're actually referencing where they live in memory. That's why we call them "reference types," while things like strings and numbers are "value types."

What this means is that when we go to compare two objects or arrays with `===`, JavaScript doesn't care if they look like similar collections. It only compares whether or not they are the exact same object in memory. In each of the cases above, when checking for equality, we're actually comparing two objects that are in two different places in memory. They're not exactly "the same."

#### != and !==

There are also `!=` and `!==` operators, which are the negative versions of `==` and `===`.

## Switch Statement (5 mins)

The switch statement can be used for multiple branches based on a number or string:

```javascript
const food = 'apple';

switch(food) {
  case 'pear':
    console.log('I like pears');
    break;
  case 'apple':
    console.log('I like apples');
    break;
  default:
    console.log('No favourite');
}
//=> I like apples
```

In this case the `switch` statement compares `food` to each of the cases (`pear` and `apple`), and evaluates the expressions beneath them if there is a match. It uses `===` to evaluate equality.

The default clause is optional.

## While and Do-While (5 mins)

`while` is a loop statement that will run **while** a condition is true.

JavaScript has `while` loops and `do-while` loops. The first is good for basic looping, but there's a possibility it will never get run. Using a `do-while` loop makes sure that the body of the loop is executed at least once, because `while()` isn't evaluated until after the block of code runs.

```javascript
while (true) {
  // an infinite loop!
}
```

This should be enough to break a browser.

```javascript
let input = 0;
do {
  console.log(input++);
} while (input < 10);
```

## Iteration (10 mins)

Iterating is a way of incrementally repeating a task.

#### `for`

You can iterate over an array with:

```javascript
const a = [1, 2, 3, 4, 5];
for (let i = 0; i < a.length; i++) {
  console.log(i);
}
```

This is slightly inefficient as you are looking up the length property once every loop. An improvement is to chain the `let` assignment:

```javascript
const a = [1, 2, 3, 4, 5];
for (let i = 0, len = a.length; i < len; i++) {
  console.log(i);
}
```

Notice the placement of the comma and semi-colons.

#### `while`

It is also possible to iterate over an array with a while loop:

```js
const a = [1, 2, 3, 4, 5], len = a.length;
let i = 0;

while(i<len) {
  console.log(i);
  i++;
}
```

It is actually more efficient to loop over an array backwards:

```js
const a = [1, 2, 3, 4, 5];
let i = a.length;

while(i--) {
  console.log(i);
}
```

#### `forEach`

Another way of iterating over an array that was added with ECMAScript 5 is [`forEach()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach):

```javascript
['dog', 'cat', 'hen'].forEach(function(currentValue, index, array) {
   console.log(`I want a ${currentValue}`);
   console.log(currentValue, index, array);
});
```


## Fizz Buzz (15 minutes)

Fizz buzz is a game about division. Create a program that will iterate through numbers from 1 to 101 and log each number in the console.

- In the loop every time a number is divisible by **3**, instead of logging the number itself, the word "fizz" should appear.
- If the number is divisible by  **5**, the word "buzz" should be logged.
- If the number is divisible by both **3** and  **5**, then the word "fizzbuzz" should be logged.

Hint: Go read about the [Remainder Operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Arithmetic_Operators) on MDN and figure out how to use it to simplify this problem.

A typical output in the chrome dev tools would look like this:

<img src="https://i.imgur.com/avioQC8.png" width="400px">

#### Solution

```javascript
for (let i = 1; i < 101; i++) {

  if((i % 3 === 0) && (i % 5 === 0)) {
    console.log("fizzbuzz");
  } else if(i % 3 === 0) {
    console.log("fizz");
  } else if(i % 5 === 0) {
    console.log("buzz");
  } else {
    console.log(i);
  }
}
```

## Conclusion (5 mins)
These are some of the foundational tools you'll use in many of your applications. You'll probably need to refresh yourself on the exact syntax a few times before you memorize it, but it's important to be able to remember, these core "control flow" concepts, in general, because they'll come up in pretty much every progamming language you'll ever encounter.

- [Control Flow](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Control_flow_and_error_handling)
- [While](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/while)