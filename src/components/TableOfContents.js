import React from "react";

const TableOfContents = ({ items, activeHeading, onHeadingClick }) => {
  if (!items || items.length === 0) {
    return null;
  }

  const handleHeadingClick = (headingId) => {
    onHeadingClick(headingId);
  };

  return (
    <div className="table-of-contents">
      <div className="toc-header">
        <h3>📋 Table of Contents</h3>
        <div
          style={{
            fontSize: "12px",
            color: "var(--text-secondary)",
            marginTop: "4px",
          }}
        >
          Click to navigate
        </div>
      </div>

      <div className="toc-list">
        {items.map((item, index) => (
          <div
            key={item.id}
            className={`toc-item toc-level-${item.level} ${
              activeHeading === item.id ? "active" : ""
            }`}
            onClick={() => handleHeadingClick(item.id)}
            style={{
              paddingLeft: `${12 + (item.level - 1) * 16}px`,
              padding: "8px 12px 8px " + `${12 + (item.level - 1) * 16}px`,
              cursor: "pointer",
              color:
                activeHeading === item.id
                  ? "var(--primary-color)"
                  : "var(--text-secondary)",
              backgroundColor:
                activeHeading === item.id
                  ? "rgba(25, 118, 210, 0.1)"
                  : "transparent",
              borderLeft: `3px solid ${
                activeHeading === item.id
                  ? "var(--primary-color)"
                  : "transparent"
              }`,
              borderRadius: "0 8px 8px 0",
              transition: "all 0.3s ease",
              fontSize: "14px",
              lineHeight: "1.4",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "2px",
            }}
            onMouseEnter={(e) => {
              if (activeHeading !== item.id) {
                e.target.style.backgroundColor = "rgba(25, 118, 210, 0.05)";
                e.target.style.color = "var(--primary-color)";
              }
            }}
            onMouseLeave={(e) => {
              if (activeHeading !== item.id) {
                e.target.style.backgroundColor = "transparent";
                e.target.style.color = "var(--text-secondary)";
              }
            }}
          >
            <span
              className="toc-bullet"
              style={{
                opacity: 0.5,
                fontWeight: "bold",
                fontSize: "10px",
                color:
                  activeHeading === item.id
                    ? "var(--primary-color)"
                    : "var(--text-secondary)",
              }}
            >
              •
            </span>
            <span
              className="toc-text"
              style={{
                flex: 1,
                wordWrap: "break-word",
                fontWeight: activeHeading === item.id ? "500" : "400",
              }}
            >
              {item.text}
            </span>
            {activeHeading === item.id && (
              <span
                style={{
                  fontSize: "10px",
                  color: "var(--primary-color)",
                  animation: "pulse 2s infinite",
                }}
              >
                ▶
              </span>
            )}
          </div>
        ))}
      </div>

      <div className="toc-footer">
        <small
          style={{
            color: "var(--text-secondary)",
            fontSize: "11px",
          }}
        >
          {items.length} heading{items.length !== 1 ? "s" : ""} found
        </small>
      </div>
    </div>
  );
};

export default TableOfContents;
