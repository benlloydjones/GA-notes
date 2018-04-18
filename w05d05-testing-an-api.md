---
title: Testing Node with Mocha/Chai
type: lesson
duration: "1:15"
creator:
    name: Alex Chin
    city: London
competencies: Testing
---

# Testing Node with Mocha/Chai

### Objectives
*After this lesson, students will be able to:*

- Describe the importance of testing your code programmatically
- Use describe and assertion functions to do basic testing

### Preparation
*Before this lesson, students should already be able to:*

- Describe TDD
- Explain basic file and folder structure in a simple RESTful node app


## Mocha, Chai And Javascript Testing - Intro (10 min)

We've now created several Express applications. All these apps cover a single topic, so most of the time, they are quite small. But when you create a larger application, the codebase will become bigger and more complex every time you add some features. At some point, adding code in file A will break features in file B. To avoid these "side-effects", we need to test our app.

To do so in Node, we will use two libraries: one to run the tests and a second one to run the assertions.

[Mocha](https://mochajs.org/) will be our testing framework. From the mocha Website:

_"Mocha is a feature-rich JavaScript test framework running on Node.js and the browser, making asynchronous testing simple and fun. Mocha tests run serially, allowing for flexible and accurate reporting, while mapping uncaught exceptions to the correct test cases."_

For assertions, we will use [Chai](http://chaijs.com/). From the Chai website:

_"Chai is a BDD / TDD assertion library for node and the browser that can be delightfully paired with any javascript testing framework."_

To be able to make HTTP requests inside tests, we will use a framework called [`supertest`](https://github.com/visionmedia/supertest).

## Set up the testing environment (35 mins)

We're going to write this app TDD, so we're going to write our tests first and expect them to fail and then write the app to pass our tests.

### Installing the packages

First things first, let's create a directory for the project.

```bash
$ mkdir tdd-shoe-app
```

Next, `cd` into this directory and run:

```bash
$ yarn init
```

Accept all of the defaults.

Next, we are going to setup out testing environment along with the other node packages that we will need:

```bash
$ yarn add mocha chai supertest --dev
```

>**Note**: We will be writing a test script in our `package.json` that will use this project's local version of `mocha` - however, it might be a good idea to also install `mocha` globally:

>```bash
>yarn global add mocha
>```

### Make the test directory

Next, we need to make a directory to hold our spec files.

```bash
mkdir test
```

Then, we are going to make a file called `mocha.opts`, this is just a setup file for `mocha`, hence the `.opts` extension.

```bash
touch test/mocha.opts
```

Inside the file, we are going to add:

```js
--recursive
```

This means that mocha will run tests inside sub-directories inside test. This will allow us to organize our tests a bit better

This will allow us to run tests on sub-directories.

### Creating a `helper` file

There is often quite a bit of setup that you want to do before running your `mocha` tests. So instead of repeating this in each test file, we're going to create another file called `helper.js` that we can just include in all the other files. This will help us to keep our code DRY.

```bash
touch test/helper.js
```

The first thing we want to do in this file is to change our node environment to be `test`.

```js
process.env.NODE_ENV = 'test';
```

`NODE_ENV` is an environment variable that is used by Express. When a node application is run, it can check the value of the environment variable and do different things based on the value. We're going to use this variable to ensure that we use a **test database**.

Next, we're going to require `chai`:

```js
process.env.NODE_ENV = 'test';

const chai = require('chai');
```

### Setting up `global` node variables

Next, we need to choose which syntax from `chai` we are going to use. We're actually going to require both `should` and `expect` as they both need to be required to use `expect`, which is the one we're going to be using today.

In order to allow these variables to be seen by the file that we're importing we're going to use the `global` node object.

```js
process.env.NODE_ENV = 'test';

const chai 	 = require('chai');
global.should	 = chai.should();
global.expect	 = chai.expect;
```

### Setting up `supertest`

Next, we need to setup `supertest` in the app. SuperAgent is a small progressive client-side HTTP request library that powers `supertest`. Supertest allows us to make mock HTTP to our app.

Let's require it:

```js
process.env.NODE_ENV = 'test';

const chai 	 = require('chai');
global.should	 = chai.should();
global.expect	 = chai.expect;

const supertest = require('supertest');
```

Next, we need to export out express app and require it in the `spec_helper.js` file.

> **Note:** As we're writing this TDD, we haven't setup an app yet!

```js
process.env.NODE_ENV = 'test';

const chai			 = require('chai');
global.should        = chai.should();
global.expect        = chai.expect;

const supertest      = require('supertest');
const app            = require('../index');
global.api           = supertest(app);
```

Now, we should be able to run `mocha` (which will use our global installation of `mocha`) but it will fail.

Alternatively, we can also setup a custom `test` script in our `package.json` to ensure that we are using the correct version of mocha for this project.

```json
{
  "name": "tdd-show-app",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "node_modules/.bin/_mocha"
  },
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "chai": "^3.5.0",
    "mocha": "^3.1.2",
    "supertest": "^2.0.1"
  }
}
```

We can now run our tests with:

```bash
yarn test
```

## Setup our Express app

Firstly, we need to create our main file. this will have to be the same name as what we called in in the `helper` file.

```bash
touch index.js
```

Now, if we run `npm test` or `yarn test` we should see `0 passing`.

We haven't actually got an express app running yet but that's okay because we haven't written any tests.

### Testing a resource of shoes

Great, now we want to create a directory to test our api endpoints.

The correct naming convention for these spec files should be the controller name followed by `_test`.

```bash
$ mkdir test/api
$ touch test/api/shoes_test.js
```

Now, inside this `shoes_test.js` file we need to require our `helper.js` file.

#### Writing a test for the index action

Now, we are going to write a test for the RESTful `index` action:

```js
require('../helper');

describe('Shoes Tests', () => {
  describe('GET /api/shoes', () => {
    it ('should return a 200 response', done => {
      done();
    });
  });
});
```

If we run `npm test` or `yarn test` now, we should see the test passing.

But we haven't done anything and its still passing? This shows us something really important about TDD development. You need to know **how** to write good tests before actually writing them.

This will come with practice but for now let's change our response callback so the test fails until we make it pass.

We want to use our `supertest` api to make a request this will mimic a request to our api as if we were making one ourselves in insomnia.

```js
require('../helper');

describe('Shoes Tests', () => {
  describe('GET /api/shoes', () => {
    it ('should return a 200 response', done => {
      api
        .get('/api/shoes')
        .set('Accept', 'application/json')
        .expect(200, done);
    });
  });
});
```

This is now actually making a test! If we run `npm test` now we should get an error about `app.address is not a function`.

#### Making the test pass

We now need to write some code to make the test pass.

> ***Note:*** _We only ever want to do the minimum required to make the test pass. Don't overcomplicate things!_

First, let's install Express:

```bash
$ yarn add express --dev
```

Inside `index.js` let's require our packages and set up our port.

```js
const express = require('express');
const app     = express();
const port    = process.env.PORT || 3000;

app.listen(port, () => console.log(`Started on port: ${port}`));

module.exports = app;
```

Notice that we need to export this file so that `supertest` can run it.

> **Note**: Also, we don't actually need to set up the port because `supertest` will fake a server, it wont actually need one to work unless we need to test something like sending text messages, emails etc.

If we run `npm test`, now we get 1 failing test which is what we want at the moment.

```
Error: expected 200 "OK", got 404 "Not Found"
```

If we wanted to make this test pass, we could add.

```js
app.get('/api/shoes', (req, res) => res.sendStatus(200));
```

This will now make the test pass!

Once again, notice how we have done the bare minimum to get this test to pass. This is the agile way of testing.

#### Writing some more tests

Now that we have this test passing... let's make some more tests.

Inside `shoes_test.js`:

```js
require('../helper');

describe('Shoes Controller Test', () => {
  describe('GET /api/shoes', () => {
    it ('should return a 200 response', function(done) {
      api
        .get('/api/shoes')
        .set('Accept', 'application/json')
        .expect(200, done);
    });

    it ('should return an array of shoes', function(done) {
      api
        .get('/api/shoes')
        .set('Accept', 'application/json')
        .end((err, res) => {
          expect(res.body).to.be.an('array');
          done();
        });
    });
  });
});
```

#### Make the tests pass

Now we can go back to `index.js` and add change our index action to be:

```js
app.get('/api/shoes', (req, res) => {
	res.status(200).json([]);
});
```

If we run `npm test` now, we should get 3 tests passing as we have got our index action to return an array of shoes. Simple as that!

## Testing Coverage

We can use an npm package called `istanbul` to see what percentage of the app has been tested.

```bash
$ yarn add istanbul --dev
```

Inside our `package.json` file, we want to change the default script to use `istanbul` and `mocha`:

```json
{
  "name": "tdd-show-app",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "istanbul cover node_modules/.bin/_mocha"
  },
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "chai": "^3.5.0",
    "istanbul": "^0.4.5",
    "mocha": "^3.1.2",
    "supertest": "^2.0.1"
  },
  "dependencies": {
    "express": "^4.14.0"
  }
}
```

Now when we run `npm test` we can see the reports for the tests we have written and how much of the app is covered by tests!

## Model and Controller

Now we have 3 tests passing, let's create a controller and create a model for Shoe to make it more like a traditional api.

First, let's install `mongoose`:

```bash
$ yarn add mongoose bluebird 
```

Now we can create the files we will need.

```bash
$ mkdir models controllers config
$ touch models/shoe.js
$ touch controllers/shoes.js
$ touch config/config.js
$ touch config/routes.js
```

Inside `shoe.js` lets create a shoe model.


```js
const mongoose = require('mongoose');

const shoeSchema = new mongoose.Schema({
  brand:    { type: String, trim: true, required: true },
  color:    { type: String, trim: true, required: true },
  material: { type: String, trim: true, required: true },
  price:    { type: Number, required: true },
  laced:    { type: Boolean, required: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('Shoe', shoeSchema);
```

Let's move our shoes index action from our main file into a dedicated router file, `config/routes.js`:

```js
const router = require('express').Router();
const shoes  = require('../controllers/shoes');

router.route('/shoes')
  .get(shoes.index);

module.exports = router;
```

Now, in `controllers/shoes.js` let's add our controller function for index.

```js
const Shoe = require('../models/shoe');

function shoesIndex(req, res) {
  Shoe
    .find()
    .exec()
    .then(shoes => res.status(200).json(shoes))
    .catch(err  => res.status(500).json(err));
}

module.exports = {
  index: shoesIndex
};
```

Inside `index.js` let's now delete the old route and require our router file and use it with the prefix of  `/api`.

```js
const express = require('express');
const app     = express();
const port    = process.env.PORT || 3000;
const routes  = require('./config/routes');

app.use('/api', routes);

app.listen(port, () => console.log(`Started on port: ${port}`));

module.exports = app;
```

### Setting up the database

We now need to connect our model to a database. We are going to create 3 different databases for this app:

- test
- development
- production

This way, when we are testing our app, we won't interfere with the production database.

In `config/environment.js`

```js
const port = process.env.PORT || 4000;
const env = process.env.NODE_ENV || 'development';
const dbURI = process.env.MONGODB_URI || `mongodb://localhost/shoes-${env}`;

module.exports = { port, env, dbURI };
```

Now, we're going to connect to a different database depending on the Node environment that the express app is operating in.

Inside `index.js`:

```js
const express    	  = require('express');
const app        	  = express();
const enviroment 	  = app.get('env');
const mongoose   	  = require('mongoose');
mongoose.Promise 	  = require('bluebird');
const port       	  = process.env.PORT || 3000;
const routes     	  = require('./config/routes');
const { dbURI, port } = require('./config/environment');

mongoose.connect(dbURI, { useMongoClient: true });

app.use('/api', routes);

app.listen(port, () => console.log(`Started on port: ${port}`));

module.exports = app;
```

Lets run, `yarn test` we should now still see 3 tests passing but notice that our coverage has now dropped!

## Testing our JSON response

Currently, we are testing that the route should return an array but it would be better to test the contents of the array as we know that it should contain an array of shoe objects created with our shoe model.

Let's write another test to test the contents of the array returned.

```js
it ("should return an array of shoe objects", function(done) {
      .get('/api/shoes')
      .set('Accept', 'application/json')
      .end((err, res) => {
        expect(res.body)
          .to.be.an("array")
          .and.have.property(0)
          .and.have.all.keys([
            "_id",
            "__v",
            "brand",
            "color",
            "material",
            "laced",
            "price",
            "createdAt",
            "updatedAt"
          ]);
          done();
      });
    });
```

To get this test to pass, we need to add some data into our shoe database, we can do this with a `before` action in our `shoes_spec.js` file.

This will ensure that there is going to be at least one shoe in our test database.

At the top of the testing block for `/api/shoes` we are going to create a shoe using the `Shoe` model which we need to `require`. This shoe will be created when we run `npm test` only for testing purposes. This shoe will NOT be added to the production database.

```js
const Shoe = require('../../models/shoe');

describe('GET /api/shoes', () => {
  beforeEach(done => {
    Shoe.create({
      brand: 'Nike',
      color: 'black',
      laced: true,
      material: 'leather',
      price: 49.99
    })
    .then(() => done())
    .catch(done);
  });

  // Rest of code //
```

When we run `yarn test` the 4th test should pass!

But now, everytime we run `yarn test` we are creating this shoe, without dropping the test database. Therefore, we are just recreating this shoe over and over again.

We want to prevent this so before running any test, we can drop the Shoe collection.

```js
require('../helper');
const Shoe = require('../../models/shoe');

describe('Shoes Controller Test', () => {

  beforeEach(done => {
    Shoe.collection.drop();
    done();
  });

  describe('GET /api/shoes', () => {
    beforeEach(done => {
      Shoe.create({
        brand: 'Nike',
        color: 'black',
        laced: true,
        material: 'leather',
        price: 49.99
      })
      .then(() => done())
      .catch(done);
    });

	// Rest of code //
```

Now we have a fully tested index route for the shoe resource!

## A more complete example

We don't have time to go through an example for every RESTful action. So we will send out some solution-code that has a full RESTful resource.


## Conclusion (10 mins)
> Review the answers to the tests specs above

We've covered the principles of testing in JavaScript, but Chai offers a lot of different expectations syntaxes. Check the [Chai Documentation](http://chaijs.com/api/)

- How does Mocha work with Chai to write tests in your JavaScript application?