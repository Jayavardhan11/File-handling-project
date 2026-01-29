import { useState, useRef } from "react";
import { fileAPI } from "../api/client";
import { FiUploadCloud, FiX, FiFile, FiCheck } from "react-icons/fi";
import "../styles/FileUpload.css";

const FileUpload = ({ onUploadSuccess }) => {
  const [dragging, setDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isPublic, setIsPublic] = useState(false);
  const [description, setDescription] = useState("");
  const fileInputRef = useRef(null);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file");
      return;
    }

    setUploading(true);
    setProgress(0);

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("isPublic", isPublic);
    formData.append("description", description);

    try {
      const response = await fileAPI.upload(formData, (percent) => {
        setProgress(percent);
      });

      if (response?.data?.success) {
        // Reset form
        setSelectedFile(null);
        setDescription("");
        setIsPublic(false);
        setProgress(0);

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }

        // Notify parent
        if (onUploadSuccess) {
          onUploadSuccess(response.data.data.file);
        }
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert(error.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setDescription("");
    setIsPublic(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div className="file-upload-container">
      {!selectedFile ? (
        <div
          className={`upload-dropzone ${dragging ? "dragging" : ""}`}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <FiUploadCloud className="upload-icon" />
          <h3>Drag & Drop your file here</h3>
          <p className="text-muted">or click to browse</p>
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            style={{ display: "none" }}
          />
        </div>
      ) : (
        <div className="upload-preview glass-card">
          <div className="upload-file-info">
            <FiFile className="file-icon" />
            <div className="file-details">
              <h4>{selectedFile.name}</h4>
              <p className="text-muted text-sm">
                {formatFileSize(selectedFile.size)}
              </p>
            </div>
            {!uploading && (
              <button
                className="btn-icon"
                onClick={handleCancel}
                title="Remove file"
              >
                <FiX />
              </button>
            )}
          </div>

          {uploading && (
            <div className="upload-progress">
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="progress-text">{progress}%</span>
            </div>
          )}

          {!uploading && (
            <>
              <div className="form-group">
                <label htmlFor="description" className="form-label">
                  Description (optional)
                </label>
                <input
                  type="text"
                  id="description"
                  className="input"
                  placeholder="Add a description..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="upload-options">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={isPublic}
                    onChange={(e) => setIsPublic(e.target.checked)}
                  />
                  <span>Make this file public</span>
                </label>
              </div>

              <div className="upload-actions">
                <button className="btn btn-secondary" onClick={handleCancel}>
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={handleUpload}>
                  <FiCheck /> Upload File
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
