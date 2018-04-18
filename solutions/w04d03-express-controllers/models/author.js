const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true }
});

module.exports = mongoose.model('Author', authorSchema);
