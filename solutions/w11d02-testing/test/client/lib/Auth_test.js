/* global describe, it, afterEach */

import { expect } from 'chai';

import Auth from '../../../src/lib/Auth';

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjM0In0.E_Y9nUBKNPTYeEwsdmOi-lW7cVxeEIr4RJipWnveXHA';

describe('Auth tests', () => {

  afterEach(done => {
    window.localStorage.removeItem('token');
    done();
  });

  it('`setToken()` should set a value to localStorage', done => {
    Auth.setToken(token);
    expect(window.localStorage.getItem('token')).to.equal(token);
    done();
  });

  it('`logout()` should remove a value to localStorage', done => {
    window.localStorage.setItem('token', token);
    Auth.logout();
    expect(window.localStorage.getItem('token')).to.be.null;
    done();
  });

  it('`isAuthenticated()` should return true if the is a token in localStorage', done => {
    window.localStorage.setItem('token', token);
    expect(Auth.isAuthenticated()).to.be.true;
    done();
  });

  it('`getPayload()` should return an object with `userId`', done => {
    window.localStorage.setItem('token', token);
    expect(Auth.getPayload().userId).to.be.a('string');
    done();
  });
});
