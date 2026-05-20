import React, { useState, useEffect } from "react";
import Home from "./Home/Home";
import Register from './Register/Register';
import Login from './Login';
import Welcome from './Welcome/Welcome';
import { useAuth } from "./AuthContext";

const App = () => {
  const { user } = useAuth();
  const [showLogin, setShowLogin] = useState(true);
  const [showWelcome, setShowWelcome] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 5000);
    return () => clearTimeout(timer);r
  }, []);

  return (
    <div className="App">
        {showWelcome ? (
        <Welcome />
      ) : user ? (
          <Home />
        ) : showLogin ? (
          <Login switchToRegister={() => setShowLogin(false)} />
        ) : (
          <Register switchToLogin={() => setShowLogin(true)} />
        )}
    </div>
  );
};

export default App;
