const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  text: String,
  rating: Number
});

const restaurantSchema = new mongoose.Schema({
  name: String,
  address: String,
  cuisine: String,
  comments: [ commentSchema ]
});

module.exports = mongoose.model('Restaurant', restaurantSchema);
