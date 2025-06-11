import React from "react";

const ShimmerLoader = ({ type = "document", rows = 8, columns = 6 }) => {
  const shimmerStyle = {
    background: "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
    backgroundSize: "200% 100%",
    animation: "shimmer 1.5s infinite",
  };

  const containerStyle = {
    height: "calc(100vh - 160px)", // Full height like the actual viewers
    width: "100%",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "var(--bg-secondary)",
    borderRadius: "12px",
    padding: "24px",
    boxShadow: "var(--shadow)",
  };

  if (type === "excel") {
    return (
      <div style={containerStyle}>
        <style>{`
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
        `}</style>

        <div
          className="shimmer-excel"
          style={{ height: "100%", display: "flex", flexDirection: "column" }}
        >
          {/* Sheet tabs */}
          <div
            style={{
              display: "flex",
              gap: "8px",
              marginBottom: "16px",
              flexShrink: 0,
            }}
          >
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                style={{
                  ...shimmerStyle,
                  width: "100px",
                  height: "32px",
                  borderRadius: "8px",
                }}
              />
            ))}
          </div>

          {/* Search bar area */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "16px",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                ...shimmerStyle,
                width: "120px",
                height: "20px",
                borderRadius: "4px",
              }}
            />
            <div
              style={{
                ...shimmerStyle,
                width: "200px",
                height: "32px",
                borderRadius: "6px",
              }}
            />
          </div>

          {/* Table header */}
          <div
            style={{
              display: "flex",
              gap: "1px",
              marginBottom: "1px",
              flexShrink: 0,
            }}
          >
            {[...Array(columns)].map((_, i) => (
              <div
                key={i}
                style={{
                  ...shimmerStyle,
                  width: "120px",
                  height: "40px",
                  borderRadius: "4px",
                }}
              />
            ))}
          </div>

          {/* Table rows - scrollable area */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "1px",
            }}
          >
            {[...Array(15)].map((_, rowIndex) => (
              <div key={rowIndex} style={{ display: "flex", gap: "1px" }}>
                {[...Array(columns)].map((_, colIndex) => (
                  <div
                    key={colIndex}
                    style={{
                      ...shimmerStyle,
                      width: "120px",
                      height: "40px",
                      borderRadius: "4px",
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (type === "document") {
    return (
      <div style={containerStyle}>
        <style>{`
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
        `}</style>

        <div
          className="shimmer-document"
          style={{ height: "100%", display: "flex", flexDirection: "column" }}
        >
          {/* Editor header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "16px",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                ...shimmerStyle,
                width: "180px",
                height: "24px",
                borderRadius: "4px",
              }}
            />
            <div style={{ display: "flex", gap: "16px" }}>
              <div
                style={{
                  ...shimmerStyle,
                  width: "80px",
                  height: "20px",
                  borderRadius: "4px",
                }}
              />
              <div
                style={{
                  ...shimmerStyle,
                  width: "100px",
                  height: "20px",
                  borderRadius: "4px",
                }}
              />
            </div>
          </div>

          {/* Toolbar */}
          <div
            style={{
              display: "flex",
              gap: "4px",
              marginBottom: "16px",
              flexShrink: 0,
              flexWrap: "wrap",
            }}
          >
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                style={{
                  ...shimmerStyle,
                  width: "32px",
                  height: "32px",
                  borderRadius: "4px",
                }}
              />
            ))}
          </div>

          {/* Content area - scrollable */}
          <div
            style={{
              flex: 1,
              border: "2px solid #ddd",
              borderRadius: "8px",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              overflowY: "auto",
            }}
          >
            {/* Title shimmer */}
            <div
              style={{
                ...shimmerStyle,
                width: "60%",
                height: "32px",
                borderRadius: "4px",
              }}
            />

            {/* Paragraph shimmers */}
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                style={{
                  ...shimmerStyle,
                  width: `${Math.random() * 40 + 60}%`,
                  height: "20px",
                  borderRadius: "4px",
                }}
              />
            ))}
          </div>

          {/* Footer */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "16px",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                ...shimmerStyle,
                width: "200px",
                height: "16px",
                borderRadius: "4px",
              }}
            />
            <div
              style={{
                ...shimmerStyle,
                width: "300px",
                height: "16px",
                borderRadius: "4px",
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  // Default shimmer
  return (
    <div style={containerStyle}>
      <div
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        {[...Array(Math.ceil(rows * 1.5))].map((_, i) => (
          <div
            key={i}
            style={{
              ...shimmerStyle,
              width: `${Math.random() * 40 + 60}%`,
              height: "20px",
              borderRadius: "4px",
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ShimmerLoader;
