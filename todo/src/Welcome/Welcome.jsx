import React from "react";
import "./welcome.css";
import taskImg from "../Welcome/purple-calendar.png";

const Welcome = () => {
  return (
    <div className="welcome-container">
      <div className="welcome-content">
        <img src={taskImg} alt="TodoApp Logo" className="welcome-logo" />
        
        <h1 className="welcome-title">Task Master</h1>
        <p className="welcome-subtitle">Organize your life, one task at a time.</p>
        
        <div className="loading-spinner"></div>
      </div>
    </div>
  );
};

export default Welcome;