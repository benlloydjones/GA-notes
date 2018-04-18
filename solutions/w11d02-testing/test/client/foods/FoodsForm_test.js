/* global describe, it */
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import FoodsForm from '../../../src/components/foods/FoodsForm';

describe('FoodsForm tests', () => {
  it('should render two input fields and one select', done => {
    const props = {
      food: {
        title: '',
        image: '',
        category: ''
      },
      errors: {}
    };

    const wrapper = shallow(<FoodsForm {...props} />);
    expect(wrapper.find('input').length).to.equal(2);
    expect(wrapper.find('select').length).to.equal(1);
    done();
  });

  it('should populate the form', done => {
    const props = {
      food: {
        title: 'title',
        image: 'image',
        category: 'category'
      },
      errors: {}
    };

    const wrapper = shallow(<FoodsForm {...props} />);
    expect(wrapper.find({ value: 'title' }).length).to.equal(1);
    expect(wrapper.find({ value: 'image' }).length).to.equal(1);
    expect(wrapper.find({ value: 'category' }).length).to.equal(1);
    done();
  });

  it('should correctly display errors', done => {
    const props = {
      food: {
        title: '',
        image: '',
        category: ''
      },
      errors: {
        title: 'Title is required',
        image: 'Image is required',
        category: 'Category is required'
      }
    };

    const wrapper = shallow(<FoodsForm {...props} />);
    expect(wrapper.find('div.form-group.has-error').length).to.equal(3);
    expect(wrapper.find('small.has-error').length).to.equal(3);
    done();
  });
});
