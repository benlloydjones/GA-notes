/* globals api, expect, describe, it, xit, xdescribe, beforeEach */

require('../../helper');
const Shoe = require('../../../models/shoe');

describe('POST /api/shoes', () => {

  beforeEach(done => {
    Shoe.collection.remove();
    done();
  });

  it('should return a 201 response', done => {
    api.post('/api/shoes')
      .set('Accept', 'application/json')
      .send({
        brand: 'Nike',
        color: 'black',
        laced: true,
        material: 'canvas',
        price: 89.99
      })
      .expect(201, done);
  });

  it('should respond with JSON', done => {
    api
      .post('/api/shoes')
      .set('Accept', 'application/json')
      .send({
        brand: 'Nike',
        color: 'black',
        laced: true,
        material: 'canvas',
        price: 89.99
      })
      .end((err, res) => {
        expect(res.header['content-type'])
          .to.be.eq('application/json; charset=utf-8');
        done();
      });
  });

  it('should respond with a JSON object', done => {
    api
      .post('/api/shoes')
      .set('Accept', 'application/json')
      .send({
        brand: 'Nike',
        color: 'black',
        laced: true,
        material: 'canvas',
        price: 89.99
      })
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.body).to.not.be.an('array');
        done();
      });
  });

  it('should have properities: id, brand, color, laced, material, price, createdAt, updatedAt', done => {
    api.post('/api/shoes')
      .set('Accept', 'application/json')
      .send({
        brand: 'Nike',
        color: 'black',
        laced: true,
        material: 'canvas',
        price: 89.99
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
    api.post('/api/shoes')
      .set('Accept', 'application/json')
      .send({
        brand: 'Nike',
        color: 'black',
        laced: true,
        material: 'canvas',
        price: 89.99
      })
      .end((err, res) => {
        expect(res.body.brand).to.eq('Nike');
        expect(res.body.color).to.eq('black');
        expect(res.body.laced).to.eq(true);
        expect(res.body.material).to.eq('canvas');
        expect(res.body.price).to.eq(89.99);
        done();
      });
  });
});
