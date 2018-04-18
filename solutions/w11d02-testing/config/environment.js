const port  = process.env.PORT || 4000;
const env = process.env.NODE_ENV || 'development';
const dbURI = process.env.MONGODB_URI || `mongodb://localhost/foodie-${env}`;
const secret = 'f^dh@CVis--[P';

module.exports = { port, dbURI, secret, env };
