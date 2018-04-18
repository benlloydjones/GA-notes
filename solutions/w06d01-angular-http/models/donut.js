const mongoose = require('mongoose');

const donutSchema = new mongoose.Schema({
  style: String,
  flavor: String
});

donutSchema.set('toJSON', {
  // virtuals allows us to call the id for a resource as 'id' not '_id'
  virtuals: true,
  // when there is a json request using this model, we want to delete certain private or unwanted infomation
  transform(obj, json) {
    delete json._id;
    delete json.__v;
    return json;
  }
});



module.exports = mongoose.model('Donut', donutSchema);
