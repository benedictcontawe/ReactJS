import React from 'react';
import './Card.css';

interface CardProps {
  id: number;
  name: string;
  image_name: string;
  image_url: string;
  className?: string;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const Card: React.FC<CardProps> = ({
  id,
  name,
  image_name,
  image_url,
  className = '',
  onEdit,
  onDelete,
}) => {
  return (
    <div className={`card ${className}`}>
      <div className="card-content-wrapper">
        {image_url && (
          <div className="card-image-container">
            <img src={image_url} alt={name} className="card-image" />
          </div>
        )}
        <div className="card-text-container">
          <h2 className="card-title">{name}</h2>
          <p className="card-content">{image_name}</p>
          <div className="card-actions">
            <button className="edit-button" onClick={() => onEdit(id)}>
              Edit
            </button>
            <button className="delete-button" onClick={() => onDelete(id)}>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;