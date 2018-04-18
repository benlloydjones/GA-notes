import React from 'react';
import Axios from 'axios';
import { Link } from 'react-router-dom';
import Auth from '../../lib/Auth';

class FoodsIndex extends React.Component {
  state = {
    foods: []
  }

  componentWillMount() {
    Axios
      .get('/api/foods')
      .then(res => this.setState({ foods: res.data }))
      .catch(err => console.log(err));
  }

  render() {
    return (
      <div>
        <div className="row">
          <div className="page-banner col-md-12">
            {Auth.isAuthenticated() && <Link to="/foods/new" className="main-button">
              <i className="fa fa-plus" aria-hidden="true"></i>Add Food
            </Link>}
          </div>
          {this.state.foods.map(food => {
            return(
              <div key={food.id} className="image-tile col-md-4 col-sm-6 col-xs-12">
                <Link to={`/foods/${food.id}`}>
                  <img src={food.image} className="img-responsive" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default FoodsIndex;
