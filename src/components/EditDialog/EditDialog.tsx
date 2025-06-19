import React, { useEffect, useState } from 'react';
import './EditDialog.css';

interface EditDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (item: { title: string; content: string }) => void;
    defaultValues: { title: string; content: string };
  }

  const EditDialog: React.FC<EditDialogProps> = ({ isOpen, onClose, onSave, defaultValues }) => {
    const [title, setTitle] = useState(defaultValues.title);
    const [content, setContent] = useState(defaultValues.content);
  
    useEffect(() => {
      setTitle(defaultValues.title);
      setContent(defaultValues.content);
    }, [defaultValues]);
  
    if (!isOpen) return null;
  
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSave({ title, content });
    };
  
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={e => e.stopPropagation()}> {　}
          <h2>Edit Blog Post</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
            <label htmlFor="title">Title:</label>
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            </div>
            <div className="form-group">
              <label htmlFor="content">Content:</label>
              <textarea
                placeholder="Content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </div>
            <div className="modal-actions">
              <button type="submit">Update</button>
              <button type="button" onClick={onClose}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    );
  };
  
  export default EditDialog;