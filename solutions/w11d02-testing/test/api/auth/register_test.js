/* global api, describe, it, expect, after */
require('../helper');

const User = require('../../../models/user');

const userData = [{
  firstname: 'test',
  lastname: 'test',
  username: 'test',
  email: 'test@test.com',
  password: 'test',
  passwordConfirmation: 'test'
}];

describe('POST /api/register', () => {

  after(done => {
    User.remove(done);
  });

  it('should return a 422 response with incorrect details', done => {
    api
      .post('/api/register')
      .set('Accept', 'application/json')
      .send({ email: 'bad', password: 'bad' })
      .expect(422, done);
  });

  it('should return a 200 response', done => {
    api
      .post('/api/register')
      .set('Accept', 'application/json')
      .send(userData[0])
      .expect(200, done);
  });

  it('should return an object', done => {
    api
      .post('/api/register')
      .set('Accept', 'application/json')
      .send(userData[0])
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        done();
      });
  });

  it('should create a user object', done => {
    api
      .post('/api/register')
      .set('Accept', 'application/json')
      .send(userData[0])
      .end(() => {
        User.findOne({ email: userData[0].email }, (err, user) => {
          expect(user).to.be.an('object');
          expect(user.username).to.equal(userData[0].username);
          expect(user.email).to.equal(userData[0].email);
          done();
        });
      });
  });
});
