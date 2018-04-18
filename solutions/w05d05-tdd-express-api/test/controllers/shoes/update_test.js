/* globals api, expect, describe, it, xit, xdescribe, beforeEach */

require('../../helper');
const Shoe = require('../../../models/shoe');

describe('PUT /api/shoes/:id', () => {

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
      .put(`/api/shoes/${shoe.id}`)
      .set('Accept', 'application/json')
      .send({
        brand: 'Adidas',
        color: 'blue',
        laced: true,
        material: 'canvas',
        price: 74.99
      })
      .expect(200, done);
  });

  it('should respond with JSON', done => {
    api
      .put(`/api/shoes/${shoe.id}`)
      .set('Accept', 'application/json')
      .send({
        brand: 'Adidas',
        color: 'blue',
        laced: true,
        material: 'canvas',
        price: 74.99
      })
      .end((err, res) => {
        expect(res.header['content-type'])
          .to.be.eq('application/json; charset=utf-8');
        done();
      });
  });

  it('should respond with a JSON object', done => {
    api
      .put(`/api/shoes/${shoe.id}`)
      .set('Accept', 'application/json')
      .send({
        brand: 'Adidas',
        color: 'blue',
        laced: true,
        material: 'canvas',
        price: 74.99
      })
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.body).to.not.be.an('array');
        done();
      });
  });

  it('should have properities: id, brand, color, laced, material, price, createdAt, updatedAt', done => {
    api
      .put(`/api/shoes/${shoe.id}`)
      .set('Accept', 'application/json')
      .send({
        brand: 'Adidas',
        color: 'blue',
        laced: true,
        material: 'canvas',
        price: 74.99
      })
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
      .put(`/api/shoes/${shoe.id}`)
      .set('Accept', 'application/json')
      .send({
        brand: 'Adidas',
        color: 'blue',
        laced: true,
        material: 'canvas',
        price: 74.99
      })
      .end((err, res) => {
        expect(res.body.brand).to.eq('Adidas');
        expect(res.body.color).to.eq('blue');
        expect(res.body.laced).to.eq(true);
        expect(res.body.material).to.eq('canvas');
        expect(res.body.price).to.eq(74.99);
        done();
      });
  });
});
