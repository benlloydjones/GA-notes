const express    = require('express');
const app        = express();
const morgan     = require('morgan');
const bodyParser = require('body-parser');
const mongoose   = require('mongoose');
const cors       = require('cors');
const { dbURI, port } = require('./config/env');
const routes     = require('./config/routes');
const dest       = `${__dirname}/public`;
mongoose.Promise = require('bluebird');
mongoose.connect(dbURI);

app.use(morgan('dev'));
app.use(cors());
app.use(express.static(dest));
app.use(bodyParser.json());

app.use('/api', routes);
app.get('/*', (req, res) => res.sendFile(`${dest}/index.html`));

app.listen(port, console.log(`server has started on port: ${port}`));
