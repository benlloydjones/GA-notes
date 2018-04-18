import React from 'react';
import Auth from '../../lib/Auth';
import { Link, withRouter } from 'react-router-dom';

const Navbar = ({ history }) => {

  const logout = (e) => {
    e.preventDefault();
    Auth.logout();
    history.push('/login');
  };

  return(
    <nav>
      {!Auth.isAuthenticated() && <Link to="/login" className="standard-button">Login</Link>}
      {' '}
      {!Auth.isAuthenticated() && <Link to="/register" className="standard-button">Register</Link>}
      {' '}
      {Auth.isAuthenticated() && <a href="#" onClick={logout} className="standard-button">Logout</a>}
    </nav>
  );
};

export default withRouter(Navbar);
