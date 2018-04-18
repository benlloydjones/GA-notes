const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const Restaurant = require('../models/restaurant');

const dbURI = 'mongodb://localhost/yummyhaus';
mongoose.connect(dbURI, { useMongoClient: true });

Restaurant.collection.drop();

Restaurant.create([{
  name: 'Regency',
  address: '17-19 Regency Street, Westminster, SW1P 4BY',
  cuisine: 'Greasy spoon',
  comments: [{
    text: 'Go there!',
    rating: 5
  }]
}])
  .then(restaurants => console.log(`${restaurants.length} restaurants created!`))
  .catch((err) => console.log(err))
  .finally(() => mongoose.connection.close());
