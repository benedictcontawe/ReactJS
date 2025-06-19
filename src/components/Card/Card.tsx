import React from 'react';
import './Card.css';

interface CardProps {
  id: number; // Add an ID or index to identify which card is being acted upon
  title: string;
  content: string;
  className?: string;
  titleClassName?: string;
  contentClassName?: string;
  onEdit: (id: number) => void; // Callback for edit button click
  onDelete: (id: number) => void; // Callback for delete button click
}

const Card: React.FC<CardProps> = ({
  id,
  title,
  content,
  className = '',
  titleClassName = '',
  contentClassName = '',
  onEdit,
  onDelete,
}) => {
  return (
    <div className={`card ${className}`}>
      <h2 className={`card-title ${titleClassName}`}>{title}</h2>
      <p className={`card-content ${contentClassName}`}>{content}</p>
      <div className="card-actions"> {/* Add a container for buttons */}
        <button className="edit-button" onClick={() => onEdit(id)}>
          Edit
        </button>
        <button className="delete-button" onClick={() => onDelete(id)}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default Card;