
function getBaseCSS(theme: ReactUWP.ThemeType, themeClassName = "uwp-base", scrollBarStyleSelector = "*") {
  return `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.${themeClassName} * {
  font-family: ${theme.fonts.sansSerifFonts.split(", ").map((font: string) => `"${font}"`).join(", ")};
}

body {
  margin: 0;
}

${scrollBarStyleSelector}::-webkit-scrollbar-track {
  background-color: ${theme.chromeLow};
}

${scrollBarStyleSelector}::-webkit-scrollbar-thumb {
  background-color: ${theme.useFluentDesign ? theme.baseLow : theme.baseMediumLow};
}

${scrollBarStyleSelector}::-webkit-scrollbar:vertical {
  width: 6px;
}

${scrollBarStyleSelector}::-webkit-scrollbar:horizontal {
  height: 6px
}

${scrollBarStyleSelector}::-webkit-scrollbar {
  -webkit-appearance: none
}

.${themeClassName} *:after, .${themeClassName} *:before {
  box-sizing: border-box;
}

.${themeClassName} {
  -webkit-text-size-adjust: none;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  -moz-osx-font-smoothing: grayscale;
}

.${themeClassName} input, .${themeClassName} textarea {
  box-shadow: none;
  border-radius: none;
}
`;
}

export default getBaseCSS;
