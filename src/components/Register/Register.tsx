import React, { useState } from 'react'
import './Register.css'
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';

const Register = () => {
  const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const navigate = useNavigate();
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) {
        console.error('Registration error:', error);
        alert(`Registration failed: ${error.message}`);
      } else {
        console.log('Registration successful', data);
        alert('Registration successful! Please check your email to confirm.');
        navigate('/login');
      }
    };
    return (
      <div className="auth-container">
        <div className="auth-card">
        <h1>Blog Application</h1> 
          <h2>Register</h2>
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="RegisterEmail">Email:</label>
              <input
                type="email"
                id="RegisterEmail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="auth-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="RegisterPassword">Password:</label>
              <input
                type="password"
                id="RegisterPassword"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="auth-input"
              />
            </div>
            <button type="submit" className="auth-button">Register</button>
          </form>
          <p className="auth-switch-text">
            Already have an account? <Link to="/login" className="auth-link">Login here</Link>
          </p>
        </div>
      </div>
    );
}

export default Register