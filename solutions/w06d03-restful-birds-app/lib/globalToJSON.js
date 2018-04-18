function globalToJSON(schema) {
  schema.set('toJSON', {
    virtuals: true,
    transform(obj, json) {
      delete json._id;
      delete json.__v;
    }
  });
}

module.exports = globalToJSON;