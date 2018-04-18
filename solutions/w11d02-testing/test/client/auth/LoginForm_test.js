/* global describe, it */
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import LoginForm from '../../../src/components/auth/LoginForm';

describe('LoginForm tests', () => {
  it('should render two input fields', done => {
    const props = {
      credentials: {
        email: '',
        password: ''
      },
      errors: {}
    };

    const wrapper = shallow(<LoginForm {...props} />);
    expect(wrapper.find('input').length).to.equal(2);
    done();
  });

  it('should populate the form', done => {
    const props = {
      credentials: {
        email: 'test@test.com',
        password: 'test'
      },
      errors: {}
    };

    const wrapper = shallow(<LoginForm {...props} />);
    expect(wrapper.find({ value: 'test@test.com' }).length).to.equal(1);
    expect(wrapper.find({ value: 'test' }).length).to.equal(1);
    done();
  });

  it('should correctly display errors', done => {
    const props = {
      credentials: {
        email: 'test@test.com',
        password: 'test'
      },
      error: 'Unrecognized credentials'
    };

    const wrapper = shallow(<LoginForm {...props} />);
    expect(wrapper.find('small.has-error').length).to.equal(1);
    done();
  });
});
