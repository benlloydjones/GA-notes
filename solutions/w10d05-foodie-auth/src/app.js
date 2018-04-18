import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Link } from 'react-router-dom';

import Navbar from './components/utility/Navbar';
import Routes from './components/utility/Routes';

import 'bootstrap-css-only';
import 'font-awesome/css/font-awesome.css';
import './scss/style.scss';

class App extends React.Component {

  render() {
    return (
      <Router>
        <div className="container">
          <header>
            <h1><Link to="/">foodie</Link></h1>
            <h2>For the <span>foodie</span> in everyone...</h2>
            <Navbar />
            <hr />
            <i className="fa fa-cutlery" aria-hidden="true"></i>
          </header>
          <main>
            <Routes />
          </main>
        </div>
      </Router>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('app')
);
