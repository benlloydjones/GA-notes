/* globals api, expect, describe, it, xit, xdescribe, beforeEach */

require('../../helper');
const Shoe = require('../../../models/shoe');

describe('GET /api/shoes/:id', () => {

  let shoe = null;

  beforeEach(done => {
    Shoe.collection.remove();
    Shoe.create({
      brand: 'Nike',
      color: 'black',
      laced: true,
      material: 'canvas',
      price: 89.99
    })
      .then(_shoe => {
        shoe = _shoe;
        done();
      })
      .catch(done);
  });

  it('should return a 200 response', done => {
    api
      .get(`/api/shoes/${shoe.id}`)
      .set('Accept', 'application/json')
      .expect(200, done);
  });

  it('should respond with JSON', done => {
    api
      .get(`/api/shoes/${shoe.id}`)
      .set('Accept', 'application/json')
      .end((err, res) => {
        expect(res.header['content-type'])
          .to.be.eq('application/json; charset=utf-8');
        done();
      });
  });

  it('should respond with a JSON object', done => {
    api
      .get(`/api/shoes/${shoe.id}`)
      .set('Accept', 'application/json')
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.body).to.not.be.an('array');
        done();
      });
  });

  it('should have properities: id, brand, color, laced, material, price, createdAt, updatedAt', done => {
    api
      .get(`/api/shoes/${shoe.id}`)
      .set('Accept', 'application/json')
      .end((err, res) => {
        expect(res.body)
          .to.have.all.keys([
            'id',
            'brand',
            'color',
            'laced',
            'material',
            'price',
            'createdAt',
            'updatedAt'
          ]);
        done();
      });
  });

  it('should have the correct data', done => {
    api
      .get(`/api/shoes/${shoe.id}`)
      .set('Accept', 'application/json')
      .end((err, res) => {
        expect(res.body.id).to.eq(shoe.id);
        expect(res.body.brand).to.eq('Nike');
        expect(res.body.color).to.eq('black');
        expect(res.body.laced).to.eq(true);
        expect(res.body.material).to.eq('canvas');
        expect(res.body.price).to.eq(89.99);
        done();
      });
  });
});
