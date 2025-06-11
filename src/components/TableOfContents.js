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
            }}
          >
            <span className="toc-bullet">•</span>
            <span className="toc-text">{item.text}</span>
          </div>
        ))}
      </div>

      <div className="toc-footer">
        <small>
          {items.length} heading{items.length !== 1 ? "s" : ""}
        </small>
      </div>
    </div>
  );
};

export default TableOfContents;
