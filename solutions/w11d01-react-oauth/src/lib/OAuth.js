import queryString from 'query-string';

class OAuth {
  // create a settings object for each of the providers you wish to support
  // tip: you can lift this almost directly from the satellizer docs: https://github.com/sahat/satellizer#configuration
  static providers = [{
    name: 'github',
    url: '/api/oauth/github',
    authEndpoint: 'https://github.com/login/oauth/authorize',
    scope: 'user:email',
    clientId: 'YOUR_GITHUB_CLIENT_ID' // paste your Github Client ID here
  }, {
    name: 'facebook',
    url: '/api/oauth/facebook',
    authEndpoint: 'https://www.facebook.com/v2.5/dialog/oauth',
    scope: 'email',
    clientId: 'YOUR_FACEBOOK_CLIENT_ID' // paste your Facebook Client ID here
  }];

  // method to generate the correct href for the oAuth popup, based on the current URL in the address bar
  static getAuthLink(provider) {
    const qs = {
      scope: provider.scope,
      client_id: provider.clientId,
      redirect_uri: window.location.href
    };

    return `${provider.authEndpoint}?${queryString.stringify(qs)}`;
  }

  // method to return the relevant setting object based on name of the provider
  static getProvider(providerName) {
    const provider = this.providers.find(provider => provider.name === providerName);
    provider.authLink = this.getAuthLink(provider);
    return provider;
  }
}

export default OAuth;
