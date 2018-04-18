const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const { dbURI } = require('../config/environment');
const Cafe = require('../models/cafe');

mongoose.connect(dbURI, { useMongoClient: true });

Cafe.collection.drop();

Cafe.create([{
  name: 'Allpress Espresso Roastery & Cafe',
  address: '55 Dalston Ln, London E8 2NG',
  rating: 5,
  image: 'images/allpress.jpg',
  latitude: 51.546365,
  longitude: -0.070521
},{
  name: 'Holy Shot Coffee',
  address: '155 Bethnal Green Rd, London E2 7DG',
  rating: 4,
  image: 'images/holy-shot.jpg',
  latitude: 51.525482,
  longitude: -0.070672
},{
  name: 'Department of Coffee and Social Affairs',
  address: '133 Whitechapel High St, London E1 7QA',
  rating: 4,
  image: 'images/department-of-coffee.jpeg',
  latitude: 51.514855,
  longitude: -0.073387
},{
  name: 'Foxcroft & Ginger',
  address: '69-89 Mile End Rd, London E1 4TT',
  rating: 3,
  image: 'images/foxcroft-and-ginger.png',
  latitude: 51.520771,
  longitude: -0.051871
}])
  .then(cafes => console.log(`${cafes.length} cafes created!`))
  .catch(err => console.log(err))
  .finally(mongoose.connection.close());
