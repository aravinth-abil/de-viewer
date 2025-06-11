export const ALLOWED_FILE_TYPES = {
  excel: [".xlsx", ".xls", ".csv"],
  document: [".docx", ".doc", ".txt", ".rtf"],
};

export const MIME_TYPES = {
  ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ".xls": "application/vnd.ms-excel",
  ".csv": "text/csv",
  ".docx":
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".doc": "application/msword",
  ".txt": "text/plain",
  ".rtf": "application/rtf",
};

export const validateFile = (file, maxSize = 50 * 1024 * 1024) => {
  if (!file) {
    return { isValid: false, error: "No file provided" };
  }

  // Check file size
  if (file.size > maxSize) {
    const maxSizeMB = Math.round(maxSize / (1024 * 1024));
    return {
      isValid: false,
      error: `File size exceeds ${maxSizeMB}MB limit`,
    };
  }

  // Check file extension
  const fileName = file.name.toLowerCase();
  const fileExtension = "." + fileName.split(".").pop();

  const allAllowedTypes = [
    ...ALLOWED_FILE_TYPES.excel,
    ...ALLOWED_FILE_TYPES.document,
  ];

  if (!allAllowedTypes.includes(fileExtension)) {
    return {
      isValid: false,
      error: "Unsupported file type. Please use Excel or Document files.",
    };
  }

  // Check MIME type if available
  if (file.type && MIME_TYPES[fileExtension]) {
    const expectedMimeType = MIME_TYPES[fileExtension];
    if (!file.type.includes(expectedMimeType.split("/")[1])) {
      console.warn(
        "MIME type mismatch:",
        file.type,
        "expected:",
        expectedMimeType
      );
    }
  }

  return { isValid: true, error: null };
};

export const getFileType = (fileName) => {
  const extension = "." + fileName.toLowerCase().split(".").pop();

  if (ALLOWED_FILE_TYPES.excel.includes(extension)) {
    return "excel";
  }

  if (ALLOWED_FILE_TYPES.document.includes(extension)) {
    return "document";
  }

  return "unknown";
};

export const validateTextSelection = (text) => {
  if (!text || typeof text !== "string") {
    return { isValid: false, error: "No text selected" };
  }

  if (text.trim().length === 0) {
    return { isValid: false, error: "Selected text is empty" };
  }

  if (text.length > 5000) {
    return {
      isValid: false,
      error: "Selected text is too long (max 5000 characters)",
    };
  }

  return { isValid: true, error: null };
};
