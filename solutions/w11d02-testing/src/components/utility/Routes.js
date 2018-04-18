import React from 'react';
import { Switch, Route } from 'react-router-dom';
import ProtectedRoute from '../utility/ProtectedRoute';

import FoodsIndex from '../foods/FoodsIndex';
import FoodsShow from  '../foods/FoodsShow';
import FoodsNew from '../foods/FoodsNew';
import FoodsEdit from '../foods/FoodsEdit';
import Login from '../auth/Login';
import Register from '../auth/Register';
import NoRoute from './NoRoute';

const Routes = () => {
  return (
    <Switch>
      <Route exact path="/" component={FoodsIndex} />
      <ProtectedRoute exact path="/foods/new" component={FoodsNew} />
      <ProtectedRoute exact path="/foods/:id/edit" component={FoodsEdit} />
      <Route exact path="/foods/:id" component={FoodsShow} />
      <Route exact path="/login" component={Login} />
      <Route exact path="/register" component={Register} />
      <Route component={NoRoute} />
    </Switch>
  );
};

export default Routes;
