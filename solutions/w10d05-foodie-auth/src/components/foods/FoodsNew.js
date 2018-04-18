import React from 'react';
import Axios from 'axios';
import Auth from '../../lib/Auth';

import FoodsForm from './FoodsForm';

class FoodsNew extends React.Component {
  state = {
    food: {
      title: '',
      image: '',
      category: ''
    },
    errors: {}
  };

  componentWillMount() {
    console.log('Component will mount');
  }

  componentDidMount() {
    console.log('Component did mount');
  }

  handleChange = ({ target: { name, value } }) => {
    const food = Object.assign({}, this.state.food, { [name]: value });
    this.setState({ food });
  }

  handleSubmit = (e) => {
    e.preventDefault();

    Axios
      .post('/api/foods', this.state.food, {
        headers: { 'Authorization': 'Bearer ' + Auth.getToken() }
      })
      .then(() => this.props.history.push('/'))
      .catch(err => this.setState({ errors: err.response.data.errors }));
  }

  render() {
    return (
      <FoodsForm
        history={this.props.history}
        handleSubmit={this.handleSubmit}
        handleChange={this.handleChange}
        food={this.state.food}
        errors={this.state.errors}
      />
    );
  }
}

export default FoodsNew;
