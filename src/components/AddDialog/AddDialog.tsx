import { useState } from 'react';
import './AddDialog.css';

interface AddDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (newItem: { title: string; content: string }) => void;
}

const AddDialog = ({ isOpen, onClose, onAdd }: AddDialogProps) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  if (!isOpen) {
    return null;
  }
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && content.trim()) {
      onAdd({ title, content });
      setTitle('');
      setContent('');
    } else {
      alert('Please enter both title and content.');
    }
  };
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}> {　}
        <h2>Add New Blog Post</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title:</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="content">Content:</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={5}
              required
            ></textarea>
          </div>
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="cancel-button">
              Cancel
            </button>
            <button type="submit" className="add-button">
              Add Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDialog;