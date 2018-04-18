const express = require('express');
const app = express();

const mongoose = require('mongoose');
const { port, dbURI } = require('./config/environment');
mongoose.connect(dbURI, { useMongoClient: true });

const morgan = require('morgan');
const routes = require('./config/routes');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const expressLayouts = require('express-ejs-layouts');

// settings
app.set('view engine', 'ejs');
app.set('views', `${__dirname}/views`);
app.use(expressLayouts);

// middleware
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride(req => {
  if(req.body && typeof req.body === 'object' && '_method' in req.body) {
    const method = req.body._method;
    delete req.body._method;
    return method;
  }
}));

// request handlers
app.use(routes);

// listen for traffic
app.listen(port, () => console.log('S\'up yo!'));
