import React from "react";

const ShimmerLoader = ({ type = "document", rows = 8, columns = 6 }) => {
  const shimmerStyle = {
    background: "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
    backgroundSize: "200% 100%",
    animation: "shimmer 1.5s infinite",
  };

  if (type === "excel") {
    return (
      <div className="shimmer-container">
        <style>{`
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
        `}</style>

        <div className="shimmer-excel">
          {/* Sheet tabs */}
          <div className="shimmer-tabs">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="shimmer-tab"
                style={{
                  ...shimmerStyle,
                  width: "100px",
                  height: "32px",
                  borderRadius: "8px",
                  marginRight: "8px",
                }}
              />
            ))}
          </div>

          {/* Table header */}
          <div className="shimmer-table-header">
            {[...Array(columns)].map((_, i) => (
              <div
                key={i}
                className="shimmer-header-cell"
                style={{
                  ...shimmerStyle,
                  width: "120px",
                  height: "40px",
                  borderRadius: "4px",
                  marginRight: "1px",
                }}
              />
            ))}
          </div>

          {/* Table rows */}
          {[...Array(rows)].map((_, rowIndex) => (
            <div key={rowIndex} className="shimmer-table-row">
              {[...Array(columns)].map((_, colIndex) => (
                <div
                  key={colIndex}
                  className="shimmer-cell"
                  style={{
                    ...shimmerStyle,
                    width: "120px",
                    height: "40px",
                    borderRadius: "4px",
                    marginRight: "1px",
                    marginBottom: "1px",
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === "document") {
    return (
      <div className="shimmer-container">
        <div className="shimmer-document">
          {/* Title */}
          <div
            style={{
              ...shimmerStyle,
              width: "60%",
              height: "32px",
              borderRadius: "4px",
              marginBottom: "24px",
            }}
          />

          {/* Paragraphs */}
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              style={{
                ...shimmerStyle,
                width: `${Math.random() * 40 + 60}%`,
                height: "20px",
                borderRadius: "4px",
                marginBottom: "12px",
              }}
            />
          ))}

          {/* Subheading */}
          <div
            style={{
              ...shimmerStyle,
              width: "45%",
              height: "28px",
              borderRadius: "4px",
              marginTop: "32px",
              marginBottom: "16px",
            }}
          />

          {/* More paragraphs */}
          {[...Array(8)].map((_, i) => (
            <div
              key={i + 20}
              style={{
                ...shimmerStyle,
                width: `${Math.random() * 35 + 65}%`,
                height: "20px",
                borderRadius: "4px",
                marginBottom: "12px",
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (type === "toc") {
    return (
      <div className="shimmer-container">
        <div className="shimmer-toc">
          {/* TOC Title */}
          <div
            style={{
              ...shimmerStyle,
              width: "80%",
              height: "24px",
              borderRadius: "4px",
              marginBottom: "16px",
            }}
          />

          {/* TOC Items */}
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              style={{
                ...shimmerStyle,
                width: `${Math.random() * 30 + 50}%`,
                height: "16px",
                borderRadius: "4px",
                marginBottom: "8px",
                marginLeft: `${(i % 3) * 12}px`,
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (type === "ai") {
    return (
      <div className="shimmer-container">
        <div className="shimmer-ai">
          {/* Header */}
          <div
            style={{
              ...shimmerStyle,
              width: "70%",
              height: "24px",
              borderRadius: "4px",
              marginBottom: "16px",
            }}
          />

          {/* Action buttons */}
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              style={{
                ...shimmerStyle,
                width: "100%",
                height: "48px",
                borderRadius: "8px",
                marginBottom: "8px",
              }}
            />
          ))}

          {/* Suggestion area */}
          <div
            style={{
              ...shimmerStyle,
              width: "100%",
              height: "120px",
              borderRadius: "8px",
              marginTop: "16px",
            }}
          />
        </div>
      </div>
    );
  }

  // Default/generic shimmer
  return (
    <div className="shimmer-container">
      <div className="shimmer-generic">
        {[...Array(rows)].map((_, i) => (
          <div
            key={i}
            style={{
              ...shimmerStyle,
              width: `${Math.random() * 40 + 60}%`,
              height: "20px",
              borderRadius: "4px",
              marginBottom: "12px",
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ShimmerLoader;
