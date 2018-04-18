class Auth {
  static setToken(token) {
    return window.localStorage.setItem('token', token);
  }

  static getToken() {
    return window.localStorage.getItem('token');
  }

  static isAuthenticated() {
    return !!this.getToken();
  }

  static logout() {
    window.localStorage.removeItem('token');
  }

  static getPayload() {
    const token = this.getToken();
    if(!token) return null;
    return JSON.parse(atob(token.split('.')[1]));
  }
}

export default Auth;
