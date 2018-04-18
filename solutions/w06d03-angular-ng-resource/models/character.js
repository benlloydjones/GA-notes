const mongoose = require('mongoose');

const CharacterSchema = mongoose.Schema({
  name: { type: String, trim: true, required: true },
  lightsaber: { type: String, trim: true }
});

module.exports = mongoose.model('Character', CharacterSchema);
