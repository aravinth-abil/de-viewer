import React, { useState, useMemo, useCallback } from "react";
import { formatCellValue } from "../utils/helpers";

const ExcelViewer = ({ data, maxRows = 1000 }) => {
  const [activeSheet, setActiveSheet] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  // Get all sheet names from data
  const sheets = useMemo(() => {
    if (!data || typeof data !== "object") return [];
    return Object.keys(data);
  }, [data]);

  // Debug log to check sheets
  React.useEffect(() => {
    console.log("Excel data structure:", data);
    console.log("Available sheets:", sheets);
  }, [data, sheets]);

  React.useEffect(() => {
    if (sheets.length > 0 && !activeSheet) {
      setActiveSheet(sheets[0]);
      console.log("Setting active sheet to:", sheets[0]);
    }
  }, [sheets, activeSheet]);

  const processedData = useMemo(() => {
    if (!data || !activeSheet || sheets.length === 0) {
      console.log("No data or active sheet:", {
        data: !!data,
        activeSheet,
        sheetsLength: sheets.length,
      });
      return { headers: [], rows: [] };
    }

    const sheetData = data[activeSheet];
    console.log("Processing sheet data for:", activeSheet, sheetData);

    if (!sheetData || !Array.isArray(sheetData) || sheetData.length === 0) {
      console.log("Invalid sheet data:", sheetData);
      return { headers: [], rows: [] };
    }

    const headers = sheetData[0] || [];
    let rows = sheetData.slice(1, maxRows + 1);

    // Apply search filter
    if (searchTerm) {
      rows = rows.filter(
        (row) =>
          row &&
          row.some((cell) => {
            if (cell === null || cell === undefined) return false;
            return String(cell)
              .toLowerCase()
              .includes(searchTerm.toLowerCase());
          })
      );
    }

    // Apply sorting
    if (sortConfig.key !== null) {
      rows.sort((a, b) => {
        const aVal = (a && a[sortConfig.key]) || "";
        const bVal = (b && b[sortConfig.key]) || "";

        if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return { headers, rows };
  }, [data, activeSheet, searchTerm, sortConfig, maxRows, sheets]);

  const handleSort = useCallback((columnIndex) => {
    setSortConfig((prev) => ({
      key: columnIndex,
      direction:
        prev.key === columnIndex && prev.direction === "asc" ? "desc" : "asc",
    }));
  }, []);

  const handleSheetChange = useCallback((sheetName) => {
    console.log("Changing to sheet:", sheetName);
    setActiveSheet(sheetName);
    setSearchTerm(""); // Clear search when switching sheets
    setSortConfig({ key: null, direction: "asc" }); // Reset sorting
  }, []);

  if (!data || sheets.length === 0) {
    return (
      <div
        className="excel-viewer"
        style={{
          backgroundColor: "var(--bg-secondary)",
          borderRadius: "12px",
          padding: "24px",
          boxShadow: "var(--shadow)",
          height: "calc(100vh - 200px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          width: "100%",
        }}
      >
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>📊</div>
        <h3 style={{ color: "var(--text-primary)", marginBottom: "8px" }}>
          No Excel data available
        </h3>
        <p style={{ color: "var(--text-secondary)" }}>
          Please upload a valid Excel file (.xlsx, .xls, .csv)
        </p>
      </div>
    );
  }

  return (
    <div
      className="excel-viewer"
      style={{
        backgroundColor: "var(--bg-secondary)",
        borderRadius: "12px",
        padding: "24px",
        boxShadow: "var(--shadow)",
        height: "calc(100vh - 200px)",
        display: "flex",
        flexDirection: "column",
        width: "100%",
      }}
    >
      {/* Toolbar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
          flexWrap: "wrap",
          gap: "16px",
          flexShrink: 0,
        }}
      >
        {/* Sheet Tabs - Show all sheets */}
        <div
          style={{
            display: "flex",
            gap: "8px",
            flexWrap: "wrap",
            overflowX: "auto",
            maxWidth: "60%",
          }}
        >
          {sheets.map((sheetName) => (
            <button
              key={sheetName}
              onClick={() => handleSheetChange(sheetName)}
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                border:
                  activeSheet === sheetName
                    ? "2px solid var(--primary-color)"
                    : "1px solid var(--border-color)",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: activeSheet === sheetName ? 600 : 500,
                transition: "all 0.2s ease",
                backgroundColor:
                  activeSheet === sheetName
                    ? "var(--primary-color)"
                    : "var(--bg-secondary)",
                color:
                  activeSheet === sheetName ? "white" : "var(--text-primary)",
                whiteSpace: "nowrap",
                minWidth: "fit-content",
              }}
              onMouseEnter={(e) => {
                if (activeSheet !== sheetName) {
                  e.target.style.backgroundColor = "rgba(25, 118, 210, 0.1)";
                  e.target.style.borderColor = "var(--primary-color)";
                }
              }}
              onMouseLeave={(e) => {
                if (activeSheet !== sheetName) {
                  e.target.style.backgroundColor = "var(--bg-secondary)";
                  e.target.style.borderColor = "var(--border-color)";
                }
              }}
            >
              {sheetName} {activeSheet === sheetName && "●"}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <input
          type="text"
          placeholder="Search in sheet..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: "8px 12px",
            border: "1px solid var(--border-color)",
            borderRadius: "6px",
            fontSize: "14px",
            minWidth: "200px",
            backgroundColor: "var(--bg-secondary)",
            color: "var(--text-primary)",
          }}
        />
      </div>

      {/* Sheet Info */}
      <div
        style={{
          marginBottom: "16px",
          fontSize: "14px",
          color: "var(--text-secondary)",
          flexShrink: 0,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span>
          Sheet: <strong>{activeSheet}</strong> | Showing{" "}
          {processedData.rows.length} rows
          {searchTerm &&
            ` (filtered from ${data[activeSheet]?.length - 1 || 0} total)`}
        </span>
        <span>
          {sheets.length} sheet{sheets.length !== 1 ? "s" : ""} available
        </span>
      </div>

      {/* Table Container */}
      <div
        style={{
          flex: 1,
          overflowX: "auto",
          overflowY: "auto",
          border: "1px solid var(--border-color)",
          borderRadius: "8px",
          backgroundColor: "var(--bg-secondary)",
        }}
      >
        {processedData.headers.length > 0 ? (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "14px",
            }}
          >
            <thead
              style={{
                position: "sticky",
                top: 0,
                zIndex: 1,
              }}
            >
              <tr>
                {processedData.headers.map((header, index) => (
                  <th
                    key={index}
                    onClick={() => handleSort(index)}
                    style={{
                      border: "1px solid var(--border-color)",
                      padding: "12px 8px",
                      fontWeight: 600,
                      textAlign: "left",
                      minWidth: "120px",
                      cursor: "pointer",
                      userSelect: "none",
                      // Fixed: Dynamic header background and text color for dark mode
                      backgroundColor: "var(--bg-secondary)",
                      color: "var(--text-primary)",
                      position: "relative",
                      fontSize: "13px",
                      // Add a subtle border to distinguish header in dark mode
                      borderBottom: "2px solid var(--primary-color)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "8px",
                      }}
                    >
                      <span
                        style={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {header || `Column ${index + 1}`}
                      </span>
                      {sortConfig.key === index && (
                        <span
                          style={{
                            fontSize: "12px",
                            flexShrink: 0,
                            color: "var(--primary-color)",
                          }}
                        >
                          {sortConfig.direction === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {processedData.rows.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  style={{
                    backgroundColor:
                      rowIndex % 2 === 0
                        ? "var(--bg-secondary)"
                        : "rgba(0,0,0,0.02)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor =
                      "rgba(25, 118, 210, 0.04)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor =
                      rowIndex % 2 === 0
                        ? "var(--bg-secondary)"
                        : "rgba(0,0,0,0.02)";
                  }}
                >
                  {processedData.headers.map((_, colIndex) => {
                    const cellValue = row && row[colIndex];
                    const isEmpty =
                      cellValue === null ||
                      cellValue === undefined ||
                      cellValue === "";

                    return (
                      <td
                        key={colIndex}
                        style={{
                          border: "1px solid var(--border-color)",
                          padding: "8px",
                          color: isEmpty
                            ? "var(--text-secondary)"
                            : "var(--text-primary)",
                          verticalAlign: "top",
                          fontSize: "13px",
                          maxWidth: "200px",
                          minHeight: "32px",
                          height: "32px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                        title={isEmpty ? "" : String(cellValue)}
                      >
                        {isEmpty ? "" : formatCellValue(cellValue)}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div
            style={{
              padding: "40px",
              textAlign: "center",
              color: "var(--text-secondary)",
            }}
          >
            <p>No data available in sheet "{activeSheet}"</p>
            {searchTerm && (
              <p style={{ fontSize: "14px" }}>
                Try adjusting your search term: "{searchTerm}"
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExcelViewer;
