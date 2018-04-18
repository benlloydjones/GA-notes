const mongoose = require('mongoose');

const shoeSchema = new mongoose.Schema({
  brand: String,
  color: String,
  laced: Boolean,
  material: String,
  price: Number
}, {
  timestamps: true
});

shoeSchema.set('toJSON', {
  virtuals: true,
  transform(doc, json) {
    delete json._id;
    delete json.__v;
    return json;
  }
});

module.exports = mongoose.model('Shoe', shoeSchema);
