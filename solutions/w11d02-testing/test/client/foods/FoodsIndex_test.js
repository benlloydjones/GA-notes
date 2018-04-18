/* global describe, it, beforeEach, before, after */
import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';
import Promise from 'bluebird';
import Axios from 'axios';
import { MemoryRouter } from 'react-router-dom';
import FoodsIndex from '../../../src/components/foods/FoodsIndex';

const foodData = [{
  id: 1,
  title: 'Mongolian Beef',
  image: 'beef.jpg',
  category: 'Dinner'
}, {
  id: 2,
  title: 'Spaghetti Carbonara',
  image: 'spaghetti.jpg',
  category: 'Dinner'
}];

describe('FoodsIndex tests', () => {
  let wrapper = null;
  let promise = null;

  before(done => {
    promise = Promise.resolve({ data: foodData });
    sinon.stub(Axios, 'get').returns(promise);
    done();
  });

  after(done => {
    Axios.get.restore();
    done();
  });

  beforeEach(done => {
    wrapper = mount(
      <MemoryRouter>
        <FoodsIndex />
      </MemoryRouter>
    );
    done();
  });

  it('should display food items', done => {
    promise.then(() => {
      wrapper.update();
      expect(wrapper.find('div.image-tile').length).to.eq(2);
      done();
    });
  });

  it('should display links to show pages', done => {
    promise.then(() => {
      wrapper.update();
      expect(wrapper.find('div.image-tile a').length).to.eq(2);
      expect(wrapper.find({ href: '/foods/1' }).length).to.eq(1);
      expect(wrapper.find({ href: '/foods/2' }).length).to.eq(1);
      done();
    });
  });

  it('should display the correct images', done => {
    promise.then(() => {
      wrapper.update();
      expect(wrapper.find({ src: 'beef.jpg' }).length).to.eq(1);
      expect(wrapper.find({ src: 'spaghetti.jpg' }).length).to.eq(1);
      done();
    });
  });

  it('should display the add food button when logged in', done => {
    window.localStorage.setItem('token', 'FAKETOKEN');
    promise.then(() => {
      wrapper.update();
      expect(wrapper.find('a.main-button').length).to.eq(1);
      window.localStorage.removeItem('token');
      done();
    });
  });

  it('should not display the add food button when not logged in', done => {
    promise.then(() => {
      wrapper.update();
      expect(wrapper.find('a.main-button').length).to.eq(0);
      done();
    });
  });
});
