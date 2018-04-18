const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
mongoose.plugin(require('./lib/globalToJSON'));
mongoose.Promise = require('bluebird');
const { port, env, dbURI } = require('./config/environment');
const routes = require('./config/routes');
const customResponses = require('./lib/customResponses');
const errorHandler = require('./lib/errorHandler');

const app = express();

mongoose.connect(dbURI);

if(env !== 'test') app.use(morgan('dev'));

app.use(express.static(`${__dirname}/public`));
app.use(bodyParser.json());

app.use(customResponses);
app.use('/api', routes);
app.get('/*', (req, res) => res.sendFile(`${__dirname}/public/index.html`));

app.use(errorHandler);

app.listen(port, () => console.log(`Express is listening on port ${port}`));