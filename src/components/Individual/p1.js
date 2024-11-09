import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/individual/p1.css';

const PersonalTraining = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <nav className="sidebar-nav">
          <button className="nav-button" onClick={() => navigate('/dashboard')}>
            <i className="fas fa-arrow-left"></i>
            <span>Back</span>
            </button>
        </nav>
      </div>

      <div className="main-content">
        <h1 className="page-title">Personal Training</h1>
        
        <div className="training-content">
          <div className="welcome-section">
            <h2>Welcome to Your Personal Training Journey</h2>
            <p>Here you can track your progress and access personalized learning materials.</p>
          </div>
          
          {/* Add your personal training content here */}
        </div>
      </div>
    </div>
  );
};

export default PersonalTraining;
