const express    = require('express');
const mongoose   = require('mongoose');
const morgan     = require('morgan');
const bodyParser = require('body-parser');
const cors       = require('cors');
const app        = express();
const config     = require('./config/config');
const routes     = require('./config/routes');
const dest       = `${__dirname}/public`;

mongoose.connect(config.db);

if (app.get('env') !== 'production') app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(dest));

app.use('/api', routes);
app.get('/*', (req, res) => res.sendFile(`${dest}/index.html`));

app.listen(config.port, () => console.log(`Express has started on port: ${config.port}`));
