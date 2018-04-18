/* globals api, expect, describe, it, xit, xdescribe, beforeEach */

require('../../helper');
const Shoe = require('../../../models/shoe');

describe('DELETE /api/shoes/:id', () => {

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

  it('should return a 204 response', done => {
    api
      .delete(`/api/shoes/${shoe.id}`)
      .set('Accept', 'application/json')
      .expect(204, done);
  });

  it('should send an empty response', done => {
    api
      .delete(`/api/shoes/${shoe.id}`)
      .set('Accept', 'application/json')
      .end((err, res) => {
        expect(res.body).to.deep.eq({});
        done();
      });
  });

  it('should have deleted the record', done => {
    api
      .delete(`/api/shoes/${shoe.id}`)
      .set('Accept', 'application/json')
      .end(() => {
        Shoe
          .findById(shoe.id)
          .exec()
          .then(shoe => {
            expect(shoe).to.eq(null);
            done();
          });
      });
  });
});
