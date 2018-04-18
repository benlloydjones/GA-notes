# Refactoring JavaScript

This lesson is designed to get across three key areas to refactoring code:

- Effective use of variables.
- Identifying areas of code that are clumsy or difficult to read and/or understand.
- Spitting code in to smaller, reusable functions.

The starter-code is a solution to Rock Paper Scissors with jQuery.

## Identifying issues with the code (30mins)

Generally speaking, when attempting to solve a problem with code, there is a phase of discovery and trial and error. This phase is very important to help the developer understand the problem and to "sketch" out an initial solution.

Once a solution has been reached it is very tempting to move on to the next problem. This is especially the case when there is an imminent deadline approaching.

However the next phase in the development process should always be **refactoring**.

Refactoring is the process of improving a piece code without changing its functionality.

We can improve code is several ways. We can make it:

- more concise
- easier to read
- more efficient
- more reusable

Of the list above probably the most important two are **easier to read** and **more reusable**.

Looking at the code, what areas do you think need improving?

### Use variables to _cache_ data

"Caching" means to store something in memory. Let's say for example that we want to use a DOM element in multiple places in a script. It's far better to store that element in a variable and access it from there, than to continually get it from the DOM with JavaScript.

Let's refactor the code to move all the elements into variables, and declare them at the top of the script. We can also store the result of any functions that we are calling multiple times.

When declaring our variables, we need to make sure that we use meaningful names. This helps our code to be more **readable**. `player1Choice` is much easier to understand than `p1c`.

```js
$(() => {

  const $player1 = $('.player1');
  const $player2 = $('.player2');
  const $result = $('.result');
  const $buttons = $('button.choice');

  $buttons.on('click', (e) => {

    const player1Choice = $(e.target).text();
    const choices = ['rock', 'paper', 'scissors'];
    const player2Choice = choices[Math.floor(Math.random() * choices.length)];

    $player1.text(player1Choice);
    $player2.text(player2Choice);

    if(player1Choice === player2Choice) {
      return $result.text('Tie');
    }

    if(
      player1Choice === 'rock' && player2Choice === 'scissors' ||
      player1Choice === 'paper' && player2Choice === 'rock' ||
      player1Choice === 'scissors' && player2Choice === 'paper'
    ) {
      return $result.text('Player 1 wins');
    }

    return $result.text('Player 2 wins');
  });

  $('button.reset').on('click', () => {
    $player1.text('');
    $player2.text('');
    $result.text('');
  });
});
```

### Large, anonymous functions are bad

An important concept when designing software is modularity and reusability. Having one long function is bad. It makes debugging difficult. It is also difficult for other developers to read, which makes it harder to work in teams.

Let's split this function into smaller named functions:

```js
$(() => {
  const $player1 = $('.player1');
  const $player2 = $('.player2');
  const $result = $('.result');
  const $buttons = $('button.choice');
  const $reset = $('button.reset');

  function makeChoice() {
    const choices = ['rock', 'paper', 'scissors'];
    return choices[Math.floor(Math.random() * choices.length)];
  }

  function findWinner(player1Choice, player2Choice) {
    if(player1Choice === player2Choice) {
      return 'Tie';
    }

    if(
      player1Choice === 'rock' && player2Choice === 'scissors' ||
      player1Choice === 'paper' && player2Choice === 'rock' ||
      player1Choice === 'scissors' && player2Choice === 'paper'
    ) {
      return 'Player 1 wins';
    }

    return 'Player 2 wins';
  }

  function play(e) {
    const player1Choice = $(e.target).text();
    const player2Choice = makeChoice();
    const result = findWinner(player1Choice, player2Choice);

    $player1.text(player1Choice);
    $player2.text(player2Choice);

    $result.text(result):
  }

  function reset() {
    $player1.text('');
    $player2.text('');
    $result.text('');
  }

  $buttons.on('click', play);
  $reset.on('click', reset);
});
```

Ok, not bad. But there's still some improvements to be made.

### Refactoring complex functionality

Our `findWinner` function seems a bit clunky and slightly over engineered. There is a simpler way of solving this problem, using an object to find the opponent's losing hand:

```js
const winConditions = {
  rock: 'scissors',
  paper: 'rock'
  scissors: 'paper'
};
```

