const mongoose   = require('mongoose');
mongoose.Promise = require('bluebird');

const { dbURI } = require('../config/env');
mongoose.connect(dbURI);

const City = require('../models/city');
City.collection.drop();

City
  .create([{
    name: 'London',
    country: 'United Kingdom',
    image: 'images/london.jpg',
    lat: 51.507398,
    lng: -0.127640
  },{
    name: 'Bristol',
    country: 'United Kingdom',
    image: 'images/bristol.jpg',
    lat: 51.454716,
    lng: -2.589345
  },{
    name: 'Liverpool',
    country: 'United Kingdom',
    image: 'images/liverpool.jpg',
    lat: 53.409230,
    lng: -3.001211
  }])
  .then((cities) => console.log(`${cities.length} cities created!`))
  .catch((err) => console.log(err))
  .finally(() => mongoose.connection.close());
