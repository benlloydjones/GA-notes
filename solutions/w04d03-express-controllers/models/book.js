const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: mongoose.Schema.ObjectId, ref: 'Author' },
  description: { type: String }
});

module.exports = mongoose.model('Book', bookSchema);
