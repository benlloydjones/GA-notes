/* global describe, it, expect, before, beforeEach, after, afterEach, api */
require('../helper');
const jwt = require('jsonwebtoken');
const { secret } = require('../../../config/environment');
const User = require('../../../models/user');
const Food = require('../../../models/food');
const foodData = [{
  title: 'Mongolian Beef',
  image: 'https://scontent-lht6-1.cdninstagram.com/t51.2885-15/e15/1538538_573230372752861_370255472_n.jpg',
  category: 'Dinner'
}, {
  title: 'Spaghetti Carbonara',
  image: 'https://scontent-lht6-1.cdninstagram.com/t51.2885-15/e15/1516879_268343206655563_1975558125_n.jpg',
  category: 'Dinner'
}];

describe('DELETE /api/foods/:id', () => {

  let token = null;
  let food = null;

  before(done => {
    User.create({
      firstname: 'test',
      lastname: 'test',
      username: 'test',
      email: 'test@test.com',
      password: 'test',
      passwordConfirmation: 'test'
    }, (err, user) => {
      token = jwt.sign({ userId: user.id }, secret, { expiresIn: '1hr' });
      done(err);
    });
  });

  beforeEach(done => {
    Food.create(foodData, (err, foods) => {
      food = foods[0];
      done(err);
    });
  });

  after(done => {
    User.remove(done);
  });

  afterEach(done => {
    Food.remove(done);
  });

  it('should return a 401 response without a token', done => {
    api
      .delete(`/api/foods/${food.id}`)
      .set('Accept', 'application/json')
      .expect(401, done);
  });

  it('should return a 204 response with a token', done => {
    api
      .delete(`/api/foods/${food.id}`)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .expect(204, done);
  });

  it('should actually delete the record', done => {
    api
      .delete(`/api/foods/${food.id}`)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .end(() => {
        Food.findById(food.id, (err, food) => {
          expect(food).to.be.null;
          done();
        });
      });
  });

});
