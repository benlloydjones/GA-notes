function globalToJSON(schema) {
  schema.set('toJSON', {
    virtuals: true,
    transform(doc, json) {
      delete json._id;
      delete json.__v;
      return json;
    }
  });
}

module.exports = globalToJSON;
