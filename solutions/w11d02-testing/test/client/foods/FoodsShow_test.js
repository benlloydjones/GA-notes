/* global describe, it, beforeEach, before, after */
import React from 'react';
import Promise from 'bluebird';
import axios from 'axios';
import sinon from 'sinon';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import FoodsShow from '../../../src/components/foods/FoodsShow';

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

describe('FoodsShow tests', () => {

  let wrapper = null;
  let promise = null;

  before(done => {
    promise = Promise.resolve({ data: foodData[0] });
    sinon.stub(axios, 'get').returns(promise);
    done();
  });

  after(done => {
    axios.get.restore();
    done();
  });

  beforeEach(done => {
    const props = {
      history: sinon.stub(),
      match: {
        params: { id: 1 }
      }
    };

    wrapper = mount(
      <MemoryRouter>
        <FoodsShow {...props} />
      </MemoryRouter>
    );
    done();
  });

  it('should display a single food item', done => {

    promise.then(() => {
      wrapper.update();
      expect(wrapper.find('.col-md-6 h3').text()).to.equal(foodData[0].title);
      expect(wrapper.find('.col-md-6 h4').text()).to.equal(foodData[0].category);
      expect(wrapper.find({ src: foodData[0].image }).length).to.equal(1);
      done();
    });
  });

  it('should display edit and delete buttons when logged in', done => {
    window.localStorage.setItem('token', 'FAKETOKEN');

    promise.then(() => {
      wrapper.update();
      expect(wrapper.find({ href: '/foods/1/edit' }).length).to.equal(1);
      expect(wrapper.find('.main-button i.fa.fa-trash').length).to.equal(1);
      window.localStorage.removeItem('token');
      done();
    });
  });

  it('should not display edit and delete buttons when not logged in', done => {
    promise.then(() => {
      wrapper.update();
      expect(wrapper.find({ href: '/foods/1/edit' }).length).to.equal(0);
      expect(wrapper.find('.main-button i.fa.fa-trash').length).to.equal(0);
      done();
    });
  });
});
