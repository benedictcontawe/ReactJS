import React, { useState } from 'react'
import './Login.css'
import { Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login attempt with:', { email, password });
    alert(`Login attempted for: ${email}`);
    setEmail('');
    setPassword('');
  };
  return (
    <div className="auth-container">
      <div className="auth-card">
      <h1>Blog Application</h1> 
        <h2>Login</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="loginEmail">Email:</label>
            <input
              type="email"
              id="loginEmail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="auth-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="loginPassword">Password:</label>
            <input
              type="password"
              id="loginPassword"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="auth-input"
            />
          </div>
          <button type="submit" className="auth-button">Login</button>
        </form>
        <p className="auth-switch-text">
          Don't have an account? <Link to="/register" className="auth-link">Register here</Link>
        </p>
      </div>
    </div>
  );
}

export default Login