import { useState } from "react";
import {
  FiFile,
  FiImage,
  FiVideo,
  FiMusic,
  FiFileText,
  FiDownload,
  FiTrash2,
  FiEdit,
  FiEye,
  FiLock,
  FiGlobe,
} from "react-icons/fi";
import { fileAPI } from "../api/client";
import "../styles/FileGrid.css";

const FileGrid = ({ files, onFileDeleted, onFileUpdated, onFileClick }) => {
  const [deletingId, setDeletingId] = useState(null);

  const getFileIcon = (mimetype) => {
    if (mimetype.startsWith("image/")) return <FiImage />;
    if (mimetype.startsWith("video/")) return <FiVideo />;
    if (mimetype.startsWith("audio/")) return <FiMusic />;
    if (mimetype.startsWith("text/") || mimetype.includes("document"))
      return <FiFileText />;
    return <FiFile />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleDelete = async (file, e) => {
    e.stopPropagation();

    if (!confirm(`Are you sure you want to delete "${file.originalName}"?`)) {
      return;
    }

    setDeletingId(file._id);

    try {
      const response = await fileAPI.delete(file._id);
      if (response?.data?.success) {
        if (onFileDeleted) {
          onFileDeleted(file._id);
        }
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert(error.response?.data?.message || "Failed to delete file");
      setDeletingId(null);
    }
  };

  const handleDownload = (file, e) => {
    e.stopPropagation();
    const token = localStorage.getItem("token");
    const url = `${fileAPI.getDownloadUrl(file._id)}`;

    // Create a temporary link with authorization
    const link = document.createElement("a");
    link.href = url;
    link.download = file.originalName;

    // For proper authorization, we need to use fetch
    fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = file.originalName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      })
      .catch((error) => {
        console.error("Download error:", error);
        alert("Failed to download file");
      });
  };

  const isPreviewable = (mimetype, filename) => {
    // Media types
    if (
      mimetype.startsWith("image/") ||
      mimetype.startsWith("video/") ||
      mimetype.startsWith("audio/")
    ) {
      return true;
    }

    // PDF
    if (mimetype === "application/pdf") {
      return true;
    }

    // Text files
    if (mimetype === "text/plain" || filename?.endsWith(".txt")) {
      return true;
    }

    // CSV files
    if (mimetype === "text/csv" || filename?.endsWith(".csv")) {
      return true;
    }

    // JSON files
    if (mimetype === "application/json" || filename?.endsWith(".json")) {
      return true;
    }

    // Code files
    if (
      /\.(js|ts|jsx|tsx|py|java|c|cpp|html|css|php|xml|sql|sh|rb|go)$/.test(
        filename?.toLowerCase() || "",
      )
    ) {
      return true;
    }

    return false;
  };

  if (!files || files.length === 0) {
    return (
      <div className="empty-state glass-card">
        <FiFile className="empty-icon" />
        <h3>No files yet</h3>
        <p className="text-muted">Upload your first file to get started</p>
      </div>
    );
  }

  return (
    <div className="file-grid">
      {files.map((file) => (
        <div
          key={file._id}
          className="file-card glass-card"
          onClick={() => onFileClick && onFileClick(file)}
        >
          <div className="file-card-header">
            <div className="file-card-icon">{getFileIcon(file.mimetype)}</div>
            <div className="file-card-badge">
              {file.isPublic ? (
                <span className="badge badge-success" title="Public">
                  <FiGlobe /> Public
                </span>
              ) : (
                <span className="badge badge-primary" title="Private">
                  <FiLock /> Private
                </span>
              )}
            </div>
          </div>

          <div className="file-card-body">
            <h4 className="file-card-title" title={file.originalName}>
              {file.originalName}
            </h4>

            {file.description && (
              <p className="file-card-description text-muted text-sm">
                {file.description}
              </p>
            )}

            <div className="file-card-meta">
              <span className="text-muted text-xs">
                {formatFileSize(file.size)}
              </span>
              <span className="text-muted text-xs">
                {formatDate(file.createdAt)}
              </span>
            </div>

            <div className="file-card-owner text-muted text-xs">
              By {file.owner?.username || "Unknown"}
            </div>
          </div>

          <div className="file-card-actions">
            {isPreviewable(file.mimetype, file.originalName) && (
              <button
                className="btn btn-secondary btn-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onFileClick && onFileClick(file);
                }}
                title="Preview"
              >
                <FiEye />
              </button>
            )}

            <button
              className="btn btn-secondary btn-sm"
              onClick={(e) => handleDownload(file, e)}
              title="Download"
            >
              <FiDownload />
            </button>

            <button
              className="btn btn-danger btn-sm"
              onClick={(e) => handleDelete(file, e)}
              disabled={deletingId === file._id}
              title="Delete"
            >
              {deletingId === file._id ? (
                <span
                  className="spinner"
                  style={{ width: "14px", height: "14px" }}
                ></span>
              ) : (
                <FiTrash2 />
              )}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FileGrid;
