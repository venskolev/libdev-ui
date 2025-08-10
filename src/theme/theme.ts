// Никакви хардкоднати hex-ове тук – всичко сочи към CSS променливи,
// за да няма drift спрямо global.css.

export const theme = {
  colors: {
    primary: "var(--ld-color-primary)",
    primaryHover: "var(--ld-color-primary-hover)",

    secondary: "var(--ld-color-secondary)",
    secondaryHover: "var(--ld-color-secondary-hover)",
    secondaryDisabled: "var(--ld-color-secondary-disabled)",
    secondaryDisabledText: "var(--ld-color-secondary-disabled-text)",

    white: "var(--ld-color-white)",
    text: "var(--ld-color-text-dark)",
    textSecondary: "var(--ld-color-text-secondary)",

    background: "var(--ld-color-background-level0)",
    backgroundLevel0: "var(--ld-color-background-level0)",
    backgroundLevel1: "var(--ld-color-background-level1)",
    backgroundLevel2: "var(--ld-color-background-level2)",

    borderDefault: "var(--ld-color-border-default)",
  },

  radius: {
    sm: "var(--ld-radius-sm)",
    md: "var(--ld-radius-md)",
    lg: "var(--ld-radius-lg)",
    xl: "var(--ld-radius-xl)",
    "2xl": "var(--ld-radius-2xl)",
  },

  shadows: {
    xs: "var(--ld-shadow-xs)",
    sm: "var(--ld-shadow-sm)",
    md: "var(--ld-shadow-md)",
    lg: "var(--ld-shadow-lg)",
    xl: "var(--ld-shadow-xl)",
  },

  // spacing държим отделно; може да остане както е
  spacing: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
  },
};

export type LibDevTheme = typeof theme;
export default theme;
