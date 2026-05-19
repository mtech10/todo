import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../AuthContext";
import "./register.css";

const Register = ({ switchToLogin }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post("https://todo-obxm.onrender.com/register", {
        firstName,
        lastName,
        email,
        username,
        password,
      })
      .then((response) => {
        const { token, user } = response.data;

        login(token, user);
      })
      .catch((error) => {
        alert(error.response?.data?.message || "Registration failed");
      });
  };

  return (
    <div className="auth-container">
      <h2>Create an Account</h2>
      <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        

        <button type="submit" className="auth-submit-btn">
          Register
        </button>
      </form>
      <p>
        Already have an account? <button onClick={switchToLogin}>Log in</button>
      </p>
    </div>
  );
};

export default Register;
