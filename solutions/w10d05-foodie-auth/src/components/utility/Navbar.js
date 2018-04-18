import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import Auth from '../../lib/Auth';

const Navbar = ({ history }) => {

  function logout(e) {
    e.preventDefault();

    Auth.logout();
    history.push('/');
  }

  return(
    <nav>
      {!Auth.isAuthenticated() && <Link to="/login" className="standard-button">Login</Link>}
      {!Auth.isAuthenticated() && <Link to="/register" className="standard-button">Register</Link>}
      {Auth.isAuthenticated() && <a href="#" onClick={logout} className="standard-button">Logout</a>}
    </nav>
  );
};

export default withRouter(Navbar);
