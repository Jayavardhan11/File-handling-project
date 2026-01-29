import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { fileAPI } from "../api/client";
import { io } from "socket.io-client";
import Navbar from "../components/Navbar";
import FileUpload from "../components/FileUpload";
import FileGrid from "../components/FileGrid";
import FilePreview from "../components/FilePreview";
import { FiFilter, FiHardDrive } from "react-icons/fi";
import "../styles/Dashboard.css";

const StorageUsageIcon = ({ files }) => {
  const [storageData, setStorageData] = useState({ used: 0, total: 5000 });
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Calculate total storage used from files
    const totalSize = files.reduce((acc, file) => acc + (file.size || 0), 0);
    const usedMB = (totalSize / (1024 * 1024)).toFixed(2);
    setStorageData({ used: parseFloat(usedMB), total: 5000 });

    // Trigger animation
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 1000);
    return () => clearTimeout(timer);
  }, [files]);

  const percentage = Math.min(
    (storageData.used / storageData.total) * 100,
    100,
  );
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className={`storage-usage-widget ${isAnimating ? "animating" : ""}`}>
      <div className="storage-icon-container">
        <svg className="storage-circle" width="120" height="120">
          <circle
            className="storage-circle-bg"
            cx="60"
            cy="60"
            r="45"
            fill="none"
            stroke="rgba(139, 92, 246, 0.1)"
            strokeWidth="10"
          />
          <circle
            className="storage-circle-progress"
            cx="60"
            cy="60"
            r="45"
            fill="none"
            stroke="url(#storageGradient)"
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform="rotate(-90 60 60)"
          />
          <defs>
            <linearGradient
              id="storageGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>
        </svg>
        <div className="storage-icon-center">
          <FiHardDrive className="storage-icon" />
        </div>
      </div>
      <div className="storage-info">
        <div className="storage-label">Storage Used</div>
        <div className="storage-value">{storageData.used} MB</div>
        <div className="storage-total">of {storageData.total} MB</div>
        <div className="storage-percentage">{percentage.toFixed(1)}%</div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { user } = useAuth();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selectedFile, setSelectedFile] = useState(null);
  const [socket, setSocket] = useState(null);

  // Initialize Socket.io
  useEffect(() => {
    const socketUrl =
      import.meta.env.VITE_SOCKET_URL ||
      "https://file-handling-project-backend.onrender.com";
    const socketInstance = io(socketUrl, {
      auth: {
        token: localStorage.getItem("token"),
      },
    });

    socketInstance.on("connect", () => {
      console.log("Connected to Socket.io");
    });

    socketInstance.on("file:uploaded", (newFile) => {
      console.log("New file uploaded:", newFile);
      setFiles((prev) => [newFile, ...prev]);
    });

    socketInstance.on("file:updated", (updatedFile) => {
      console.log("File updated:", updatedFile);
      setFiles((prev) =>
        prev.map((f) => (f._id === updatedFile._id ? updatedFile : f)),
      );
    });

    socketInstance.on("file:deleted", ({ fileId }) => {
      console.log("File deleted:", fileId);
      setFiles((prev) => prev.filter((f) => f._id !== fileId));
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  // Fetch files
  useEffect(() => {
    fetchFiles();
  }, [filter]);

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const response = await fileAPI.getAll(
        filter === "all" ? undefined : filter,
      );
      if (response.data.success) {
        setFiles(response.data.data.files);
      }
    } catch (error) {
      console.error("Fetch files error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSuccess = (newFile) => {
    setFiles((prev) => [newFile, ...prev]);
  };

  const handleFileDeleted = (fileId) => {
    setFiles((prev) => prev.filter((f) => f._id !== fileId));
    if (selectedFile?._id === fileId) {
      setSelectedFile(null);
    }
  };

  const handleFileUpdated = (updatedFile) => {
    setFiles((prev) =>
      prev.map((f) => (f._id === updatedFile._id ? updatedFile : f)),
    );
    setSelectedFile(updatedFile);
  };

  const handleFileClick = (file) => {
    setSelectedFile(file);
  };

  return (
    <div className="dashboard">
      <Navbar />

      <div className="container">
        <div className="dashboard-header">
          <div>
            <h1>My Files</h1>
            <p className="text-muted">Manage and organize your files</p>
          </div>
          <StorageUsageIcon files={files} />
        </div>

        <FileUpload onUploadSuccess={handleUploadSuccess} />

        <div className="dashboard-controls">
          <div className="filter-group">
            <FiFilter />
            <span>Filter:</span>
            <button
              className={`filter-btn ${filter === "all" ? "active" : ""}`}
              onClick={() => setFilter("all")}
            >
              All Files
            </button>
            <button
              className={`filter-btn ${filter === "my-files" ? "active" : ""}`}
              onClick={() => setFilter("my-files")}
            >
              My Files
            </button>
            <button
              className={`filter-btn ${filter === "public" ? "active" : ""}`}
              onClick={() => setFilter("public")}
            >
              Public Files
            </button>
          </div>
        </div>

        {loading ? (
          <div className="loading-container">
            <div
              className="spinner"
              style={{ width: "40px", height: "40px", borderWidth: "4px" }}
            ></div>
            <p className="text-muted">Loading files...</p>
          </div>
        ) : (
          <FileGrid
            files={files}
            onFileDeleted={handleFileDeleted}
            onFileUpdated={handleFileUpdated}
            onFileClick={handleFileClick}
          />
        )}
      </div>

      {selectedFile && (
        <FilePreview
          file={selectedFile}
          onClose={() => setSelectedFile(null)}
          onFileUpdated={handleFileUpdated}
        />
      )}
    </div>
  );
};

export default Dashboard;
