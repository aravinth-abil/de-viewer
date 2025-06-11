import * as XLSX from "xlsx";
import DocumentParser from "./documentParser";
import { validateFile } from "../utils/validation";

class FileProcessor {
  constructor() {
    this.supportedTypes = {
      excel: [".xlsx", ".xls", ".csv"],
      document: [".docx", ".doc", ".txt", ".rtf"],
    };
  }

  async processFile(file, options = {}) {
    try {
      // Validate file first
      const validation = validateFile(file);
      if (!validation.isValid) {
        throw new Error(validation.error);
      }

      const fileType = this.getFileType(file.name);
      const processingOptions = {
        maxRows: options.maxRows || 10000,
        includeFormulas: options.includeFormulas || false,
        preserveFormatting: options.preserveFormatting || true,
        ...options,
      };

      let result;

      switch (fileType) {
        case "excel":
          result = await this.processExcelFile(file, processingOptions);
          break;
        case "document":
          result = await this.processDocumentFile(file, processingOptions);
          break;
        default:
          throw new Error(`Unsupported file type: ${fileType}`);
      }

      return {
        success: true,
        fileType,
        originalFile: file,
        processedData: result,
        metadata: this.extractMetadata(file),
        processingTime: Date.now(),
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        fileType: null,
        originalFile: file,
        processingTime: Date.now(),
      };
    }
  }

  async processExcelFile(file, options) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, {
            type: "array",
            cellFormula: options.includeFormulas,
            cellStyles: options.preserveFormatting,
          });

          const result = {
            sheets: {},
            sheetNames: workbook.SheetNames,
            metadata: {
              creator: workbook.Props?.Creator || "Unknown",
              created: workbook.Props?.CreatedDate || null,
              modified: workbook.Props?.ModifiedDate || null,
            },
          };

          // Process each sheet
          workbook.SheetNames.forEach((sheetName) => {
            const worksheet = workbook.Sheets[sheetName];

            // Get sheet range
            const range = XLSX.utils.decode_range(worksheet["!ref"] || "A1");
            const totalRows = range.e.r + 1;

            // Limit rows if specified
            const maxRows = Math.min(totalRows, options.maxRows);
            const limitedRange = {
              s: { c: range.s.c, r: range.s.r },
              e: { c: range.e.c, r: range.s.r + maxRows - 1 },
            };

            // Convert to JSON with proper handling of empty cells
            const jsonData = XLSX.utils.sheet_to_json(worksheet, {
              header: 1,
              range: limitedRange,
              defval: "", // This ensures empty cells are represented as empty strings
              blankrows: true, // Include blank rows
            });

            // Post-process data to ensure consistent row lengths
            const maxCols = Math.max(...jsonData.map((row) => row.length));
            const processedData = jsonData.map((row) => {
              const processedRow = [...row];
              // Pad rows to ensure consistent length
              while (processedRow.length < maxCols) {
                processedRow.push("");
              }
              return processedRow;
            });

            result.sheets[sheetName] = {
              data: processedData,
              metadata: {
                totalRows: totalRows,
                displayedRows: maxRows,
                totalColumns: maxCols,
                range: worksheet["!ref"] || "A1",
                truncated: totalRows > options.maxRows,
              },
            };
          });

          resolve(result);
        } catch (error) {
          reject(new Error(`Excel processing failed: ${error.message}`));
        }
      };

      reader.onerror = () => reject(new Error("Failed to read Excel file"));
      reader.readAsArrayBuffer(file);
    });
  }

  async processDocumentFile(file, options) {
    try {
      const parseResult = await DocumentParser.parseDocument(file);

      if (!parseResult.success) {
        throw new Error(parseResult.messages.join("; "));
      }

      // Generate additional metadata
      const plainText = DocumentParser.extractPlainText(parseResult.html);
      const headings = DocumentParser.generateHeadings(parseResult.html);

      return {
        html: parseResult.html,
        plainText: plainText,
        headings: headings,
        metadata: {
          wordCount: this.countWords(plainText),
          characterCount: plainText.length,
          headingCount: headings.length,
          estimatedReadingTime: this.estimateReadingTime(plainText),
        },
        parsingMessages: parseResult.messages,
      };
    } catch (error) {
      throw new Error(`Document processing failed: ${error.message}`);
    }
  }

  getFileType(fileName) {
    const extension = "." + fileName.toLowerCase().split(".").pop();

    if (this.supportedTypes.excel.includes(extension)) {
      return "excel";
    }

    if (this.supportedTypes.document.includes(extension)) {
      return "document";
    }

    return "unknown";
  }

  extractMetadata(file) {
    return {
      name: file.name,
      size: file.size,
      lastModified: new Date(file.lastModified),
      type: file.type,
      extension: "." + file.name.toLowerCase().split(".").pop(),
    };
  }

  countWords(text) {
    return text
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
  }

  estimateReadingTime(text) {
    const wordsPerMinute = 200; // Average reading speed
    const wordCount = this.countWords(text);
    return Math.ceil(wordCount / wordsPerMinute);
  }

  // Utility methods for file conversion
  async convertToCSV(excelData, sheetName = null) {
    try {
      const sheets = excelData.sheets;
      const targetSheet = sheetName || Object.keys(sheets)[0];

      if (!sheets[targetSheet]) {
        throw new Error(`Sheet "${targetSheet}" not found`);
      }

      const data = sheets[targetSheet].data;
      return data
        .map((row) =>
          row
            .map((cell) => {
              // Escape CSV special characters
              const cellStr = String(cell || "");
              if (
                cellStr.includes(",") ||
                cellStr.includes('"') ||
                cellStr.includes("\n")
              ) {
                return `"${cellStr.replace(/"/g, '""')}"`;
              }
              return cellStr;
            })
            .join(",")
        )
        .join("\n");
    } catch (error) {
      throw new Error(`CSV conversion failed: ${error.message}`);
    }
  }

  async convertToJSON(data, format = "pretty") {
    try {
      const jsonStr =
        format === "pretty"
          ? JSON.stringify(data, null, 2)
          : JSON.stringify(data);

      return jsonStr;
    } catch (error) {
      throw new Error(`JSON conversion failed: ${error.message}`);
    }
  }

  // File validation helpers
  validateFileSize(file, maxSizeBytes) {
    return file.size <= maxSizeBytes;
  }

  validateFileType(file, allowedTypes) {
    const extension = "." + file.name.toLowerCase().split(".").pop();
    return allowedTypes.includes(extension);
  }

  // Batch processing
  async processMultipleFiles(files, options = {}) {
    const results = [];

    for (const file of files) {
      try {
        const result = await this.processFile(file, options);
        results.push(result);
      } catch (error) {
        results.push({
          success: false,
          error: error.message,
          originalFile: file,
        });
      }
    }

    return results;
  }
}

export default new FileProcessor();
