# Seeding Data

## Overview

Often when we are working on web applications, we need to have some data to work with. If you were building an online store, it would be useful to have some products to work with from the start. But it's no fun adding all this information manually. Also, while we're developing, it's easy to delete or make changes to data that you don't necessarily want. By making a seeds file it's trivial to _reset_ the database to the original set of data.

## Set up

Open up the `starter-code` and run `yarn install`. Your folder structure should look like this:

```bash
├── server.js
├── models
│   ├── computer.js
│   └── trainer.js
├── node_modules
└── package.json
```

We're going to create a seeds file in a folder called `db`.

```
$ mkdir db && touch db/seeds.js
```

We are going to use Mongoose so add this package to your project using yarn.

```sh
yarn add mongoose
```

Inside the `seeds.js` file, let's begin by requiring `mongoose` and our `trainer` model:

```javascript
const mongoose = require('mongoose');

const databaseURI = 'mongodb://localhost/seeding-data';
mongoose.connect(databaseURI);

const Trainer = require('../models/trainer');
```

The absolute first thing we want to do is ensure that all of our trainers are removed from the database, **before** we run this file. If not the old data will remain, and after a few days of development our database will be full of junk!

We can empty out a collection like so:

```javascript
Trainer.collection.drop();
```

Great! Now we need to add some data.

## Starting simple: 1 model

```javascript
Trainer.create([{
  brand: 'Nike',
  model: 'Air Force 1',
  colors: ['black', 'blue', 'green', 'orange', 'pink', 'teal', 'mauve'],
  rrp: 89.99
},{
  brand: 'Adidas',
  model: 'Campus',
  colors: ['blue', 'red', 'orange', 'pink', 'olive', 'grey'],
  rrp: 69.99
}], (err, trainers) => {
  if(err) console.log(err);
  if(trainers) console.log(`${trainers.length} trainers created!`);

  mongoose.connection.close();
});
```

This should all look very familiar. The last line will ensure we close the connection to the database once we're done.

We can test this by typing `node db/seeds` from the command line.

If we run our app, with `node app` or `nodemon` we should see the documents printed out in the terminal:

```bash
[ { _id: 587e395c252dbf3cfc0c1e9e,
    brand: 'Nike',
    model: 'Air Force 1',
    rrp: 89.99,
    __v: 0,
    colors: [ 'black', 'blue', 'green', 'orange', 'pink', 'teal', 'mauve' ] },
  { _id: 587e395c252dbf3cfc0c1e9f,
    brand: 'Adidas',
    model: 'Campus',
    rrp: 69.99,
    __v: 0,
    colors: [ 'blue', 'red', 'orange', 'pink', 'olive', 'grey' ] } ]
```

## Kicking it up a notch: multiple models

What about more that one model. You might think it's as simple as repeating the process, but be careful! Let's have a look at a common pitfall:

```javascript
Trainer.create([{
  brand: 'Nike',
  model: 'Air Force 1',
  colors: ['black', 'blue', 'green', 'orange', 'pink', 'teal', 'mauve'],
  rrp: 89.99
},{
  brand: 'Adidas',
  model: 'Campus',
  colors: ['blue', 'red', 'orange', 'pink', 'olive', 'grey'],
  rrp: 69.99
}], (err, trainers) => {
  if(err) console.log(err);
  if(trainers) console.log(`${trainers.length} trainers created!`);

  mongoose.connection.close();
});

Computer.create([{
  brand: 'Apple',
  model: 'MacBook Air',
  ram: 8,
  processor: '1.7 GHz Intel Core i7',
  capacity: 250,
  rrp: 999.99
}], (err, computers) => {
  if(err) console.log(err);
  if(trainers) console.log(`${computers.length} computers created!`);

  mongoose.connection.close();
});
```

### The problem: asynchronicity

Node is _asynchronous_ meaning both the trainers and the computers are being created **at the same time**. We have no idea which will be created first, and which ever one does finish first, will close the connection to the database, meaning that there is a good chance that the other will not save!

### The solution: callbacks

```javascript
Trainer.create([{
  brand: 'Nike',
  model: 'Air Force 1',
  colors: ['black', 'blue', 'green', 'orange', 'pink', 'teal', 'mauve'],
  rrp: 89.99
},{
  brand: 'Adidas',
  model: 'Campus',
  colors: ['blue', 'red', 'orange', 'pink', 'olive', 'grey'],
  rrp: 69.99
}], (err, trainers) => {
  if(err) console.log(err);
  if(trainers) console.log(`${trainers.length} trainers created!`);

  Computer.create([{
    brand: 'Apple',
    model: 'MacBook Air',
    ram: 8,
    processor: '1.7 GHz Intel Core i7',
    capacity: 250,
    rrp: 999.99
  }], (err, computers) => {
    if(err) console.log(err);
    if(trainers) console.log(`${computers.length} computers created!`);

    mongoose.connection.close();
  });
});
```

By creating the computers _inside the callback_ of the trainers, we ensure that we create the trainers first and _then_ the computers. Once the computers are created we can then close the connection to the database.

## The pièce de résistance: promises

The problem with callbacks is they are a little confusing, and having callbacks inside callbacks inside callbacks can be particularly difficult to work with. Also you very quickly get board of typing out `if(err) console.log(err);` everywhere!

Enter promises. Promises aim to dry up and simplify the asychronous nature of javascript. In order to use promises, we need to install a promise library, and attach it to our mongoose instance. We'll be using `bluebird`. Let's install it now.

```bash
$ npm i --save bluebird
```

Now we need to add it to mongoose:

```javascript
mongoose.Promise = require('bluebird');
```

OK, now let's update our seeds file to use promises:

```javascript
Trainer
  .create([{
    brand: 'Nike',
    model: 'Air Force 1',
    colors: ['black', 'blue', 'green', 'orange', 'pink', 'teal', 'mauve'],
    rrp: 89.99
  },{
    brand: 'Adidas',
    model: 'Campus',
    colors: ['blue', 'red', 'orange', 'pink', 'olive', 'grey'],
    rrp: 69.99
  }])
  .then((trainers) => {
    console.log(`${trainers.length} trainers created!`);

    return Computer.create([{
      brand: 'Apple',
      model: 'MacBook Air',
      ram: 8,
      processor: '1.7 GHz Intel Core i7',
      capacity: 250,
      rrp: 999.99
    }]);
  })
  .then((computers) => {
    console.log(`${computers.length} computers created!`);
  })
  .catch((err) => {
    console.log(err);
  })
  .finally(() => {
    mongoose.connection.close();
  });
```

We have created a chain of promises! Staring with `Trainer.create`, instead of passing a callback, we chained another method `then`, which gets called if the `create` method succeeded. Inside the `then` method, we return another promise `Computer.create`, if that succeeds, we can move on to the next `then` block. If anything goes wrong at any point in the chain, we jump directly to the `catch` block where we can handle the error. Whether there was an error or not we always move on to the `finally` block, where we can close the connection to the database.

Promises are a recent addition to the JavaScript developer's toolbox and have become very popular. We shall be using the throughtout the course from now on, so you should get a good handle of them!

## Independent practise (20mins)

- Create a new model `Book`, and using the existing seeds file, add some books. They should be created _after_ the computers.