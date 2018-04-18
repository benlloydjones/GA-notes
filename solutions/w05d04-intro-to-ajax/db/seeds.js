const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const { dbURI } = require('../config/environment');
const Donut = require('../models/donut');

mongoose.connect(dbURI, { useMongoClient: true });

Donut.collection.drop();

Donut.create([{
  style: 'Old Fashioned',
  flavor: 'Chocolate'
}, {
  style: 'Cake',
  flavor: 'Coconut'
}, {
  style: 'Yeast',
  flavor: 'Frosted'
}, {
  style: 'Glazed',
  flavor: 'Plain'
}, {
  style: 'Cruller',
  flavor: 'Plain'
}, {
  style: 'French Cruller',
  flavor: 'Strawberry'
}, {
  style: 'Jelly',
  flavor: 'Raspberry'
}, {
  style: 'Cream',
  flavor: 'Boston Creme'
}, {
  style: 'Fritter',
  flavor: 'Apple'
}])
  .then(donuts => console.log(`${donuts.length} donuts created!`))
  .catch(err => console.log(err))
  .finally(mongoose.connection.close());
