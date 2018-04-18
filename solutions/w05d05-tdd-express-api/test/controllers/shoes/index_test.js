/* globals api, expect, describe, it, xit, xdescribe, beforeEach */

require('../../helper');
const Shoe = require('../../../models/shoe');

describe('GET /api/shoes', () => {

  beforeEach(done => {
    Shoe.collection.remove();
    Shoe.create({
      brand: 'Nike',
      color: 'black',
      laced: true,
      material: 'leather',
      price: 49.99
    })
      .then(() => done())
      .catch(done);
  });

  it('should return a 200 response', done => {
    api
      .get('/api/shoes')
      .set('Accept', 'application/json')
      .expect(200, done);
  });

  it('should respond with a JSON object', done => {
    api
      .get('/api/shoes')
      .set('Accept', 'application/json')
      .end((err, res) => {
        expect(res.header['content-type'])
          .to.be.eq('application/json; charset=utf-8');
        done();
      });
  });

  it('should return an array', done => {
    api
      .get('/api/shoes')
      .set('Accept', 'application/json')
      .end((err, res) => {
        expect(res.body).to.be.an('array');
        done();
      });
  });

  it('should have properities: id, brand, color, laced, material, price, createdAt, updatedAt', done => {
    api.get('/api/shoes')
      .set('Accept', 'application/json')
      .end((err, res) => {
        expect(res.body)
          .and.be.an('array')
          .and.have.property(0)
          .and.have.all.keys([
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

  it('should have the correct data types', done => {
    api.get('/api/shoes')
      .set('Accept', 'application/json')
      .end((err, res) => {
        const singleShoe = res.body[0];

        expect(singleShoe.id).to.be.a('string');
        expect(singleShoe.brand).to.be.a('string');
        expect(singleShoe.color).to.be.a('string');
        expect(singleShoe.laced).to.be.a('boolean');
        expect(singleShoe.material).to.be.a('string');
        expect(singleShoe.price).to.be.a('number');

        done();
      });
  });
});
