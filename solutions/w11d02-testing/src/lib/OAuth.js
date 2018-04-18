import queryString from 'query-string';

class OAuth {
  static providers = [{
    name: 'github',
    url: '/api/oauth/github',
    authEndpoint: 'https://github.com/login/oauth/authorize',
    scope: 'user:email',
    clientId: 'a4d7dff539facb662d03'
  }];

  static getAuthLink(provider) {
    const qs = {
      scope: provider.scope,
      client_id: provider.clientId,
      redirect_uri: window.location.origin + window.location.pathname
    };

    return `${provider.authEndpoint}?${queryString.stringify(qs)}`;
  }

  static getProvider(providerName) {
    const provider = this.providers.find(provider => provider.name === providerName);
    provider.authLink = this.getAuthLink(provider);
    return provider;
  }
}

export default OAuth;
