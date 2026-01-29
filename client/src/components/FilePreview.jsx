import { useState, useEffect } from "react";
import {
  FiX,
  FiDownload,
  FiEdit2,
  FiSave,
  FiGlobe,
  FiLock,
  FiChevronLeft,
  FiChevronRight,
  FiFileText,
} from "react-icons/fi";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import * as pdfjsLib from "pdfjs-dist";
import { fileAPI } from "../api/client";
import "../styles/FilePreview.css";

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;

const FilePreview = ({ file, onClose, onFileUpdated }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    description: file?.description || "",
    isPublic: file?.isPublic || false,
  });
  const [saving, setSaving] = useState(false);
  const [textContent, setTextContent] = useState("");
  const [pdfData, setPdfData] = useState(null);
  const [currentPdfPage, setCurrentPdfPage] = useState(1);
  const [loadingPreview, setLoadingPreview] = useState(false);

  useEffect(() => {
    // Prevent body scroll when modal is open
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  if (!file) return null;

  const isImage = file.mimetype.startsWith("image/");
  const isVideo = file.mimetype.startsWith("video/");
  const isAudio = file.mimetype.startsWith("audio/");
  const isPDF = file.mimetype === "application/pdf";

  // All other file types are not supported for preview
  const isSupportedFile = isImage || isVideo || isAudio || isPDF;

  // Load PDF
  useEffect(() => {
    if (isPDF && !pdfData && !loadingPreview) {
      loadPdfContent();
    }
  }, [file._id, isPDF]);

  const loadPdfContent = async () => {
    setLoadingPreview(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${fileAPI.getStreamUrl(file._id)}?token=${token}`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      setPdfData({
        document: pdf,
        numPages: pdf.numPages,
      });
    } catch (error) {
      console.error("Error loading PDF:", error);
      setPdfData({ error: true });
    } finally {
      setLoadingPreview(false);
    }
  };

  const detectLanguage = () => {
    const ext = file.originalName?.split(".").pop()?.toLowerCase();
    const langMap = {
      js: "javascript",
      ts: "typescript",
      jsx: "javascript",
      tsx: "typescript",
      py: "python",
      java: "java",
      c: "c",
      cpp: "cpp",
      cs: "csharp",
      html: "html",
      css: "css",
      php: "php",
      rb: "ruby",
      go: "go",
      rs: "rust",
      sql: "sql",
      sh: "bash",
      xml: "xml",
      json: "json",
    };
    return langMap[ext] || "text";
  };

  const getPreviewUrl = () => {
    const token = localStorage.getItem("token");
    return `${fileAPI.getStreamUrl(file._id)}?token=${token}`;
  };

  const PdfPageRenderer = ({ pdfData, currentPage }) => {
    const [pageCanvas, setPageCanvas] = useState(null);

    useEffect(() => {
      if (!pdfData?.document) return;

      const renderPage = async () => {
        try {
          const page = await pdfData.document.getPage(currentPage);
          const viewport = page.getViewport({ scale: 1.5 });
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          await page.render({
            canvasContext: context,
            viewport: viewport,
          }).promise;

          setPageCanvas(canvas.toDataURL());
        } catch (error) {
          console.error("Error rendering PDF page:", error);
        }
      };

      renderPage();
    }, [pdfData, currentPage]);

    if (!pageCanvas) {
      return (
        <div className="preview-loading">
          <div className="spinner"></div>
        </div>
      );
    }

    return (
      <img
        src={pageCanvas}
        alt={`PDF page ${currentPage}`}
        className="pdf-page"
      />
    );
  };

  const handleEdit = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      setFormData({
        description: file.description || "",
        isPublic: file.isPublic || false,
      });
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fileAPI.update(file._id, formData);
      if (response.data.success) {
        setIsEditing(false);
        if (onFileUpdated) onFileUpdated(response.data.data.file);
      }
    } catch (error) {
      console.error("Error updating file:", error);
      alert(error.response?.data?.message || "Failed to update file");
    } finally {
      setSaving(false);
    }
  };

  const downloadFile = () => {
    const link = document.createElement("a");
    link.href = getPreviewUrl();
    link.download = file.originalName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="preview-modal-overlay" onClick={onClose}>
      <div className="preview-modal" onClick={(e) => e.stopPropagation()}>
        <div className="preview-header">
          <div className="preview-title">
            <FiFileText className="file-icon" />
            <div>
              <h2>{file.originalName}</h2>
              <p className="file-meta">
                {(file.size / 1024 / 1024).toFixed(2)} MB •{" "}
                {new Date(file.uploadedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <button className="preview-close" onClick={onClose}>
            <FiX />
          </button>
        </div>

        <div className="preview-content">
          {isImage && (
            <div className="preview-image-container">
              <img
                src={getPreviewUrl()}
                alt={file.originalName}
                className="preview-image"
              />
            </div>
          )}

          {isVideo && (
            <video controls className="preview-video">
              <source src={getPreviewUrl()} type={file.mimetype} />
              Your browser does not support the video tag.
            </video>
          )}

          {isAudio && (
            <div className="preview-audio-container">
              <audio controls className="preview-audio">
                <source src={getPreviewUrl()} type={file.mimetype} />
                Your browser does not support the audio tag.
              </audio>
            </div>
          )}

          {isPDF && pdfData && !pdfData.error && (
            <div className="preview-pdf-container">
              <PdfPageRenderer pdfData={pdfData} currentPage={currentPdfPage} />
              <div className="pdf-controls">
                <button
                  onClick={() =>
                    setCurrentPdfPage(Math.max(1, currentPdfPage - 1))
                  }
                  disabled={currentPdfPage === 1}
                  className="pdf-nav-btn"
                >
                  <FiChevronLeft /> Previous
                </button>
                <span className="pdf-page-info">
                  Page {currentPdfPage} of {pdfData.numPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPdfPage(
                      Math.min(pdfData.numPages, currentPdfPage + 1),
                    )
                  }
                  disabled={currentPdfPage === pdfData.numPages}
                  className="pdf-nav-btn"
                >
                  Next <FiChevronRight />
                </button>
              </div>
            </div>
          )}

          {isPDF && loadingPreview && (
            <div className="preview-loading">
              <div className="spinner"></div>
              <p>Loading PDF...</p>
            </div>
          )}

          {isPDF && pdfData?.error && (
            <div className="preview-error">
              <p>Error loading PDF file</p>
            </div>
          )}

          {!isSupportedFile && (
            <div className="preview-error">
              <p>Preview not available for this file type</p>
              <p className="error-subtext">
                Supported formats: Images, Videos, Audio, and PDFs
              </p>
              <p className="error-file-type">File type: {file.mimetype}</p>
            </div>
          )}
        </div>

        <div className="preview-footer">
          <div className="footer-actions">
            <button className="btn-download" onClick={downloadFile}>
              <FiDownload /> Download
            </button>
            <button className="btn-edit" onClick={handleEdit}>
              <FiEdit2 /> {isEditing ? "Cancel" : "Edit"}
            </button>
          </div>

          {isEditing && (
            <div className="edit-panel">
              <div className="edit-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Add a description..."
                  className="edit-textarea"
                />
              </div>

              <div className="edit-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="isPublic"
                    checked={formData.isPublic}
                    onChange={handleChange}
                  />
                  <span className="checkbox-text">
                    {formData.isPublic ? <FiGlobe /> : <FiLock />}
                    {formData.isPublic ? " Public" : " Private"}
                  </span>
                </label>
              </div>

              <button
                className="btn-save"
                onClick={handleSave}
                disabled={saving}
              >
                <FiSave /> {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilePreview;
