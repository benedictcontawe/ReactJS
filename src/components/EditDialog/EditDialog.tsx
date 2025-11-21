import React, { useEffect, useState } from 'react';
import './EditDialog.css';

interface EditDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (item: { name: string; image_name: string; image_url: string }) => void;
    defaultValues: { name: string; image_name: string; image_url: string };
  }

  const EditDialog: React.FC<EditDialogProps> = ({ isOpen, onClose, onSave, defaultValues }) => {
    const [name, setName] = useState(defaultValues.name);
    const [image_name, setImageName] = useState(defaultValues.image_name);
    const [image_url, setImageUrl] = useState(defaultValues.image_url);
  
    useEffect(() => {
      setName(defaultValues.name);
      setImageName(defaultValues.image_name);
      setImageUrl(defaultValues.image_url);
    }, [defaultValues]);
  
    if (!isOpen) return null;
  
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSave({ name, image_name, image_url });
    };

    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={e => e.stopPropagation()}> {　}
          <h2>Edit Item</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            </div>
            <div className="form-group">
              <label htmlFor="image_name">Image Name:</label>
              <input
                type="text"
                placeholder="Image Name"
                value={image_name}
                onChange={(e) => setImageName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="image_url">Image URL:</label>
              <input
                type="url"
                placeholder="Image URL"
                value={image_url}
                onChange={(e) => setImageUrl(e.target.value)}
                required
              />
              {/* TODO: Replace URL input with file upload functionality
                  1. Add file input for image selection from device
                  2. Upload selected image to Firebase Storage
                  3. Get download URL from Firebase Storage
                  4. Auto-populate image_url field with the Firebase Storage URL
                  5. Auto-populate image_name field with the original filename
                  6. Handle image replacement (delete old image from Storage if updating)
                  Reference: Similar to Android Studio/Flutter implementation
              */}
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