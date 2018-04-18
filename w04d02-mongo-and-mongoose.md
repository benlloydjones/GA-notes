# Mongo-backed Models with Mongoose

### Objectives
*After this lesson, students will be able to:*

- Update & destroy a model
- Initialise & create a new instance of a model
- Perform basic CRUD queries using Mongoose

### Preparation
*Before this lesson, students should already be able to:*

- Describe how Mongo documents work
- Describe how an ORM works
- Create a basic NodeJS app

## Using MongoDB with Node - Intro (5 mins)

NodeJS and MongoDB work really well together. However, to make it even easier, Mongoose is the most common Node.js ORM to manipulate data using MongoDB.

CRUD functionality is something that is necessary in almost most every application, as we still have to create, read, update, and delete data.

For today, we will use a couple of Node files to play with and use MongoDB using the Mongoose ORM.

#### What is an ORM?

ORM or O/RM stands for object-relational mapping, and simply put it is a set of helper methods that allows us to access data from a database without having to know database specific language or syntax. A bit like jQuery it provides a simpler syntax for what would normally be fairly lengthy code.

#### What Is Mongoose?

Mongoose is an ORM for Node and it gives us the MongoDB CRUD commands as well as the ability to connect to the MongoDB.

## Setting up Mongoose in your app - Codealong (5 mins)

Create a new package.json and install the relevant npm packages:

1. `mkdir mongoose-intro`
2. `cd mongoose-intro`
3. `touch server.js` in mongoose-intro directory
4. `npm init`

To use Mongoose in your Node app:

```bash
$ yarn add mongoose
```

With the package installed, lets use it - open app.js and add:

```javascript
// Require mongoose
const mongoose    = require("mongoose");
const databaseURI = 'mongodb://localhost/mongoose-intro';

mongoose.connect(databaseURI, { useMongoClient: true });
```

We can use mongoose's `.connect()` function to connect to our mongoDB.

In this example, we are connecting to a local database named `mongoose-intro`. Even though we do not already have a db called "mongoose-intro" mongo will create it **but only when we try to insert a document**.

You can now execute all the mongoDB commands over the database `mongoose-intro`.

P.S. Don't forget to run mongo! If you want, you can use [launchctl](https://gist.github.com/tonypujals/9630872) to start mongo automatically on login.

## Working with Models - Codealong (20 mins)

#### Defining a Model

We must build a Mongoose Model before we can use any of our new CRUD operations. You can think of models a bit like JavaScript constructor functions. Our Mongoose Schema is what we'll use to define our document attributes.

From within our mongoose-intro app:

```bash
mkdir models
touch models/user.js
```

Now let's add:

```javascript
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, required: true, unique: true },
  dob: Date,
  website: String,
  address: String,
  country: String
}, {
  timestamps: true
});
```

MongoDB is schemaless, meaning: all the documents in a collection can have different fields, but for the purpose of a web app, often containing validations, it's better to use a schema that will cast and validate each type. Also, if you try to save data to a key that is not declared in the schema, the data will not be saved.

At the bottom of the schema we have added the `timestamps` flag, which tells mongo to record the time when the record was created and last updated automatically for us. Very useful!

At the moment we only have the schema, representing the structure of the data we want to use. To save some data, we will need to make this file a Mongoose model and export it:

```javascript
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, required: true, unique: true },
  dob: Date,
  website: String,
  address: String,
  country: String
}, {
  timestamps: true
});

// make this available to our other files
module.exports = mongoose.model('User', userSchema);
```

Here's a look at the datatypes we can use in Mongoose documents:

- String
- Number
- Date
- Boolean
- Array
- Buffer
- Mixed
- ObjectId

#### Create a new User

Now we can use this mongoose model by requiring the User model in server.js:

```javascript
const User = require('./models/user');

// create a new user called Mike
const person = new User({
  firstName: 'Mike',
  dob: new Date('1981-01-06')
});

console.log(person);
```

**Note: We haven't tried saved this record yet and therefore the validation hasn't run!**

## Interacting with MongoDB's CRUD - Demo (15 mins)

In our `server.js` file let's use Mongoose to perform CRUD actions on our database:

#### Create

Let's create a user:

```js
const person = new User({
  firstName: "Mike",
  dob: new Date('1981-01-06')
});

person.save((err, user) => {
  if (err) return console.log(err);

  return console.log(`User was created! ${user}`);
})
```

Due to our validation on email, we should get:

```js
{ [ValidationError: User validation failed]
  message: 'User validation failed',
  name: 'ValidationError',
  errors:
   { email:
      { [ValidatorError: Path `email` is required.]
        message: 'Path `email` is required.',
        name: 'ValidatorError',
        properties: [Object],
        kind: 'required',
        path: 'email',
        value: undefined } } }
```

Let's fix this by adding an email to our person.

```javascript
const User = require('./models/user');

const person = new User({
  firstName: 'Mike',
  dob: new Date('1981-01-06'),
  email: "mike.hayden@ga.co"
});

person.save((err, user) => {
  if (err) return console.log(err);
  return console.log("User was created!", user);
})
```

We can also do the same thing, using mongoose's `create` method:

```javascript
User.create({
  firstName: 'Emily',
  lastName: 'Isacke',
  dob: new Date('1990-10-10'),
  email: 'emily.isacke@ga.co'
}, (err, user) => {
  if (err) return console.log(err);
  return console.log("User was created!", user);
});
```

#### What about Read?

