const mongoose = require('mongoose');

const foodSchema = mongoose.Schema({
  title: { type: String, required: 'Title is required' },
  image: { type: String, required: 'Image is required' },
  category: { type: String, required: 'Category is required' }
});

module.exports = mongoose.model('food', foodSchema);
