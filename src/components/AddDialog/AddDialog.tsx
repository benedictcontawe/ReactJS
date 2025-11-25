import React, { useState, useRef } from 'react';
import './AddDialog.css';
import CameraIcon from '../CameraIcon';
import { processFile, isImageExtension, uploadFileToStorage } from '../../utils/fileUpload';

interface AddDialogProps {
  onClose: () => void;
  onAdd: (newItem: { name: string; image_name: string; image_url: string }) => void;
}

const AddDialog = ({ onClose, onAdd }: AddDialogProps) => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [fileInfo, setFileInfo] = useState<{
    fileName: string;
    fileExtension: string;
    fileSize: string;
    fileBytes: ArrayBuffer | null;
  } | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * Handles the file selection event from the input.
   * It processes the selected file to extract its info and creates a temporary
   * URL for image previews.
   * @param e The change event from the file input element.
   */
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    try {
      const info = await processFile(file);
      setFileInfo({
        fileName: info.fileName,
        fileExtension: info.fileExtension,
        fileSize: info.fileSize,
        fileBytes: info.fileBytes
      });
      if (isImageExtension(info.fileExtension)) {
        const blob = new Blob([info.fileBytes]);
        const url = URL.createObjectURL(blob);
        setPreviewUrl(url);
      }
    } catch (error) {
      console.error('Error processing file:', error);
      alert('Error processing file. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleMediaButtonClick = () => fileInputRef.current?.click();

  /**
   * Handles the form submission.
   * It validates the form, uploads the selected file to the backend API,
   * calls the onAdd callback with the new item's data, and then resets the form.
   * @param e The form submission event.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Please enter a name.');
      return;
    }
    if (!fileInfo || !isImageExtension(fileInfo.fileExtension)) {
      alert('Please select an image file.');
      return;
    }
    setLoading(true);
    try {
      const file = fileInputRef.current?.files?.[0];
      if (!file) {
        alert('Please select a file.');
        setLoading(false);
        return;
      }
      const downloadURL = await uploadFileToStorage(file);      
      onAdd({ 
        name, 
        image_name: fileInfo.fileName, 
        image_url: downloadURL 
      });      
      setName('');
      setFileInfo(null);
      setPreviewUrl(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setName('');
    setFileInfo(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClose();
  };

  const renderImage = () => {
    if (loading) {
      return (
        <div className="media-preview-loading">
          <div className="spinner"></div>
        </div>
      );
    }
    return (
      <React.Fragment>
        <div className="media-preview">
          { fileInfo && isImageExtension(fileInfo.fileExtension) && previewUrl ? (
            <img
              src={previewUrl}
              alt="Preview"
              className="preview-image"
            />
          ) : (
            <CameraIcon className="camera-icon" />
          ) }
        </div>
        { fileInfo && isImageExtension(fileInfo.fileExtension) && (
          <div className="file-info">
            {fileInfo.fileName}.{fileInfo.fileExtension} {fileInfo.fileSize}
          </div>
        ) }
      </React.Fragment>
    );
  };

  const renderFooter = () => (
    <div className="modal-actions">
      <button type="button" onClick={handleClose} className="cancel-button">
        Cancel
      </button>
      <button type="submit" className="add-button" disabled={loading}>
        Add
      </button>
    </div>
  );

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2>Add Name</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter Name"
              required
            />
          </div>          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/jpeg,image/jpg,image/png,image/webp"
            style={{ display: 'none' }}
          />
          {!loading && (
            <button
              type="button"
              onClick={handleMediaButtonClick}
              className="add-media-button"
            >
              + Add Media
            </button>
          )}
          {renderImage()}
          {renderFooter()}
        </form>
      </div>
    </div>
  );
};

export default AddDialog;