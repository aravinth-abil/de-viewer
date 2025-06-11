export const formatCellValue = (value) => {
  if (value === null || value === undefined || value === "") {
    return "";
  }

  // Handle numbers
  if (typeof value === "number") {
    // Check if it's a date (Excel stores dates as numbers)
    if (value > 25569 && value < 50000) {
      // Rough date range
      try {
        const date = new Date((value - 25569) * 86400 * 1000);
        if (!isNaN(date.getTime())) {
          return date.toLocaleDateString();
        }
      } catch (e) {
        // If date parsing fails, return as number
      }
    }

    // Format large numbers with commas
    if (Math.abs(value) >= 1000) {
      return value.toLocaleString();
    }

    // Handle decimals
    if (value % 1 !== 0) {
      return value.toFixed(2);
    }

    return value.toString();
  }

  // Handle strings
  if (typeof value === "string") {
    // Trim whitespace
    const trimmed = value.trim();

    // Don't truncate in table view - let CSS handle it
    return trimmed;
  }

  // Handle boolean
  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  // Handle dates
  if (value instanceof Date) {
    return value.toLocaleDateString();
  }

  return String(value);
};

export const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const downloadFile = (content, filename, mimeType = "text/plain") => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const extractTextFromHTML = (html) => {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
};

export const sanitizeHTML = (html) => {
  const div = document.createElement("div");
  div.innerHTML = html;

  // Remove script tags and other potentially dangerous elements
  const scripts = div.querySelectorAll("script, iframe, object, embed");
  scripts.forEach((script) => script.remove());

  return div.innerHTML;
};

export const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    // Fallback for older browsers
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand("copy");
      return true;
    } catch (fallbackErr) {
      return false;
    } finally {
      document.body.removeChild(textArea);
    }
  }
};
