# Express App Cheatsheet

* **1.** Make main server file. This is often called `index.js`, `server.js` or `app.js`.

```sh
touch index.js
```

* **2.** To create a `package.json` file run `yarn init` and hit enter for each option.
* **3.** Add Express to your project by running `yarn add express`.
* **4.** Require Express and create app inside your `index.js` file.

```js
const express = require('express');
const app = express();
```

* **5.** Create a basic request handler and ask the app to listen for requests to port 3000. Inside `index.js` add the following:

```js
const express = require('express');
const app = express();

app.get('/', (req, res) => res.send('Hello world'));

app.listen(3000, () => console.log('Listening on port 3000'));
```

* **6.** Create a `views` directory and add a `layout.ejs` file, a 'home.ejs` file and an `error.ejs` file.

```sh
mkdir views
touch views/layout.ejs
touch views/home.ejs
touch views/error.ejs
```

* **7.** Install `ejs` and `express-ejs-layouts` using yarn.

```
yarn add ejs express-ejs-layouts
```

* **9.** Set up the view engine inside `index.js`.

```js
const expressLayouts  = require('express-ejs-layouts');

app.set('view engine', 'ejs');
app.set('views', `${__dirname}/views`);

app.use(expressLayouts);
```

* **10.** Add some boilerplate HTML to your `layout.ejs` file, along with the `<%- body %>` tag.

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Express App</title>
  </head>
  <body>
    <%- body %>
  </body>
</html>
```

* **11.** Add some test HTML to the `home.ejs` file (`<h1>Home</h1>`) and then update the `/` route to be:

```js
app.get('/', (req, res) => res.render('home'));
```

* **12.** Test that you can go to `/` in Chrome and see your homepage.

* **13.** Install `morgan` using yarn and set it up inside `index.js`:

```js
const express = require('express');
const app = express();
const morgan = require('morgan');

app.set('view engine', 'ejs');
app.set('views', `${__dirname}/views`);

app.use(expressLayouts);
app.use(morgan('dev'));

app.get('/', (req, res) => res.render('home'));

app.listen(3000, () => console.log('Listening on port 3000'));
```

* **14.** Install `mongoose` and `bluebird` using yarn.
* **15.** Create your models inside a directory called `models`.
* **16.** Write a seeds file, using an existing one as reference. Remember to require `mongoose` and `bluebird` as well as your models and connect to your database. 
* **17.** At this point you might want to create a `config/environment.js` file and add the following:

```js
const dbURI = process.env.MONGODB_URI || 'mongodb://localhost/name-of-app';
const port = process.env.PORT || 3000;

module.exports = { dbURI, port };
```

* **18.** Test that your seed file runs without any errors by running `node db/seeds`.
* **19.** If you want, add a script to your `package.json` file to create an alias for `node db/seeds` under `yarn seed`.

```json
"scripts": {
  "seed": "node db/seeds"
}
```
* **20.** Hook up your app to the database by first requiring the `dbURI` from `config/environment.js`, and the using it to connect. Inside `index.js` add:

```js
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const { dbURI, port } = require('./config/environment');
mongoose.connect(dbURI, { useMongoClient: true });
```

* **21.** Create a `config/routes.js` file, and require express, create a router, and require your model.

```js
const express = require('express');
const router = express.Router();

const cars = require('../controllers/cars');
```
* **22.** Move your home route from your `index.js` file to the `config/routes.js` file, and export the router at the bottom of the file.

```js
const express = require('express');
const router = express.Router();

const cars = require('../controllers/cars');

router.get('/', (req, res) => res.render('home'));

module.exports = router;
```

* **23.** Require the router inside `index.js`, and ask the app to use it at the bottom of the file, just before `app.listen()`.

```js
const router = require('./config/routes');
```
```js
app.use(router);

app.listen(port, () => console.log(`Express is listening to port ${port}`));
```

* **24.** Create a controller for your resource.

```sh
mkdir controllers
touch controllers/cars.js
```

* **25.** Add a function to retrieve all instances of your resource from the database, and export it from the controller file. Remember to require your model.

```js
const Car = require('../models/car');

function carsIndex(req, res) {
  Car
    .find()
    .exec()
    .then((cars) =>{
      res.render('cars/index', {cars});
    })
    .catch((err) =>{
      res.status(500).render('error', { err });
    });
}

module.exports = {
  index: carsIndex
};
```

* **26.** Add a route to handle a `GET` request to the index page.

```js
router.route('/cars')
  .get(cars.index);
```

* **27.** Create a directory for your resource inside the `views` directory, and add an `index.ejs` inside that.

```sh
mkdir views/cars
touch views/cars/index.ejs
```

* **28.** Using EJS tags, loop through the data on the `index.ejs` page to display all of your resource.

```html
<% cars.forEach((car) => { %>
  <h1><%= car.make %></h1>
  <h2><%= car.model %></h2>
<% } %>
```

* **29.** Make sure that you can see your resources in Chrome when you visit the index page.
* **30.** Install `method-override` and `body-parser` using yarn.
* **31.** Require these and set them up inside `index.js`.

```js
const methodOverride  = require('method-override');
const bodyParser = require('body-parser');
```
```js
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride((req) => {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    const method = req.body._method;
    delete req.body._method;
    return method;
  }
}));
```
* **31.** Build out the other RESTful routes, testing as you go. For each route create a route inside `config/routes`, and a function inside your controller, exporting them inside `module.exports`, as well as creating views for new, edit and show.