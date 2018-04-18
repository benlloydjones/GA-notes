/* global describe, it */
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import RegisterForm from '../../../src/components/auth/RegisterForm';

describe('RegisterForm tests', () => {
  it('should render two input fields', done => {
    const props = {
      user: {
        firstname: '',
        lastname: '',
        username: '',
        email: '',
        password: '',
        passwordConfirmation: ''
      },
      errors: {}
    };

    const wrapper = shallow(<RegisterForm {...props} />);
    expect(wrapper.find('input').length).to.equal(6);
    done();
  });

  it('should populate the form', done => {
    const props = {
      user: {
        firstname: 'test',
        lastname: 'test',
        username: 'test',
        email: 'test@test.com',
        password: 'test',
        passwordConfirmation: 'test'
      },
      errors: {}
    };

    const wrapper = shallow(<RegisterForm {...props} />);
    expect(wrapper.find({ name: 'email', value: 'test@test.com' }).length).to.equal(1);
    expect(wrapper.find({ name: 'firstname', value: 'test' }).length).to.equal(1);
    expect(wrapper.find({ name: 'lastname', value: 'test' }).length).to.equal(1);
    expect(wrapper.find({ name: 'username', value: 'test' }).length).to.equal(1);
    expect(wrapper.find({ name: 'password', value: 'test' }).length).to.equal(1);
    expect(wrapper.find({ name: 'passwordConfirmation', value: 'test' }).length).to.equal(1);
    done();
  });

  it('should correctly display errors', done => {
    const props = {
      user: {
        firstname: '',
        lastname: '',
        username: '',
        email: '',
        password: '',
        passwordConfirmation: ''
      },
      errors: {
        firstname: 'First name is required',
        lastname: 'Last name is required',
        username: 'Username is required',
        email: 'Email is required',
        password: 'Password is required',
        passwordConfirmation: 'Passwords do not match'
      }
    };

    const wrapper = shallow(<RegisterForm {...props} />);
    expect(wrapper.find('div.form-group.has-error').length).to.equal(6);
    expect(wrapper.find('small.has-error').length).to.equal(6);
    done();
  });
});
