import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/community/index.css';

const CommunityIndex = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      <div className="main-content">
        <h1 className="page-title">Community Learning</h1>
        
        <div className="learning-options">
          <div className="learning-card coming-soon">
            <h2 className="text-black">Coming Soon!</h2>
            <p>
              Our Community Learning platform is currently under development 
              and will be available in the next update.
            </p>
            <p className="recommendation">
              In the meantime, we encourage you to explore our Personal Learning path, 
              where you can benefit from personalized training and self-paced learning experiences.
            </p>
            <button 
              className="action-button animate-pulse"
              onClick={() => navigate('/dashboard')}
            >
              Try Personal Learning
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityIndex;
