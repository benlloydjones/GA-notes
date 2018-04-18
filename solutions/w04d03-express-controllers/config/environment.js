const dbURI = process.env.MONGODB_URI || 'mongodb://localhost/restful-routing';
const port = process.env.PORT || 3000;

module.exports = { dbURI, port };
