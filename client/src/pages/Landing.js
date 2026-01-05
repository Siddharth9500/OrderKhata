import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Landing.css';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <div className="landing-content">
        <div className="logo-section">
          <h1 className="app-name">OrderKhata</h1>
          <p className="tagline">Smart ordering for local shops</p>
        </div>
        
        <div className="features-section">
          <div className="feature-item">
            <span className="feature-icon">📝</span>
            <p>Never forget items</p>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🤖</span>
            <p>Smart recommendations</p>
          </div>
          <div className="feature-item">
            <span className="feature-icon">⚡</span>
            <p>Quick & easy ordering</p>
          </div>
        </div>

        <div className="button-section">
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/login')}
          >
            Login
          </button>
          <button 
            className="btn btn-secondary"
            onClick={() => navigate('/signup')}
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default Landing;