Inside `app.js`, **comment out the code to save a new user** and underneath let's add:

```js
// Get all of the users
User.find((err, users) => {
  if (err) return console.log(err);
  return console.log(users);
});
```

This should give us all of the users.

We can also return all users that match certain criteria:

```javascript
// Get all users that have the first name Emily
User.find({ firstName: 'Emily' }, (err, users) => {
  if (err) return console.log(err);
  return console.log(users);
});
```
> **Note:** even though there is only _one_ document returned, it is still returned _in an array_, since there _could be more_.

```javascript
// Get one User
User.findById('572733e9cfef9557890b3b92', (err, user) => {
  if (err) return console.log(err);
  return console.log(user);
});
```

You can also get the first record that matches a search with the attributes defined:

```javascript
User.findOne({ firstName: 'Mike' }, (err, user) => {
  if (err) return console.log(err);
  return console.log(user);
});
```
> **Note:** Because `findOne` will only ever find one document it will _never return an array_.

#### Update

You can update a document in several ways. There are pros and cons to each.

##### 1. `findOneAndUpdate`

```javascript
User.findOneAndUpdate({ firstName: 'Mike' }, { lastName: 'Hayden' }, (err, user) => {
  if (err) return console.log(err);
  return console.log(user);
});
```

This is nice and simple to implement, however there are two main drawbacks: firstly, the _original_ document is returned, rather than the _updated_ one! To resolve this, we need to add some extra settings:

```javascript
User.findOneAndUpdate({ firstName: 'Mike' }, { lastName: 'Hayden' }, { new: true }, (err, user) => {
  if (err) return console.log(err);
  return console.log(user);
});
```

The third argument `{ new: true }`, tells mongoose to send back the _updated_ docuemnt instead. Yippee!

Secondly, `findOneAndUpdate` will not run the validations, unless we add another setting in the third argument:

```javascript
User.findOneAndUpdate({ firstName: 'Mike' }, { lastName: 'Hayden' }, { new: true, runValidators: true }, (err, user) => {
  if (err) return console.log(err);
  return console.log(user);
});
```

##### 2. `findByIdAndUpdate`

`findByIdAndUpdate` is almost identical to `findOneAndUpdate`, except, obviously you need to send the document id, rather than attributes to match.

```javascript
User.findByIdAndUpdate('572733e9cfef9557890b3b92', { lastName: 'Hayden' }, { new: true }, (err, user) => {
  if (err) return console.log(err);
  return console.log(user);
});
```

Again, we have to pass `{ new: true }`, but with `findByIdAndUpdate` the validations will **never** run, regardless of what we do!

##### 3. A two-stage process

Firstly we `find` a record, update it, then save it:

```javascript
User.findById('572733e9cfef9557890b3b92', (err, user) => {
  if (err) return console.log(err);
  user.lastName = 'Hayden';

  user.save((err, user) => {
    if (err) return console.log(err);
    return console.log(user);
  });
});
```

This requires a bit more coding, but ensures that validations are **always** run, and the new record is **always** returned.

#### Destroy

Mongoose gives you two easy methods to delete documents - `findByIdAndRemove()` and `.findOneAndRemove()`.

```javascript
User.findByIdAndRemove('572733e9cfef9557890b3b92', err => {
  if (err) return console.log(err);
  return console.log('Deleted!');
});
```

You can also use the two-step process similar to updating:

```javascript
User.findById('572733e9cfef9557890b3b92', (err, user) => {
  if (err) return console.log(err);
  user.remove((err) => {
    if (err) return console.log(err);
    return console.log('Deleted!');
  });
});
```

## Custom Methods (20 mins)

When defining a schema, you can also add custom methods and call these methods on the models. You can even overwrite the default Mongoose document methods.

There are two different types of methods you can define in a schema `methods` and `statics`. These are similar to instance (`methods`) vs class (`statics`) methods.

#### .methods

Let's write a `fullName` function under our schema:

```javascript
const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, required: true, unique: true },
  dob: Data,
  website: String,
  address: String,
  country: String,
}, {
  timestamps: true
});

userSchema.methods.fullName = function fullName() {
  return `${this.firstName} ${this.lastName}`;
};

module.exports = mongoose.model('User', userSchema);
```

We can use that in app.js:

```js
User.findOne({}, function(err, user){
  if (err) return console.log(err);
  console.log(user.fullName());
});
```

Now run the app with `node app.js` to see the result!

#### .statics

We can also create our own methods on the model itself (rather than the record).

```js
const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, required: true, unique: true },
  dob: Data,
  website: String,
  address: String,
  country: String,
}, {
  timestamps: true
});

userSchema.methods.fullName = function fullName() {
  return `${this.firstName} ${this.lastName}`;
};

userSchema.statics.all = function all(callback) {
  return this.find({}, callback);
};

module.exports = mongoose.model('User', userSchema);
```

Here we have created a new method which will find all of the users. We can use it like so:

```js
User.all((err, users) => {
  if (err) return console.log(err);
  console.log(users);
});
```

## Independent Practise (20 mins)

Using the code we just wrote and the [official Mongoose Models docs](http://mongoosejs.com/docs/models.html), make another model from scratch representing a WDI course.

- Think about the properties it needs.
- Then create a few courses in your `server.js` file.

## Conclusion (5 mins)

Mongoose is just a bridge to use MongoDB inside a NodeJS environment. There are a lot of options when creating a schema with Mongoose, we've just seen a few for the moment.