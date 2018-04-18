const mongoose = require('mongoose');

const birdSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  latinName: { type: String, required: true, unique: true },
  family: String,
  image: String,
  category: { type: mongoose.Schema.ObjectId, ref: 'Category' }
});

module.exports = mongoose.model('Bird', birdSchema);
