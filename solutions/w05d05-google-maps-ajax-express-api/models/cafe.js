const mongoose = require('mongoose');

const cafeSchema = new mongoose.Schema({
  name: String,
  address: String,
  image: String,
  rating: Number,
  longitude: Number,
  latitude: Number
});

module.exports = mongoose.model('Cafe', cafeSchema);
