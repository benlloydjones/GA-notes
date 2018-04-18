import React from 'react';
import { Switch, Route } from 'react-router-dom';
import ProtectedRoute from '../utility/ProtectedRoute';

import FoodsIndex from './FoodsIndex';
import FoodsShow from  './FoodsShow';
import FoodsNew from './FoodsNew';
import FoodsEdit from './FoodsEdit';

const FoodsRoutes = () => {
  return (
    <Switch>
      <Route exact path="/" component={FoodsIndex} />
      <ProtectedRoute path="/foods/new" component={FoodsNew} />
      <ProtectedRoute path="/foods/:id/edit" component={FoodsEdit} />
      <Route path="/foods/:id" component={FoodsShow} />
    </Switch>
  );
};

export default FoodsRoutes;
