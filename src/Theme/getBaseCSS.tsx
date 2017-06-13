
const getBaseCSS = (theme: ReactUWP.ThemeType, themeClassName: string) => `.${themeClassName} * {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

*::-webkit-scrollbar {
  -webkit-appearance: none
}

*::-webkit-scrollbar-track {
  background-color: ${theme.useFluentDesign ? theme.chromeLow : theme.chromeLow};
}

*::-webkit-scrollbar:vertical {
  width: 6px;
}

*::-webkit-scrollbar:horizontal {
  height: 6px
}

*::-webkit-scrollbar-thumb {
  background-color: ${theme.useFluentDesign ? theme.baseLow : theme.baseMediumLow};
}

body {
  margin: 0;
}

.${themeClassName} *:after, *:before {
  box-sizing: border-box;
}

.${themeClassName} {
  -webkit-text-size-adjust: none;
}

.${themeClassName} {
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  -moz-osx-font-smoothing: grayscale;
}

.${themeClassName} input, .${themeClassName} textarea {
  box-shadow: none;
  border-radius: none;
}`;

export default getBaseCSS;
