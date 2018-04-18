/* global api, describe, it, expect, before, after, afterEach */
require('../helper');

const jwt = require('jsonwebtoken');
const { secret } = require('../../../config/environment');
const Food = require('../../../models/food');
const User = require('../../../models/user');

const foodData = [{
  title: 'Mongolian Beef',
  image: 'beef.jpg',
  category: 'Dinner'
}, {
  title: 'Spaghetti Carbonara',
  image: 'spaghetti.jpg',
  category: 'Dinner'
}];

describe('POST /api/foods', () => {
  let token = null;

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

  after(done => {
    User.remove(done);
  });

  afterEach(done => {
    Food.remove(done);
  });

  it('should return a 401 response', done => {
    api
      .post('/api/foods')
      .set('Accept', 'application/json')
      .send(foodData[0])
      .expect(401, done);
  });

  it('should return a 201 response with a token', done => {
    api
      .post('/api/foods')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send(foodData[0])
      .expect(201, done);
  });

  it('should return an object', done => {
    api
      .post('/api/foods')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send(foodData[0])
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        done();
      });
  });

  it('should return the correct data', done => {
    api
      .post('/api/foods')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send(foodData[0])
      .end((err, res) => {
        const foodItem = res.body;
        expect(foodItem.id).to.be.a('string');
        expect(foodItem.title).to.equal(foodData[0].title);
        expect(foodItem.image).to.equal(foodData[0].image);
        expect(foodItem.category).to.equal(foodData[0].category);
        done();
      });
  });
});
