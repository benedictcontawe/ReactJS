import React from 'react';
import './EmptyState.css';
/**
 * EmptyState component displays a message when there are no blog posts.
 * 
 * @returns JSX element showing an empty state message
 */
const EmptyState: React.FC = () => {
  return (
    <div className="empty-state">
      <p className="empty-state-title">No blog posts yet</p>
      <p className="empty-state-message">
        Click the + button below to create your first blog post!
      </p>
    </div>
  );
};

export default EmptyState;