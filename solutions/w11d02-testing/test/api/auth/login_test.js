/* global api, describe, it, expect, before, after */
require('../helper');
const atob = require('atob');

const User = require('../../../models/user');

const userData = [{
  firstname: 'test',
  lastname: 'test',
  username: 'test',
  email: 'test@test.com',
  password: 'test',
  passwordConfirmation: 'test'
}];

describe('POST /api/login', () => {
  let user = null;

  before(done => {
    User.create(userData, (err, users) => {
      user = users[0];
      done(err);
    });
  });

  after(done => {
    User.remove(done);
  });

  it('should return a 401 response with unrecognized credentials', done => {
    api
      .post('/api/login')
      .set('Accept', 'application/json')
      .send({ email: 'bad', password: 'bad' })
      .expect(401, done);
  });

  it('should return a 200 response', done => {
    api
      .post('/api/login')
      .set('Accept', 'application/json')
      .send(userData[0])
      .expect(200, done);
  });

  it('should return an object', done => {
    api
      .post('/api/login')
      .set('Accept', 'application/json')
      .send(userData[0])
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        done();
      });
  });

  it('should return a valid token', done => {
    api
      .post('/api/login')
      .set('Accept', 'application/json')
      .send(userData[0])
      .end((err, res) => {
        expect(res.body.token).to.be.a('string');
        const payload = JSON.parse(atob(res.body.token.split('.')[1]));
        expect(payload).to.be.an('object');
        expect(payload.userId).to.be.a('string');
        expect(payload.userId).to.equal(user.id);
        done();
      });
  });
});
