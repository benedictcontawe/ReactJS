import React, { useEffect, useState, useRef } from 'react';
import './EditDialog.css';
import CameraIcon from '../CameraIcon';
import { processFile, isImageExtension, uploadFileToStorage } from '../../utils/fileUpload';
import BrokenImageIcon from '../BrokenImageIcon';

interface EditDialogProps {
    onClose: () => void;
    onSave: (item: { name: string; image_name: string; image_url: string }) => void;
    defaultValues: { name: string; image_name: string; image_url: string };
  }

  const EditDialog: React.FC<EditDialogProps> = ({ onClose, onSave, defaultValues }) => {
    const [name, setName] = useState(defaultValues.name);
    const [image_name, setImageName] = useState(defaultValues.image_name);
    const [image_url, setImageUrl] = useState(defaultValues.image_url);
    const [loading, setLoading] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [fileInfo, setFileInfo] = useState<{
      fileName: string;
      fileExtension: string;
      fileSize: string;
      fileBytes: ArrayBuffer | null;
    } | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);  
    useEffect(() => {
      setName(defaultValues.name);
      setImageName(defaultValues.image_name);
      setImageUrl(defaultValues.image_url);
      setFileInfo(null);
      setImageError(false);
      setPreviewUrl(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }, [defaultValues]);
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
          if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
          }
          setImageError(false);//Reset error state when a new image is selected
          setPreviewUrl(url);
          setImageName(info.fileName);
        }
      } catch (error) {
        console.error('Error processing file:', error);
        alert('Error processing file. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    const handleMediaButtonClick = () => fileInputRef.current?.click();

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!name.trim()) {
        alert('Please enter a name.');
        return;
      }

      setLoading(true);
      try {
        let finalImageUrl = image_url;
        let finalImageName = image_name;

        // If a new file was selected, upload it
        if (fileInfo && isImageExtension(fileInfo.fileExtension)) {
          const file = fileInputRef.current?.files?.[0];
          if (file) {
            finalImageUrl = await uploadFileToStorage(file);
            finalImageName = fileInfo.fileName;
          }
        }

        onSave({ 
          name, 
          image_name: finalImageName, 
          image_url: finalImageUrl 
        });
        
        // Reset preview if new file was selected
        if (previewUrl && fileInfo) {
          URL.revokeObjectURL(previewUrl);
          setPreviewUrl(null);
          setFileInfo(null);
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        }
      } catch (error) {
        console.error('Error saving:', error);
        alert('Error saving item. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    const handleClose = () => {
      if (previewUrl && fileInfo) {
        URL.revokeObjectURL(previewUrl);
      }
      setFileInfo(null);
      setPreviewUrl(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      onClose();
    };

    // Determine what image to show
    const getImageToShow = () => {
      if (loading) {
        return null; // Will show loading indicator
      }
      if (fileInfo && isImageExtension(fileInfo.fileExtension) && previewUrl) {
        return previewUrl; // New selected image
      }
      if (image_url && image_url !== 'NIL' && !fileInfo) {
        return image_url; // Existing image from network
      }
      return null; // Will show camera icon
    };

    const imageToShow = getImageToShow();
  
    const renderImage = () => {
      if (loading) {
        return (
          <div className="media-preview-loading">
            <div className="spinner"></div>
          </div>
        );
      }  
      return (
        <div className="media-preview">
          { imageToShow && !imageError ? (
            <img
              src={ imageToShow }
              alt="Preview"
              className="preview-image"
              onError={ () => {//If network image fails to load, show broken image icon
                if (!fileInfo) {//Only trigger for existing network images, not local previews
                  setImageError(true);
                }
              } }
            />
          ) : imageError ? (
            <BrokenImageIcon className="camera-icon broken-image" />
          ) : (
            <CameraIcon className="camera-icon" />
          ) }
        </div>
      );
    };
  
    const renderFooter = () => (
      <div className="modal-actions">
        <button type="button" onClick={handleClose} className="cancel-button">
          Cancel
        </button>
        <button type="submit" className="add-button" disabled={loading}>
          Update
        </button>
      </div>
    );

    return (
      <div className="modal-overlay" onClick={handleClose}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          <h2>Update</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                placeholder="Update Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
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
            <button
              type="button"
              onClick={handleMediaButtonClick}
              className="add-media-button"
            >
              Edit Media
            </button>
            {renderImage()}
            {renderFooter()}
          </form>
        </div>
      </div>
    );
  };
  
  export default EditDialog;