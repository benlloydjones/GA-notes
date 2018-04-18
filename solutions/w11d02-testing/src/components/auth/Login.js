import React from 'react';
import LoginForm from './LoginForm';
import Axios from 'axios';
import Auth from '../../lib/Auth';

class Login extends React.Component {

  state = {
    credentials: {
      email: '',
      password: ''
    },
    error: ''
  };

  handleChange = ({ target: { name, value } }) => {
    const credentials = Object.assign({}, this.state.credentials, { [name]: value });
    this.setState({ credentials });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    Axios.post('/api/login', this.state.credentials)
      .then((res) => {
        Auth.setToken(res.data.token);
        this.props.history.push('/');
      })
      .catch(() => {
        Auth.logout();
        this.setState({ error: 'Unrecognized credentials' });
      });
  }

  render() {
    return (
      <div>
        <LoginForm
          credentials={this.state.credentials}
          handleChange={this.handleChange}
          handleSubmit={this.handleSubmit}
          error={this.state.error}
        />
      </div>
    );
  }
}

export default Login;
