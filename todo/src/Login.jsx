import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import "./Register/register.css";

const Login = ({ switchToRegister }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
// https://todo-app-backend-jnox.onrender.com/login
    axios.post('https://todo-obxm.onrender.com/login', { email, password })
      .then((response) => {
        const { token, user } = response.data;
        login(token, user); 
      })
      .catch((error) => {
        alert(error.response?.data?.message || "Login failed");
      });
  };

  return (
    <div className="auth-container">
      <h2>Welcome Back</h2>
      <form onSubmit={handleSubmit}>
        
        <div className="form-group">
          <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          placeholder="Email" 
          required 
        />
        </div>
         <div className="form-group">
        <input 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          placeholder="Password" 
          required 
        />
        </div>
        <button type="submit">Log In</button>
      </form>
      <p>Don't have an account? <button onClick={switchToRegister}>Sign up</button></p>
    </div>
  );
};

export default Login;