We now have 3 key/value pairs, each key represents a player's choice, and the value represents what the opponent would have to have chosen for the player to have won. We can use it like this:

```js
winConditions.rock
=> scissors

winConditions['paper'];
=> rock

const player1Choice = 'scissors';
winConditions[player1Choice];
=> paper
```

This is a common design pattern. We are using the object as if it was a dictionary. We can "look up" values with it.

Let's use this to update our `findWinner` function:

```js
function findWinner(player1Choice, player2Choice) {
  const winConditions = {
    rock: 'scissors',
    paper: 'rock'
    scissors: 'paper'
  };

  if(winConditions[player1Choice] === player2Choice) return 'Player 1 wins';
  if(winConditions[player2Choice] === player1Choice) return 'Player 2 wins';
  return 'Tie';
}
```

That's a lot neater, and easier to read.

Also we can use the keys of the `winConditions` object to make our choices array, using `Object.keys`. That way, if the win conditions change, the choices automatically change as well.

```js
const winConditions = {
  rock: 'scissors',
  paper: 'rock',
  scissors: 'paper'
};

const choices = Object.keys(winConditions);
```

### Making code more efficient

Generally code efficiency should be low on the priority list when developing software. However, it is important to understand where we can reduce the amount of processing power needed to run our programmes.

There are a couple of places where we are making extra work for the JS engine, which we can tidy up. The actual amounts of memory this will free up are minuscule, so this example is a little contrived, but it's good to analyse how the code is working.

We have two functions which are called on every button click: `makeChoice`, and `findWinner`. Both functions create variables every time they run. `makeChoice` creates a `choices` array, and `findWinner` creates a `winConditions` object. This is needless, as neither variable changes throughout the game. Let's refactor so that those variables are only created once:

```js
const winConditions = {
  rock: 'scissors',
  paper: 'rock',
  scissors: 'paper'
};

const choices = Object.keys(winConditions);

function makeChoice() {
  return choices[Math.floor(Math.random() * choices.length)];
}

function findWinner(player1Choice, player2Choice) {
  if(winConditions[player1Choice] === player2Choice) return 'Player 1 wins';
  if(winConditions[player2Choice] === player1Choice) return 'Player 2 wins';
  return 'Tie';
}
```

We've modified our code to make it **more modular** by breaking it into smaller functions; it's **simpler** because we have refactored complex functionality; and it's (very slightly) **more efficient** because we have modified areas where we were making extra work for the JS engine.

### Moving anything unrelated to the DOM outside of the main DOMContentLoaded callback

There is some functionality here that doesn't actually need to wait for the DOM to load. We can move that out of the main callback function.

We can also name the callback function and call it like so:

```js
function setup() {
  ...
}

$(setup);
```

OK, great! We're done. Your finished code should look like this:

```js
const winConditions = {
  rock: 'scissors',
  paper: 'rock',
  scissors: 'paper'
};

const choices = Object.keys(winConditions);

function makeChoice() {
  return choices[Math.floor(Math.random() * choices.length)];
}

function findWinner(player1Choice, player2Choice) {
  if(winConditions[player1Choice] === player2Choice) return 'Player 1 wins';
  if(winConditions[player2Choice] === player1Choice) return 'Player 2 wins';
  return 'Tie';
}

function setup() {
  const $player1 = $('.player1');
  const $player2 = $('.player2');
  const $result = $('.result');
  const $buttons = $('button.choice');
  const $reset = $('button.reset');

  function play(e) {
    const player1Choice = $(e.target).text();
    const player2Choice = makeChoice();
    const winner = findWinner(player1Choice, player2Choice);

    $player1.text(player1Choice);
    $player2.text(player2Choice);
    $result.text(winner);
  }

  function reset() {
    $player1.text('');
    $player2.text('');
    $result.text('');
  }

  $buttons.on('click', play);
  $reset.on('click', reset);
}

$(setup);
```

## Conclusion (5mins)

Refactoring is a really important phase in development, and will never be factored into the build time. As far as a client is concerned, if it works it works, why pay to refactor. That means it's up to you as a developer to make refactoring _part of your development process_.

When refactoring, remember:

- Make it clear and readable
- Use descriptive names for functions and variables
- Break functionality down into small functions
- Write code as if it is going to be read by someone else
- Cache the result of functions into variables, if you intend to reuse that result