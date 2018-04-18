const express    = require('express');
const app        = express();
const morgan     = require('morgan');
const bodyParser = require('body-parser');
const mongoose   = require('mongoose');
const cors       = require('cors');
const env        = require('./config/env');
const routes     = require('./config/routes');
mongoose.Promise = require('bluebird');
mongoose.connect(env.db);

app.use(morgan('dev'));
app.use(cors());
app.use(express.static(`${__dirname}/public`));
app.use(bodyParser.json());

app.use('/api', routes);
app.get('/*', (req, res) => res.sendFile('/index.html'));

app.listen(env.port, console.log(`server has started on port: ${env.port}`));
