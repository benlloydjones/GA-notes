const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const { port, dbURI } = require('./config/environment');
const routes = require('./config/routes');

const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect(dbURI, { useMongoClient: true });

app.use(bodyParser.json());

app.use('/api', routes);

app.listen(port, () => console.log(`Express has started on port: ${port}`));

module.exports = app;
