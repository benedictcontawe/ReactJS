import React from 'react';
import './Card.css';

interface CardProps {
  id: number;
  title: string;
  content: string;
  className?: string;
  titleClassName?: string;
  contentClassName?: string;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
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
      <div className="card-actions">
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