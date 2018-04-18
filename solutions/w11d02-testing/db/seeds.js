const mongoose   = require('mongoose');
mongoose.Promise = require('bluebird');

const { dbURI } = require('../config/environment');
const Food      = require('../models/food');

const foodData = [{
  title: 'Mongolian Beef',
  image: 'https://scontent-lht6-1.cdninstagram.com/t51.2885-15/e15/1538538_573230372752861_370255472_n.jpg',
  category: 'Dinner'
}, {
  title: 'Spaghetti Carbonara',
  image: 'https://scontent-lht6-1.cdninstagram.com/t51.2885-15/e15/1516879_268343206655563_1975558125_n.jpg',
  category: 'Dinner'
}, {
  title: 'Nutella waffle sandwich cookies',
  image: 'https://scontent-lht6-1.cdninstagram.com/t51.2885-15/e15/928413_471097506327501_1175692522_n.jpg',
  category: 'Desert'
}, {
  title: 'Chilli cheese fries with bacon',
  image: 'https://scontent-lht6-1.cdninstagram.com/t51.2885-15/e15/1516917_1415620932013462_1276694992_n.jpg',
  category: 'Lunch'
}, {
  title: 'Norwegian Smoked Salmon & Caviar Cream Cheese on a Plain Bagel',
  image: 'https://scontent-lht6-1.cdninstagram.com/t51.2885-15/s640x640/sh0.08/e35/11820589_1071085172916383_422777308_n.jpg',
  category: 'Breakfast'
}, {
  title: 'Classic Fish & Chips',
  image: 'https://i.pinimg.com/originals/64/dd/d0/64ddd0b8ee5c83d72fed6a67af999214.jpg',
  category: 'Dinner'
}];

mongoose.connect(dbURI, { useMongoClient: true })
  .then(db => db.dropDatabase())
  .then(() => Food.create(foodData))
  .then(foods => console.log(`${foods.length} foods created!`))
  .catch(err => console.log(err))
  .finally(() => mongoose.connection.close());
