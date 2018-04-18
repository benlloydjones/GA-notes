const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  firstname: { type: String, required: 'First name is required' },
  lastname: { type: String, required: 'Last name is required' },
  username: { type: String, required: 'Username is required' },
  email: { type: String, required: 'Email is required', unique: 'That email is already taken' },
  password: { type: String, required: 'Password is required' }
});

userSchema
  .virtual('passwordConfirmation')
  .set(function setPasswordConfirmation(passwordConfirmation) {
    this._passwordConfirmation = passwordConfirmation;
  });

userSchema.pre('validate', function checkPassword(next) {
  if(!this._passwordConfirmation || this._passwordConfirmation !== this.password) {
    this.invalidate('passwordConfirmation', 'Passwords do not match');
  }
  next();
});

userSchema.pre('save', function hashPassword(next) {
  if(this.isModified('password')) {
    this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(8));
  }
  next();
});

userSchema.methods.validatePassword = function validatePassword(password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
