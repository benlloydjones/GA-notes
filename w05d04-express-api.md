---
title: Express API
type: lesson
duration: "1:00"
creator:
    name: Alex Chin
    city: London
competencies: Server Applications
---

# Express API

### Objectives
*After this lesson, students will be able to:*

- Make an API with Express
- Test the API using Postman or Insomnia
- Understand the difference between an API and a web application

### Preparation
*Before this lesson, students should already be able to:*

- Understand what JSON is
- Be able to make an MVC Express app

## Express API Intro (10 mins)

So far we've used Express only to render `text/html`. However, Express as a _minimal_ framework is really great to make APIs.

The majority of modern APIs now render JSON so that they can then manipulate the data programmatically - often using JavaScript.

Most likely, if you encounter Express in the wild you will use it as you API.

### MEAN

Express perhaps is most widely used as part of a stack called the "MEAN" stack:

- **M**ongo
- **E**xpress
- **A**ngular
- **N**ode

This is a popular collection of frameworks that developers use to get modern websites developed quickly. Express here is used as an API.

## Create an API from scratch (15 mins)

Lets go through the process of creating an API from scratch using Express and Mongo as this is likely to be the setup that we are going to use for the rest of the course.

Let's start by creating a folder:

```bash
mkdir express-api && express-api
```

- **yarn init**

Next, we need to initialize the project with a package.json:

```bash
yarn init
```

You can pretty much hit `<enter>` for the defaults.

- **Install packages**

Let's install the various packages that we're going to use.

```bash
yarn add express body-parser morgan mongoose bluebird
```

We don't need to install `ejs` or `express-ejs-layouts` because we aren't going to render any views. And we don't need to install `method-override` because we aren't going to be using HTML forms!

- **Create index.js**

Next, let's create an `index.js` file:

```bash
$ touch index.js
```

- **Setup & run express**

Inside index.js, let's setup an express application.

```js
const express      = require('express');
const app          = express();

// listen on port 3000
app.listen(3000, () => console.log(`Listening on port: ${port}`));
```

- **Setup morgan for better logging**

Now let's setup morgan for better logging.

```js
const express      = require('express');
const app          = express();
const morgan       = require('morgan');

// Use morgan for logging
app.use(morgan('dev'));

// listen on port 3000
app.listen(3000, () => console.log(`Listening on port: ${port}`));
```

- **Setup body-parser**

Next, we need to setup body-parser so that Express can read the body of HTTP requests.

We want to set this up slightly differently than we have before as we want to be able to accept JSON.

```js
const express      = require('express');
const app          = express();
const morgan       = require('morgan');
const bodyParser   = require('body-parser');

// Use morgan for logging
app.use(morgan('dev'));

// Setup body-parser to read JSON
app.use(bodyParser.json());

// listen on port 3000
app.listen(3000, () => console.log(`Listening on port: ${port}`));
```

- **Connect to the database**

Let's setup mongoose to connect to our database. We're also going to be using promises with mongoose, so we'll use `bluebird` as our promise library of choice:

```js
const express      = require('express');
const app          = express();
const morgan       = require('morgan');
const bodyParser   = require('body-parser');
const mongoose     = require('mongoose');
mongoose.Promise   = require('bluebird');

const dbURI = 'mongodb://localhost/express-api';
mongoose.connect(dbURI, { useMongoClient: true });
```

- **Set up the environment**

Finally we can create an environment file to store the environment specific variables like the port and database URI.

Create a `config` folder and `environment.js` file:

```sh
mkdir config && touch config/environment.js
```

Add the `port` and `dbURI` inside, and export them:

```sh
const port = process.env.PORT || 3000;
const dbURI = process.env.MONGODB_URI || 'mongodb://localhost/express-api';

module.exports = { port, dbURI };
```

Then require them in `index.js`:

```js
const express      = require('express');
const app          = express();
const morgan       = require('morgan');
const bodyParser   = require('body-parser');
const mongoose     = require('mongoose');
mongoose.Promise   = require('bluebird');

const { dbURI, port } = require('./config/environment');

mongoose.connect(dbURI, { useMongoClient: true });

.
.
.

app.listen(3000, () => console.log(`Listening on port: ${port}`));
```

- **Run the server**

You can now run the website to test that it works. There are currently no routes but there should be no errors.

## Create a model - (15 mins)

The next step we want to do is to create a model for our app. Let's create a model for an object!

We're going to use donuts!

```bash
$ mkdir models
$ touch models/donuts.js
```

Now inside this model, we need to create a mongoose model for a donut.

```js
const mongoose = require('mongoose');

const donutSchema = new mongoose.Schema({
  style: String,
  flavor: String
});

module.exports = mongoose.model('Donut', donutSchema);
```

## Make a controller & routes - (15 mins)

We're going to separate our controller logic from our routing logic to keep things a little cleaner. We don't have to do this, but it's good practise to do this.

```sh
$ mkdir controllers
$ touch controllers/donuts.js
$ touch config/routes.js
```

Inside our controller, we need to require our model:

```js
const Donut = require('../models/donut');
```

And then create a function that uses mongoose methods to create a donut.

_Type out the code and then go through carefully_.

```js
const Donut = require('../models/donut');

function donutsCreate(req, res) {
  Donut
    .create(req.body)
    .then(donut => res.status(201).json(donut))
    .catch(err => res.status(500).json(err));
}
```

- **res.status()** The method `.status()` allows us to manually add a status code to our HTTP response. We "can" set the wrong status code if we want but this is obviously bad practise.
- **.json()** `res.send` and `res.json` are identical when an object or array is passed but `res.json()` will also convert non-objects, such as null and undefined, which are not valid JSON.

Lastly, we need to export the function:

