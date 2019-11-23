import { fonts } from "./getTheme";

export function getGlobalBaseCSS() {
  return `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

*::-webkit-scrollbar:vertical {
  width: 6px;
}

*::-webkit-scrollbar:horizontal {
  height: 6px
}

*::-webkit-scrollbar {
  -webkit-appearance: none
}

*:after, *:before {
  box-sizing: border-box;
}

* {
  -webkit-text-size-adjust: none;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  -moz-osx-font-smoothing: grayscale;
}

input, textarea {
  box-shadow: none;
  border-radius: none;
}

* {
  font-family: ${fonts.sansSerifFonts.split(", ").map((font: string) => `"${font}"`).join(", ")};
}
`;
}


/**
 * 
 * @param theme 
 * @param selectors 
 * getBaseCSS(theme, ":scope")
 */
export function getThemeBaseCSS(theme: ReactUWP.ThemeType, selectors = ":scope") {
  return `${selectors} * ::placeholder {
  color: ${theme.baseLow};
}

${selectors} * ::placeholder {
  color: ${theme.baseMedium};
}

${selectors} *::-webkit-scrollbar-track {
  background-color: ${theme.chromeLow};
}

${selectors} *::-webkit-scrollbar-thumb {
  background-color: ${theme.useFluentDesign ? theme.baseLow : theme.baseMediumLow};
}
`;
}

export default getThemeBaseCSS;
