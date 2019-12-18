export function getBaseCSS(selectors = "") {
  return `${selectors} * {
  margin: 0;
  padding: 0;
  box-sizing: border-box;

  -webkit-text-size-adjust: none;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  -moz-osx-font-smoothing: grayscale;
}

${selectors} *::after, ${selectors} *::before {
  box-sizing: border-box;
}

${selectors} input, ${selectors} textarea {
  box-shadow: none;
  border-radius: none;
}

${selectors} *::-webkit-scrollbar:vertical {
  width: 6px;
}

${selectors} *::-webkit-scrollbar:horizontal {
  height: 6px
}

${selectors} *::-webkit-scrollbar {
  -webkit-appearance: none
}
`;
}

/**
 * @param theme
 * @param selectors
 * getBaseCSS(theme, ":scope")
 */
export function getThemeBaseCSS(theme: ReactUWP.ThemeType, selectors = "") {
  const baseCSSText = `${selectors} *::-webkit-scrollbar-track {
  background-color: ${theme.chromeLow};
}

${selectors} *::-webkit-scrollbar-thumb {
  background-color: ${theme.chromeHigh};
}
`;
  return baseCSSText;
}

export default getThemeBaseCSS;
