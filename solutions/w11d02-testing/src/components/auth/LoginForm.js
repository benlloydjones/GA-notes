import React from 'react';

const LoginForm = ({ handleChange, handleSubmit, credentials, error }) => {
  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <input
          type="text"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          value={credentials.email}
          className="form-control"
        />
      </div>
      <div className="form-group">
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          value={credentials.password}
          className="form-control"
        />
      </div>
      {error && <div>
        <small className="has-error">{error}</small>
      </div>}
      <button className="btn btn-primary">Login</button>
    </form>
  );
};

export default LoginForm;
