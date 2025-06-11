import { useState, useCallback } from "react";
import { validateFile, getFileType } from "../utils/validation";
import DocumentParser from "../services/documentParser";

export const useFileUpload = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);

  const processExcelFile = useCallback(async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onprogress = (e) => {
        if (e.lengthComputable) {
          setProgress(Math.round((e.loaded / e.total) * 50));
        }
      };

      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          setProgress(75);

          // Wait for XLSX library to load
          const loadXLSX = () => {
            if (window.XLSX) {
              try {
                const workbook = window.XLSX.read(data, {
                  type: "array",
                  cellDates: true,
                  cellNF: false,
                  cellStyles: false,
                });

                const sheetsData = {};

                workbook.SheetNames.forEach((sheetName) => {
                  const worksheet = workbook.Sheets[sheetName];

                  // Convert to JSON with proper handling
                  const jsonData = window.XLSX.utils.sheet_to_json(worksheet, {
                    header: 1,
                    defval: null,
                    blankrows: true,
                    raw: false, // This ensures proper formatting
                  });

                  // Ensure consistent row length
                  if (jsonData.length > 0) {
                    const maxCols = Math.max(
                      ...jsonData.map((row) => (row ? row.length : 0))
                    );
                    const processedData = jsonData.map((row) => {
                      const processedRow = [];
                      for (let i = 0; i < maxCols; i++) {
                        const cellValue =
                          row && row[i] !== undefined ? row[i] : null;
                        processedRow[i] = cellValue;
                      }
                      return processedRow;
                    });
                    sheetsData[sheetName] = processedData;
                  } else {
                    sheetsData[sheetName] = [[]];
                  }
                });

                setProgress(100);
                resolve(sheetsData);
              } catch (xlsxError) {
                console.error("XLSX processing error:", xlsxError);
                reject(
                  new Error("Failed to parse Excel file: " + xlsxError.message)
                );
              }
            } else {
              // Fallback for CSV or when XLSX is not loaded
              try {
                const text = new TextDecoder().decode(data);
                const rows = text.split("\n").map((row) => {
                  // Simple CSV parsing
                  return row.split(",").map((cell) => {
                    const trimmed = cell.trim();
                    // Remove quotes if present
                    if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
                      return trimmed.slice(1, -1);
                    }
                    return trimmed || null;
                  });
                });
                const sheetsData = { Sheet1: rows };
                setProgress(100);
                resolve(sheetsData);
              } catch (csvError) {
                reject(
                  new Error("Failed to parse file as CSV: " + csvError.message)
                );
              }
            }
          };

          // Try to load XLSX if not available
          if (!window.XLSX) {
            const script = document.createElement("script");
            script.src =
              "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js";
            script.onload = loadXLSX;
            script.onerror = loadXLSX; // Fallback to CSV
            document.head.appendChild(script);
          } else {
            loadXLSX();
          }
        } catch (error) {
          reject(new Error("Failed to process Excel file: " + error.message));
        }
      };

      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsArrayBuffer(file);
    });
  }, []);

  const processDocumentFile = useCallback(async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onprogress = (e) => {
        if (e.lengthComputable) {
          setProgress(Math.round((e.loaded / e.total) * 100));
        }
      };

      reader.onload = async (e) => {
        try {
          const fileExtension = file.name.split(".").pop().toLowerCase();
          let content = "";

          if (fileExtension === "txt") {
            content = e.target.result;
            // Convert plain text to HTML with proper formatting
            if (content.trim()) {
              content = content
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .split("\n\n")
                .map((paragraph) => paragraph.trim())
                .filter((paragraph) => paragraph.length > 0)
                .map(
                  (paragraph) => `<p>${paragraph.replace(/\n/g, "<br>")}</p>`
                )
                .join("\n");
            } else {
              content = "<p>Empty document</p>";
            }
          } else if (fileExtension === "docx") {
            try {
              // Try to use mammoth if available
              if (window.mammoth) {
                const arrayBuffer = e.target.result;
                const result = await window.mammoth.convertToHtml({
                  arrayBuffer,
                });
                content =
                  result.value ||
                  "<p>Unable to extract content from DOCX file</p>";
              } else {
                // Load mammoth dynamically
                try {
                  const mammothScript = document.createElement("script");
                  mammothScript.src =
                    "https://cdn.jsdelivr.net/npm/mammoth@1.6.0/mammoth.browser.min.js";

                  await new Promise((resolve, reject) => {
                    mammothScript.onload = resolve;
                    mammothScript.onerror = reject;
                    document.head.appendChild(mammothScript);
                  });

                  if (window.mammoth) {
                    const arrayBuffer = e.target.result;
                    const result = await window.mammoth.convertToHtml({
                      arrayBuffer,
                    });
                    content =
                      result.value ||
                      "<p>Unable to extract content from DOCX file</p>";
                  } else {
                    throw new Error("Mammoth library failed to load");
                  }
                } catch (mammothError) {
                  console.warn("Mammoth loading failed:", mammothError);
                  content = `<h1>Document: ${
                    file.name
                  }</h1><p>DOCX file detected but unable to parse content. Please convert to TXT format for better compatibility.</p><p>File size: ${(
                    file.size / 1024
                  ).toFixed(1)} KB</p>`;
                }
              }
            } catch (docxError) {
              console.warn("DOCX parsing failed:", docxError);
              content = `<h1>Document: ${file.name}</h1><p>Error parsing DOCX file. Please try converting to TXT format.</p>`;
            }
          } else if (fileExtension === "doc") {
            content = `<h1>Document: ${file.name}</h1><p>DOC files are not supported in the browser. Please convert to DOCX or TXT format.</p><p>Supported formats: DOCX, TXT, RTF</p>`;
          } else if (fileExtension === "rtf") {
            try {
              const rtfText = e.target.result;
              const result = DocumentParser.parseRtf(rtfText);
              content = result.html;
            } catch (rtfError) {
              console.warn("RTF parsing failed:", rtfError);
              content = `<h1>Document: ${file.name}</h1><p>Error parsing RTF file. Please try converting to TXT format.</p>`;
            }
          } else {
            // Treat as plain text
            const text =
              typeof e.target.result === "string"
                ? e.target.result
                : new TextDecoder().decode(e.target.result);

            if (text && text.trim()) {
              content = text
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .split("\n\n")
                .map((paragraph) => paragraph.trim())
                .filter((paragraph) => paragraph.length > 0)
                .map(
                  (paragraph) => `<p>${paragraph.replace(/\n/g, "<br>")}</p>`
                )
                .join("\n");
            } else {
              content = "<p>Empty or unreadable document</p>";
            }
          }

          resolve(content);
        } catch (error) {
          reject(new Error("Failed to process document: " + error.message));
        }
      };

      reader.onerror = () => reject(new Error("Failed to read document file"));

      const fileExtension = file.name.split(".").pop().toLowerCase();

      if (fileExtension === "txt" || fileExtension === "rtf") {
        reader.readAsText(file);
      } else {
        reader.readAsArrayBuffer(file);
      }
    });
  }, []);

  const uploadFile = useCallback(
    async (file) => {
      setIsLoading(true);
      setError(null);
      setProgress(0);

      try {
        const validation = validateFile(file);
        if (!validation.isValid) {
          throw new Error(validation.error);
        }

        const fileType = getFileType(file.name);
        let content;

        if (fileType === "excel") {
          content = await processExcelFile(file);
        } else if (fileType === "document") {
          content = await processDocumentFile(file);
        } else {
          throw new Error("Unsupported file type");
        }

        return {
          file,
          fileType,
          content,
          name: file.name,
          size: file.size,
          lastModified: file.lastModified,
        };
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setIsLoading(false);
        setProgress(0);
      }
    },
    [processExcelFile, processDocumentFile]
  );

  return {
    uploadFile,
    isLoading,
    error,
    progress,
    clearError: () => setError(null),
  };
};
