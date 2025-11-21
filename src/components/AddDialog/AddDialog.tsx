import { useState } from 'react';
import './AddDialog.css';

interface AddDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (newItem: { name: string; image_name: string; image_url: string }) => void;
}

const AddDialog = ({ isOpen, onClose, onAdd }: AddDialogProps) => {
  const [name, setName] = useState('');
  const [image_name, setImageName] = useState('');
  const [image_url, setImageUrl] = useState('');
  if (!isOpen) {
    return null;
  }
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && image_name.trim() && image_url.trim()) {
      onAdd({ name, image_name, image_url });
      setName('');
      setImageName('');
      setImageUrl('');
    } else {
      alert('Please enter name, image name, and image URL.');
    }
  };
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}> {　}
        <h2>Add New Item</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="image_name">Image Name:</label>
            <input
              type="text"
              id="image_name"
              value={image_name}
              onChange={(e) => setImageName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="image_url">Image URL:</label>
            <input
              type="url"
              id="image_url"
              value={image_url}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              required
            />
            {/* TODO: Replace URL input with file upload functionality
                1. Add file input for image selection from device
                2. Upload selected image to Firebase Storage
                3. Get download URL from Firebase Storage
                4. Auto-populate image_url field with the Firebase Storage URL
                5. Auto-populate image_name field with the original filename
                Reference: Similar to Android Studio/Flutter implementation
            */}
          </div>
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="cancel-button">
              Cancel
            </button>
            <button type="submit" className="add-button">
              Add Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDialog;