import React from 'react';
import './LoadingState.css';
/**
 * LoadingState component displays a loading indicator while posts are being fetched.
 * 
 * @returns JSX element showing a loading spinner/message
 */
const LoadingState: React.FC = () => {
  return (
    <div className="loading-state">
      <div className="loading-spinner"></div>
      <p className="loading-message">Loading posts...</p>
    </div>
  );
};

export default LoadingState;