/* global api, describe, it, expect, beforeEach, afterEach */
require('../helper');

const Food = require('../../../models/food');
const foodData = [{
  title: 'Mongolian Beef',
  image: 'beef.jpg',
  category: 'Dinner'
}, {
  title: 'Spaghetti Carbonara',
  image: 'spaghetti.jpg',
  category: 'Dinner'
}];

describe('GET /api/foods', () => {

  beforeEach(done => {
    Food.create(foodData, done);
  });

  afterEach(done => {
    Food.remove(done);
  });

  it('should return a 200 response', done => {
    api
      .get('/api/foods')
      .set('Accept', 'application/json')
      .expect(200, done);
  });

  it('should return an array', done => {
    api
      .get('/api/foods')
      .set('Accept', 'application/json')
      .end((err, res) => {
        expect(res.body).to.be.an('array');
        done();
      });
  });

  it('should return the correct data', done => {
    api
      .get('/api/foods')
      .set('Accept', 'application/json')
      .end((err, res) => {
        const foodItem = res.body[0];
        expect(foodItem.id).to.be.a('string');
        expect(foodItem.title).to.equal(foodData[0].title);
        expect(foodItem.image).to.equal(foodData[0].image);
        expect(foodItem.category).to.equal(foodData[0].category);
        done();
      });
  });
});
