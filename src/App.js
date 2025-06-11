import React, { useState, useCallback, useMemo } from "react";
import "./App.css";
import FileUploader from "./components/FileUploader";
import ExcelViewer from "./components/ExcelViewer";
import DocumentEditor from "./components/DocumentEditor";
import TableOfContents from "./components/TableOfContents";
import AIAssistant from "./components/AIAssistant";
import ShimmerLoader from "./components/ShimmerLoader";
import { useFileUpload } from "./hooks/useFileUpload";
import { useTableOfContents } from "./hooks/useTableOfContents";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { APP_CONFIG } from "./utils/constants";
import { createTheme } from "./styles/themes";

function App() {
  const [darkMode, setDarkMode] = useLocalStorage("darkMode", false);
  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [fileContent, setFileContent] = useState(null);
  const [documentContent, setDocumentContent] = useState("");
  const [selectedText, setSelectedText] = useState("");

  const { uploadFile, isLoading, error, progress, clearError } =
    useFileUpload();
  const { tocItems, activeHeading, scrollToHeading } =
    useTableOfContents(documentContent);

  const currentTheme = useMemo(
    () => createTheme(darkMode ? "dark" : "light"),
    [darkMode]
  );

  const handleFileUpload = useCallback(
    async (uploadedFile) => {
      clearError();

      try {
        const result = await uploadFile(uploadedFile);
        setFile(result.file);
        setFileType(result.fileType);
        setFileContent(result.content);

        if (result.fileType === "document") {
          setDocumentContent(result.content);
        }
      } catch (err) {
        console.error("File upload error:", err);
      }
    },
    [uploadFile, clearError]
  );

  const handleDocumentChange = useCallback((content) => {
    setDocumentContent(content);
    setFileContent(content);
  }, []);

  const handleTextSelection = useCallback((text) => {
    setSelectedText(text);
  }, []);

  const handleAIModification = useCallback((modifiedContent) => {
    setDocumentContent(modifiedContent);
    setFileContent(modifiedContent);
  }, []);

  const toggleDarkMode = useCallback(() => {
    setDarkMode(!darkMode);
  }, [darkMode, setDarkMode]);

  const resetApp = useCallback(() => {
    setFile(null);
    setFileType(null);
    setFileContent(null);
    setDocumentContent("");
    setSelectedText("");
    clearError();
  }, [clearError]);

  const renderContent = () => {
    if (isLoading) {
      return <ShimmerLoader type={fileType} />;
    }

    if (error) {
      return (
        <div className="error-container">
          <div className="error-message">
            <h3>Error</h3>
            <p>{error}</p>
            <button onClick={clearError} className="btn btn-secondary">
              Try Again
            </button>
          </div>
        </div>
      );
    }

    if (!file) {
      return (
        <div className="upload-container">
          <FileUploader onFileUpload={handleFileUpload} />
          <div className="app-info">
            <h2>Welcome to Document & Excel Viewer</h2>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">📊</div>
                <h3>Excel Viewer</h3>
                <p>
                  View multi-sheet Excel files with advanced filtering and
                  sorting
                </p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">📝</div>
                <h3>Document Editor</h3>
                <p>Rich text editing with Google Docs-like features</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🤖</div>
                <h3>AI Integration</h3>
                <p>Enhance your content with Mistral AI-powered suggestions</p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="content-layout">
        {fileType === "document" && tocItems.length > 0 && (
          <div className="sidebar">
            <TableOfContents
              items={tocItems}
              activeHeading={activeHeading}
              onHeadingClick={scrollToHeading}
            />
          </div>
        )}

        <div className="main-content">
          {fileType === "excel" ? (
            <ExcelViewer data={fileContent} />
          ) : (
            <div className="document-layout">
              <div className="editor-container">
                <DocumentEditor
                  content={documentContent}
                  onChange={handleDocumentChange}
                  onTextSelection={handleTextSelection}
                  theme={currentTheme}
                />
              </div>
              {selectedText && (
                <div className="ai-sidebar">
                  <AIAssistant
                    selectedText={selectedText}
                    onModification={handleAIModification}
                    fullContent={documentContent}
                    theme={currentTheme}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div
      className={`app ${darkMode ? "dark-theme" : "light-theme"}`}
      style={{
        "--primary-color": currentTheme.primary,
        "--bg-primary": currentTheme.background.default,
        "--bg-secondary": currentTheme.background.paper,
        "--text-primary": currentTheme.text.primary,
        "--text-secondary": currentTheme.text.secondary,
        "--border-color": currentTheme.border,
        "--shadow": currentTheme.shadow,
      }}
    >
      <header className="app-header">
        <div className="header-content">
          <div className="header-left">
            <div className="app-logo">{fileType === "excel" ? "📊" : "📄"}</div>
            <div className="app-title">
              <h1>{APP_CONFIG.name}</h1>
              {file && <span className="file-name">{file.name}</span>}
            </div>
          </div>

          <div className="header-controls">
            {file && (
              <button onClick={resetApp} className="btn btn-secondary">
                New File
              </button>
            )}

            {fileType === "document" && selectedText && (
              <div className="ai-indicator">
                <span className="ai-icon">✨</span>
                AI Active
              </div>
            )}

            <button
              onClick={toggleDarkMode}
              className="theme-toggle"
              aria-label={`Switch to ${darkMode ? "light" : "dark"} mode`}
            >
              {darkMode ? "☀️" : "🌙"}
            </button>
          </div>
        </div>

        {isLoading && progress > 0 && (
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}
      </header>

      <main className="app-main">{renderContent()}</main>

      <footer className="app-footer">
        <p>&copy; 2025 Document & Excel Viewer - Powered by Mistral AI</p>
      </footer>
    </div>
  );
}

export default App;
