import React from 'react';
import { withRouter, Route, Redirect } from 'react-router-dom';
import Auth from '../../lib/Auth';

const ProtectedRoute = ({ component: Component, ...other }) => {
  return (
    <Route {...other} render={props => (
      Auth.isAuthenticated() ? (
        <Component {...props}/>
      ) : (
        <Redirect to="/login"/>
      )
    )}/>
  );
};


export default withRouter(ProtectedRoute);
