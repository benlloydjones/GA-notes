const mongoose = require('mongoose');

const donutSchema = new mongoose.Schema({
  style: String,
  flavor: String
});

module.exports = mongoose.model('Donut', donutSchema);