```js
const Donut = require('../models/donut');

function donutsCreate(req, res) {
  Donut
    .create(req.body)
    .then(donut => res.status(201).json(donut))
    .catch(err => res.status(500).json(err));
}

module.exports = {
  create: donutsCreate
};
```

### Routes

Next, we need to setup the route handler for this action. We're going to do this inside our `config/routes.js` file.

```js
const router = require('express').Router();
const donuts = require('../controllers/donuts');

router.route('/donuts')
  .post(donuts.create);

module.exports = router;
```

> **Note:** We're using the chainable `.route` method as this will be cleaner with more routes.

Next need to require this routes file in `index.js`, and hook it up to express with `app.use`.

```js
const express      = require('express');
const app          = express();

const morgan       = require('morgan');
const bodyParser   = require('body-parser');
const mongoose     = require('mongoose');
mongoose.Promise   = require('bluebird');

const { dbURI, port } = require('./config/environment');
mongoose.connect(dbURI, { useMongoClient: true });

app.use(morgan('dev'));
app.use(bodyParser.json());

app.listen(3000, () => console.log(`Listening on port: ${port}`));
```

Great! We've done a bit of coding now without really being able to test what we've typed. This is generally not good practise. Let's now test what we've done.

### Insomnia/Postman

Using an API client (or cURL) let's make a HTTP POST request to `http://localhost:3000/donuts` with the data of:

```json
{
  "style": "ring",
  "flavor": "strawberry"
}
```

If everything has worked, you should see:

```
{
  "__v": 0,
  "_id": "59ba4cda192fb72429d78961",
  "style": "Ring",
  "flavor": "Strawberry"
}
```

## Creating an index action - (10 mins)

In order for us to have a look at our donuts in the database, we need to create another action. Let's create one for index.

In our controller:

```js
function donutsIndex(req, res) {
  Donut
    .find()
    .exec()
    .then(donuts => res.json(donuts))
    .catch(err => res.status(500).json(err));
}
```

We then need to export this at the bottom of our file:

```js
module.exports = {
  index: shoesIndex
  create: shoesCreate
};
```

Now in our `routes.js` file, let's setup this route:

```js
router.route('/donuts')
  .get(donuts.index)
  .post(donuts.create);
```

You can now test this using Insomnia making a `GET` request to `http://localhost:3000/donuts`.

## Independent Practice (20 minutes)

> ***Note:*** _This can be a pair programming activity or done independently._

I'm sure you can guess what you need to do for this independent practise?

Your task is to write the controller functions for the rest of the restful routes.

**Note:** You don't need to have a NEW & EDIT action!

- **INDEX** - `GET /shoes`
- **CREATE** - `POST /shoes`
- **SHOW** - `GET /shoes/:id`
- **UPDATE** - `PUT /shoes/:id`
- **DELETE** - `DELETE /shoes/:id`

## Tidying up

One last thing we should do is tidy up our JSON output. Firstly we want to remove the underscore from the `id` property, cos, let's face it `_id` looks weird and we'll probably forget. Also, there's this weird `__v` property which has come out of nowhere...

>**Note:** Actually `__v` has come from `mongoose`, you can find more about it from the [documentation](http://mongoosejs.com/docs/guide.html#versionKey), but basically its important to how `mongoose` works so we should not mess with it, but we don't have to include it in our JSON output.

#### Virtual properties

Mongoose already has an `id` property as a built in virtual (you would have used it in the last module). In order to display it we can modify the `donutSchema` `toJSON` setting. Let's modify it in the model:

```js
donutSchema.set('toJSON', {
  virtuals: true
})
```

The JSON will now look like this:

```json
{
  "__v": 0,
  "_id": "59ba4cda192fb72429d78961",
  "style": "Ring",
  "flavor": "Strawberry",
  "id": "59ba4cda192fb72429d78961"
}
```

#### Modifying the JSON

Now that we've added the virtuals to the JSON, we can remove any properties we want with the `transform` method:

```js
donutSchema.set('toJSON', {
  virtuals: true,
  transform(doc, json) {
    delete json._id;
    delete json.__v;
    return json;
  }
})
```

The `transform` method allows us to programmatically modify the JSON payload _before_ it gets sent to the client. `doc` refers to the document in the database, and `json` refers to the default JSON payload.

The JSON should now look like this:

```js
{
  "style": "Ring",
  "flavor": "Strawberry",
  "id": "59ba4cda192fb72429d78961"
}
```

Lovely!

#### Globally modifying JSON for all schema

We are going to want to do this for all schema that we create for our app, so rather than typing it out however many times, we can do this gloablly for **all** schema at once.

Create a `lib` folder and `globalToJSON.js` file inside:

```sh
mkdir lib && touch lib/globalToJSON.js
```

Inside add the following code:

```js
function globalToJSON(schema) {
  schema.set('toJSON', {
    virtuals: true,
    transform(doc, json) {
      delete json._id;
      delete json.__v;
      return json;
    }
  });
}

module.exports = globalToJSON;
```

And hook it up to mongoose in `index.js`:

```js
const mongoose = require('mongoose');
mongoose.plugin(require('./lib/globalToJSON'));
mongoose.Promise = require('bluebird');
```

We have created a mongoose plugin! The `globalToJSON` function we have created will run once for each schema we create, and modify it's setting accordingly.

>**Note:** We have to add the plugin **IMMEDIATELY** after we require `mongoose` for it to properly take effect.

## Conclusion (5 mins)

It's important to understand the difference between rendering `text/html` and rendering `application/json` as a response for your HTTP requests.

It's also really important to understand the power of an API.

- What is `res.status()`?
- What the difference between `res.send()` and `res.json()`?