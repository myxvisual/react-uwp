import * as React from "react";
import * as PropTypes from "prop-types";

import darkTheme from "../styles/darkTheme";
import getTheme from "../styles/getTheme";
import ThemeType from "../styles/ThemeType";

export interface DataProps {
  theme?: ThemeType;
  autoSaveTheme?: boolean;
}

export interface ThemeProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export interface ThemeState {
  currTheme?: ThemeType;
}

const customLocalStorageName = "__REACT_UWP__";
const themeClassName = "react-uwp-theme";
const getBaseCSSString = (theme: ThemeType) => `.${themeClassName} * {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

*::-webkit-scrollbar {
  -webkit-appearance: none
}

*::-webkit-scrollbar-track {
  background-color: ${theme.chromeLow};
}

*::-webkit-scrollbar:vertical {
  width: 6px;
}

*::-webkit-scrollbar:horizontal {
  height: 6px
}

*::-webkit-scrollbar-thumb {
  background-color: ${theme.baseMediumLow};
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

export default class Theme extends React.Component<ThemeProps, ThemeState> {
  static childContextTypes = {
    theme: PropTypes.object
  };

  updateBaseCSS = (init = false) => {
    const styleSheetClassName = `.${themeClassName}-style-sheet`;
    let styleSheet = document.querySelector(styleSheetClassName);
    const CSSString = getBaseCSSString(this.state.currTheme);
    if (!window.__REACT_UWP__) window.__REACT_UWP__ = {};
    if (styleSheet || window.__REACT_UWP__.baseCSSRequired) {
      if (styleSheet) {
        styleSheet.innerHTML = CSSString;
      } else return;
    } else {
      styleSheet = document.createElement("style");
      styleSheet.className = styleSheetClassName;
      styleSheet.innerHTML = CSSString;
      document.head.appendChild(styleSheet);
      window.__REACT_UWP__.baseCSSRequired = true;
    }
  }

  componentWillMount() {
    // this.updateBaseCSS();
  }

  componentDidMount() {
    this.updateBaseCSS();
  }

  componentDidUpdate() {
    // this.updateBaseCSS();
  }

  saveTheme = (currTheme?: ThemeType) => {
    currTheme.saveTheme = this.saveTheme;
    localStorage.setItem(customLocalStorageName, JSON.stringify({
      themeName: currTheme.themeName,
      accent: currTheme.accent
    }));
    this.setState({
      currTheme
    });
  }

  getDefaultTheme = () => {
    let theme: ThemeType;

    if (this.props.autoSaveTheme) {
      const storageString = localStorage.getItem(customLocalStorageName);
      if (storageString) {
        let data: any = {};
        try {
          data = JSON.parse(storageString);
          theme = getTheme(data.themeName, data.accent);
        } catch (error) {
          theme = darkTheme;
        }
      } else {
        theme = darkTheme;
      }
      theme.saveTheme = this.saveTheme;
    } else {
      theme = this.props.theme || darkTheme;
    }
    return theme;
  }

  state: ThemeState = {
    currTheme: this.getDefaultTheme()
  };

  getChildContext() {
    return { theme: this.state.currTheme };
  }

  render() {
    const {
      autoSaveTheme,
      children,
      style,
      className,
      theme,
      ...attributes
    } = this.props;
    const { currTheme } = this.state;

    return (
      <div
        {...attributes}
        className={className ? `${themeClassName} ${className}` : themeClassName}
        style={darkTheme.prepareStyles({
          fontSize: 14,
          fontFamily: currTheme.fontFamily,
          color: currTheme.baseHigh,
          background: currTheme.altHigh,
          width: "100%",
          height: "100%",
          ...style
        })}
      >
        {children}
      </div>
    );
  }
}
