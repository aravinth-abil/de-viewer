export const lightTheme = {
  primary: "#1976d2",
  primaryLight: "#42a5f5",
  primaryDark: "#1565c0",
  secondary: "#dc004e",
  secondaryLight: "#ff5983",
  secondaryDark: "#9a0036",

  // Background colors
  background: {
    default: "#f5f5f5",
    paper: "#ffffff",
    surface: "#fafafa",
    elevated: "#ffffff",
  },

  // Text colors
  text: {
    primary: "#333333",
    secondary: "#666666",
    disabled: "#999999",
    hint: "#aaaaaa",
  },

  // Border and divider colors
  divider: "#e0e0e0",
  border: "#dddddd",

  // Status colors
  success: "#4caf50",
  warning: "#ff9800",
  error: "#f44336",
  info: "#2196f3",

  // Action colors
  action: {
    active: "#1976d2",
    hover: "rgba(25, 118, 210, 0.04)",
    selected: "rgba(25, 118, 210, 0.08)",
    disabled: "rgba(0, 0, 0, 0.26)",
    disabledBackground: "rgba(0, 0, 0, 0.12)",
  },

  // Shadow
  shadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  shadowHover: "0 4px 16px rgba(0, 0, 0, 0.15)",
};

export const darkTheme = {
  primary: "#2196f3",
  primaryLight: "#64b5f6",
  primaryDark: "#1976d2",
  secondary: "#f50057",
  secondaryLight: "#ff5983",
  secondaryDark: "#c51162",

  // Background colors
  background: {
    default: "#121212",
    paper: "#1e1e1e",
    surface: "#2d2d2d",
    elevated: "#383838",
  },

  // Text colors
  text: {
    primary: "#ffffff",
    secondary: "#aaaaaa",
    disabled: "#666666",
    hint: "#888888",
  },

  // Border and divider colors
  divider: "#333333",
  border: "#444444",

  // Status colors
  success: "#66bb6a",
  warning: "#ffb74d",
  error: "#ef5350",
  info: "#42a5f5",

  // Action colors
  action: {
    active: "#2196f3",
    hover: "rgba(33, 150, 243, 0.08)",
    selected: "rgba(33, 150, 243, 0.12)",
    disabled: "rgba(255, 255, 255, 0.3)",
    disabledBackground: "rgba(255, 255, 255, 0.12)",
  },

  // Shadow
  shadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
  shadowHover: "0 4px 16px rgba(0, 0, 0, 0.4)",
};

export const createTheme = (mode = "light") => {
  const baseTheme = mode === "dark" ? darkTheme : lightTheme;

  return {
    ...baseTheme,
    mode,

    // Helper functions
    getContrastText: (background) => {
      // Simple contrast calculation
      const hex = background.replace("#", "");
      const r = parseInt(hex.substr(0, 2), 16);
      const g = parseInt(hex.substr(2, 2), 16);
      const b = parseInt(hex.substr(4, 2), 16);
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
      return brightness > 128 ? "#000000" : "#ffffff";
    },

    // Spacing helper
    spacing: (factor) => `${factor * 8}px`,

    // Breakpoints
    breakpoints: {
      xs: "0px",
      sm: "600px",
      md: "960px",
      lg: "1280px",
      xl: "1920px",
    },

    // Z-index values
    zIndex: {
      appBar: 1100,
      drawer: 1200,
      modal: 1300,
      snackbar: 1400,
      tooltip: 1500,
    },
  };
};

// Fixed: Proper export
const themes = { lightTheme, darkTheme, createTheme };
export default themes;
