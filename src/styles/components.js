export const componentStyles = {
  // Button styles
  button: {
    base: {
      padding: "8px 16px",
      borderRadius: "4px",
      border: "none",
      fontSize: "14px",
      fontWeight: 500,
      cursor: "pointer",
      transition: "all 0.3s ease",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      textTransform: "uppercase",
      letterSpacing: "0.02857em",
      minWidth: "64px",
      boxSizing: "border-box",
    },

    variants: {
      contained: {
        backgroundColor: "var(--primary-color)",
        color: "white",
        boxShadow:
          "0 3px 1px -2px rgba(0,0,0,0.2), 0 2px 2px 0 rgba(0,0,0,0.14), 0 1px 5px 0 rgba(0,0,0,0.12)",
      },
      outlined: {
        backgroundColor: "transparent",
        color: "var(--primary-color)",
        border: "1px solid var(--primary-color)",
      },
      text: {
        backgroundColor: "transparent",
        color: "var(--primary-color)",
        border: "none",
      },
    },

    sizes: {
      small: {
        padding: "4px 10px",
        fontSize: "13px",
        minWidth: "56px",
      },
      medium: {
        padding: "6px 16px",
        fontSize: "14px",
        minWidth: "64px",
      },
      large: {
        padding: "8px 22px",
        fontSize: "15px",
        minWidth: "72px",
      },
    },
  },

  // Paper styles
  paper: {
    base: {
      backgroundColor: "var(--bg-secondary)",
      borderRadius: "4px",
      boxShadow:
        "0 2px 1px -1px rgba(0,0,0,0.2), 0 1px 1px 0 rgba(0,0,0,0.14), 0 1px 3px 0 rgba(0,0,0,0.12)",
      transition: "box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
    },

    elevations: {
      0: { boxShadow: "none" },
      1: {
        boxShadow:
          "0 2px 1px -1px rgba(0,0,0,0.2), 0 1px 1px 0 rgba(0,0,0,0.14), 0 1px 3px 0 rgba(0,0,0,0.12)",
      },
      2: {
        boxShadow:
          "0 3px 1px -2px rgba(0,0,0,0.2), 0 2px 2px 0 rgba(0,0,0,0.14), 0 1px 5px 0 rgba(0,0,0,0.12)",
      },
      3: {
        boxShadow:
          "0 3px 3px -2px rgba(0,0,0,0.2), 0 3px 4px 0 rgba(0,0,0,0.14), 0 1px 8px 0 rgba(0,0,0,0.12)",
      },
      4: {
        boxShadow:
          "0 2px 4px -1px rgba(0,0,0,0.2), 0 4px 5px 0 rgba(0,0,0,0.14), 0 1px 10px 0 rgba(0,0,0,0.12)",
      },
      8: {
        boxShadow:
          "0 5px 5px -3px rgba(0,0,0,0.2), 0 8px 10px 1px rgba(0,0,0,0.14), 0 3px 14px 2px rgba(0,0,0,0.12)",
      },
      16: {
        boxShadow:
          "0 8px 10px -5px rgba(0,0,0,0.2), 0 16px 24px 2px rgba(0,0,0,0.14), 0 6px 30px 5px rgba(0,0,0,0.12)",
      },
      24: {
        boxShadow:
          "0 11px 15px -7px rgba(0,0,0,0.2), 0 24px 38px 3px rgba(0,0,0,0.14), 0 9px 46px 8px rgba(0,0,0,0.12)",
      },
    },
  },

  // Input styles
  input: {
    base: {
      padding: "16.5px 14px",
      border: "1px solid rgba(0, 0, 0, 0.23)",
      borderRadius: "4px",
      fontSize: "16px",
      fontFamily: "inherit",
      backgroundColor: "transparent",
      transition: "border-color 0.3s ease, box-shadow 0.3s ease",
      width: "100%",
      boxSizing: "border-box",
    },

    states: {
      focused: {
        borderColor: "var(--primary-color)",
        borderWidth: "2px",
        outline: "none",
      },
      error: {
        borderColor: "#f44336",
      },
      disabled: {
        backgroundColor: "rgba(0, 0, 0, 0.05)",
        cursor: "not-allowed",
      },
    },

    variants: {
      outlined: {
        border: "1px solid rgba(0, 0, 0, 0.23)",
      },
      filled: {
        backgroundColor: "rgba(0, 0, 0, 0.04)",
        border: "none",
        borderBottom: "1px solid rgba(0, 0, 0, 0.42)",
        borderRadius: "4px 4px 0 0",
      },
      standard: {
        border: "none",
        borderBottom: "1px solid rgba(0, 0, 0, 0.42)",
        borderRadius: "0",
        padding: "8px 0",
      },
    },
  },

  // Typography styles
  typography: {
    h1: { fontSize: "6rem", fontWeight: 300, lineHeight: 1.167 },
    h2: { fontSize: "3.75rem", fontWeight: 300, lineHeight: 1.2 },
    h3: { fontSize: "3rem", fontWeight: 400, lineHeight: 1.167 },
    h4: { fontSize: "2.125rem", fontWeight: 400, lineHeight: 1.235 },
    h5: { fontSize: "1.5rem", fontWeight: 400, lineHeight: 1.334 },
    h6: { fontSize: "1.25rem", fontWeight: 500, lineHeight: 1.6 },

    subtitle1: { fontSize: "1rem", fontWeight: 400, lineHeight: 1.75 },
    subtitle2: { fontSize: "0.875rem", fontWeight: 500, lineHeight: 1.57 },

    body1: { fontSize: "1rem", fontWeight: 400, lineHeight: 1.5 },
    body2: { fontSize: "0.875rem", fontWeight: 400, lineHeight: 1.43 },

    button: {
      fontSize: "0.875rem",
      fontWeight: 500,
      lineHeight: 1.75,
      textTransform: "uppercase",
    },
    caption: { fontSize: "0.75rem", fontWeight: 400, lineHeight: 1.66 },
    overline: {
      fontSize: "0.75rem",
      fontWeight: 400,
      lineHeight: 2.66,
      textTransform: "uppercase",
    },
  },

  // Chip styles
  chip: {
    base: {
      display: "inline-flex",
      alignItems: "center",
      padding: "0 12px",
      height: "32px",
      borderRadius: "16px",
      fontSize: "13px",
      fontWeight: 500,
      backgroundColor: "rgba(0, 0, 0, 0.08)",
      color: "rgba(0, 0, 0, 0.87)",
      cursor: "default",
      transition: "all 0.3s ease",
    },

    variants: {
      filled: {
        backgroundColor: "var(--primary-color)",
        color: "white",
      },
      outlined: {
        backgroundColor: "transparent",
        border: "1px solid rgba(0, 0, 0, 0.23)",
      },
    },

    sizes: {
      small: {
        height: "24px",
        fontSize: "11px",
        padding: "0 8px",
      },
      medium: {
        height: "32px",
        fontSize: "13px",
        padding: "0 12px",
      },
    },
  },

  // Avatar styles
  avatar: {
    base: {
      width: "40px",
      height: "40px",
      borderRadius: "50%",
      backgroundColor: "rgba(0, 0, 0, 0.08)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "20px",
      fontWeight: 500,
    },

    sizes: {
      small: { width: "24px", height: "24px", fontSize: "12px" },
      medium: { width: "40px", height: "40px", fontSize: "20px" },
      large: { width: "56px", height: "56px", fontSize: "28px" },
    },
  },

  // Card styles
  card: {
    base: {
      backgroundColor: "var(--bg-secondary)",
      borderRadius: "4px",
      boxShadow:
        "0 2px 1px -1px rgba(0,0,0,0.2), 0 1px 1px 0 rgba(0,0,0,0.14), 0 1px 3px 0 rgba(0,0,0,0.12)",
      overflow: "hidden",
    },

    header: {
      padding: "16px",
      borderBottom: "1px solid var(--border-color)",
    },

    content: {
      padding: "16px",
    },

    actions: {
      padding: "8px",
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      gap: "8px",
    },
  },
};

export const muiHelpers = {
  // Create consistent spacing
  spacing: (factor) => `${factor * 8}px`,

  // Create box shadows
  createShadow: (elevation) => {
    const shadows = componentStyles.paper.elevations;
    return shadows[elevation] || shadows[1];
  },

  // Create responsive breakpoints
  createBreakpoint: (breakpoint, styles) => {
    const breakpoints = {
      xs: "0px",
      sm: "600px",
      md: "960px",
      lg: "1280px",
      xl: "1920px",
    };

    return `@media (min-width: ${breakpoints[breakpoint]}) { ${styles} }`;
  },

  // Create hover effects
  createHover: (styles) => {
    return `&:hover { ${styles} }`;
  },

  // Create focus effects
  createFocus: (styles) => {
    return `&:focus { ${styles} }`;
  },
};

export default componentStyles;
