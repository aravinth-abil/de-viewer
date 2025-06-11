export const APP_CONFIG = {
  name: "Document & Excel Viewer",
  version: "1.0.0",
  maxFileSize: 50 * 1024 * 1024, // 50MB
  maxTableRows: 1000,
  maxDocumentLength: 100000, // characters
  autoSaveInterval: 30000, // 30 seconds
};

export const AI_CONFIG = {
  maxTextLength: 5000,
  defaultModel: "mistral-small",
  timeout: 30000, // 30 seconds
  retryAttempts: 3,
};

export const THEMES = {
  light: {
    primary: "#1976d2",
    secondary: "#dc004e",
    background: "#f5f5f5",
    paper: "#ffffff",
    text: "#333333",
    textSecondary: "#666666",
  },
  dark: {
    primary: "#2196f3",
    secondary: "#f50057",
    background: "#121212",
    paper: "#1e1e1e",
    text: "#ffffff",
    textSecondary: "#aaaaaa",
  },
};

export const EDITOR_TOOLS = [
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "code-block",
  "header",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
  "clean",
];

export const ERROR_MESSAGES = {
  fileUpload: {
    invalidType: "Please select a valid Excel or Document file",
    tooLarge: "File size exceeds the maximum limit",
    corrupted: "The file appears to be corrupted or unreadable",
    network: "Network error occurred during upload",
  },
  ai: {
    noApiKey: "AI features require an API key to be configured",
    timeout: "AI request timed out. Please try again",
    quota: "API quota exceeded. Please try again later",
    invalid: "Invalid request to AI service",
  },
  general: {
    unknown: "An unexpected error occurred",
    browser: "Your browser does not support this feature",
  },
};

export const SUCCESS_MESSAGES = {
  fileUpload: "File uploaded successfully",
  aiProcess: "AI processing completed",
  save: "Document saved successfully",
  copy: "Copied to clipboard",
};
