import React from 'react';
import Axios from 'axios';
import Auth from '../../lib/Auth';

import FoodsForm from './FoodsForm';

class FoodsEdit extends React.Component {
  state = {
    food: {
      title: '',
      image: '',
      category: ''
    },
    errors: {}
  };

  componentDidMount() {
    Axios
      .get(`/api/foods/${this.props.match.params.id}`)
      .then(res => this.setState({ food: res.data }))
      .catch(err => console.log(err));
  }

  handleChange = ({ target: { name, value } }) => {
    const food = Object.assign({}, this.state.food, { [name]: value });
    this.setState({ food });
  }

  handleSubmit = (e) => {
    e.preventDefault();

    Axios
      .put(`/api/foods/${this.props.match.params.id}`, this.state.food, {
        headers: { 'Authorization': 'Bearer ' + Auth.getToken() }
      })
      .then(res => this.props.history.push(`/foods/${res.data.id}`))
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

export default FoodsEdit;
