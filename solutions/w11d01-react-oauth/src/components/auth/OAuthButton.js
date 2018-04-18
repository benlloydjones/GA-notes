import React from 'react';
import OAuth from '../../lib/OAuth';
import queryString from 'query-string';
import Axios from 'axios';
import Auth from '../../lib/Auth';
import { withRouter } from 'react-router-dom';

class OAuthButton extends React.Component {
  componentWillMount() {
    // grab `provider`, `location` and `history` from `this.props`
    const { provider, location, history } = this.props;
    // get the full provider data from `OAuth` class
    this.provider = OAuth.getProvider(provider);

    // if there's no code in the address bar OR the provider does not match that in localStorage, stop here.
    if(!location.search.match(/code/) || localStorage.getItem('provider') !== provider) return false;

    // send the code (and redirectUri) to the API
    Axios.post(this.provider.url, this.getData())
      .then(res => Auth.setToken(res.data.token)) // store the token in localStorage (you are now 'logged in')
      .then(() => localStorage.removeItem('provider')) // remove the chosen provider from localStorage
      .then(() => history.replace(location.pathname)) // remove the query string from the address bar
      .then(() => history.push('/')); // redirect to the home page
  }

  getData = () => {
    // get the querystring out of the address bar, as an object
    const data = queryString.parse(this.props.location.search);
    // add the current URI as a redirectUri for facebook (and possibly some other oAuth providers)
    data.redirectUri = window.location.origin + window.location.pathname;
    return data;
  }

  // store the chosen provider name in localStorage
  setProvider = () => {
    localStorage.setItem('provider', this.props.provider);
  }

  render() {
    return (
      <a
        className="btn btn-primary"
        href={this.provider.authLink}
        onClick={this.setProvider}
      >
        {this.props.children}
      </a>
    );
  }
}

// wrap the component in `withRouter` to make history and location available via props
export default withRouter(OAuthButton);
