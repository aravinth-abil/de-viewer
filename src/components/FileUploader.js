import React, { useState, useCallback } from "react";
import { validateFile } from "../utils/validation";

const FileUploader = ({ onFileUpload, maxSize = 50 * 1024 * 1024 }) => {
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleFile = useCallback(
    async (file) => {
      setError(null);
      setUploading(true);

      try {
        const validation = validateFile(file, maxSize);
        if (!validation.isValid) {
          throw new Error(validation.error);
        }

        await onFileUpload(file);
      } catch (err) {
        setError(err.message);
      } finally {
        setUploading(false);
      }
    },
    [onFileUpload, maxSize]
  );

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setDragOver(false);
      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        handleFile(files[0]);
      }
    },
    [handleFile]
  );

  const handleFileSelect = useCallback(
    (e) => {
      const files = Array.from(e.target.files);
      if (files.length > 0) {
        handleFile(files[0]);
      }
    },
    [handleFile]
  );

  const uploadAreaStyle = {
    border: "2px dashed",
    borderColor: dragOver ? "#1976d2" : "#ccc",
    borderRadius: "12px",
    padding: "40px",
    textAlign: "center",
    cursor: uploading ? "not-allowed" : "pointer",
    transition: "all 0.3s ease",
    backgroundColor: dragOver ? "#f8f9ff" : "white",
    opacity: uploading ? 0.7 : 1,
  };

  return (
    <div>
      <div
        style={uploadAreaStyle}
        onDragOver={(e) => {
          e.preventDefault();
          if (!uploading) setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() =>
          !uploading && document.getElementById("file-input").click()
        }
      >
        <input
          id="file-input"
          type="file"
          style={{ display: "none" }}
          accept=".xlsx,.xls,.csv,.docx,.doc,.txt,.rtf"
          onChange={handleFileSelect}
          disabled={uploading}
        />

        <div style={{ fontSize: "48px", marginBottom: "16px" }}>
          {uploading ? "⏳" : "☁️"}
        </div>

        <h3 style={{ margin: "0 0 8px 0", color: uploading ? "#666" : "#333" }}>
          {uploading
            ? "Processing file..."
            : "Drop files here or click to upload"}
        </h3>

        <p style={{ color: "#666", margin: "8px 0 0 0", fontSize: "14px" }}>
          Supports Excel (.xlsx, .xls, .csv) and Document files (.docx, .doc,
          .txt, .rtf)
          <br />
          Maximum file size: {Math.round(maxSize / (1024 * 1024))}MB
        </p>
      </div>

      {error && (
        <div
          style={{
            backgroundColor: "#ffebee",
            color: "#c62828",
            padding: "12px",
            borderRadius: "8px",
            marginTop: "16px",
            border: "1px solid #ffcdd2",
          }}
        >
          <strong>Error:</strong> {error}
        </div>
      )}
    </div>
  );
};

export default FileUploader;
