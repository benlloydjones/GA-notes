import React from 'react';
import RegisterForm from './RegisterForm';
import Axios from 'axios';

class Login extends React.Component {

  state = {
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

  handleChange = ({ target: { name, value }}) => {
    const user = Object.assign({}, this.state.user, { [name]: value });
    this.setState({ user });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    Axios.post('/api/register', this.state.user)
      .then(() => {
        this.props.history.push('/login');
      })
      .catch((err) => this.setState({ errors: err.response.data.errors }));
  }

  render() {
    return (
      <RegisterForm
        user={this.state.user}
        handleChange={this.handleChange}
        handleSubmit={this.handleSubmit}
        errors={this.state.errors}
      />
    );
  }
}

export default Login;
