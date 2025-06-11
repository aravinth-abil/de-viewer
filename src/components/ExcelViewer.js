import React, { useState, useMemo, useCallback } from "react";
import { formatCellValue } from "../utils/helpers";

const ExcelViewer = ({ data, maxRows = 1000 }) => {
  const [activeSheet, setActiveSheet] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const sheets = useMemo(() => Object.keys(data || {}), [data]);

  React.useEffect(() => {
    if (sheets.length > 0 && !activeSheet) {
      setActiveSheet(sheets[0]);
    }
  }, [sheets, activeSheet]);

  const processedData = useMemo(() => {
    if (!data || !activeSheet) return { headers: [], rows: [] };

    const sheetData = data[activeSheet];
    if (!sheetData || sheetData.length === 0) return { headers: [], rows: [] };

    const headers = sheetData[0] || [];
    let rows = sheetData.slice(1, maxRows + 1);

    // Apply search filter
    if (searchTerm) {
      rows = rows.filter((row) =>
        row.some((cell) => {
          if (cell === null || cell === undefined) return false;
          return String(cell).toLowerCase().includes(searchTerm.toLowerCase());
        })
      );
    }

    // Apply sorting
    if (sortConfig.key !== null) {
      rows.sort((a, b) => {
        const aVal = a[sortConfig.key] || "";
        const bVal = b[sortConfig.key] || "";

        if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return { headers, rows };
  }, [data, activeSheet, searchTerm, sortConfig, maxRows]);

  const handleSort = useCallback((columnIndex) => {
    setSortConfig((prev) => ({
      key: columnIndex,
      direction:
        prev.key === columnIndex && prev.direction === "asc" ? "desc" : "asc",
    }));
  }, []);

  if (!data || sheets.length === 0) {
    return (
      <div className="excel-viewer">
        <div
          style={{
            padding: "40px",
            textAlign: "center",
            color: "var(--text-secondary)",
            fontSize: "16px",
          }}
        >
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>📊</div>
          <h3>No Excel data available</h3>
          <p>Please upload a valid Excel file (.xlsx, .xls, .csv)</p>
        </div>
      </div>
    );
  }

  return (
    <div className="excel-viewer">
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
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {sheets.map((sheetName) => (
            <button
              key={sheetName}
              onClick={() => setActiveSheet(sheetName)}
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: 500,
                transition: "all 0.2s ease",
                backgroundColor:
                  activeSheet === sheetName
                    ? "var(--primary-color)"
                    : "#f5f5f5",
                color: activeSheet === sheetName ? "white" : "#333",
              }}
            >
              {sheetName}
            </button>
          ))}
        </div>

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

      {/* Data Info */}
      <div
        style={{
          marginBottom: "16px",
          fontSize: "14px",
          color: "var(--text-secondary)",
          flexShrink: 0,
        }}
      >
        Showing {processedData.rows.length} rows
        {searchTerm && ` (filtered from ${data[activeSheet].length - 1} total)`}
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
              backgroundColor: "#f8f9fa",
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
                    backgroundColor: "#f8f9fa",
                    color: "var(--text-primary)",
                    position: "relative",
                    fontSize: "13px",
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
                      <span style={{ fontSize: "12px", flexShrink: 0 }}>
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
                  "&:hover": {
                    backgroundColor: "rgba(25, 118, 210, 0.04)",
                  },
                }}
              >
                {processedData.headers.map((_, colIndex) => {
                  const cellValue = row[colIndex];
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
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                      title={isEmpty ? "" : String(cellValue)} // Tooltip for long content
                    >
                      {isEmpty ? "" : formatCellValue(cellValue)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Empty state */}
        {processedData.rows.length === 0 && (
          <div
            style={{
              padding: "40px",
              textAlign: "center",
              color: "var(--text-secondary)",
            }}
          >
            <p>No data to display</p>
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
