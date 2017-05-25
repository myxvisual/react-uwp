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
  theme?: ThemeType;
}

const customLocalStorageName = "__react-uwp__";
const themeClassName = "react-uwp-theme";
const baseCSSString = `.${themeClassName} * {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
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

  updateBaseCSS = () => {
    let styleSheet = document.querySelector(`.${themeClassName}-style-sheet`);
    if (styleSheet) {
      styleSheet.innerHTML = baseCSSString;
    } else {
      styleSheet = document.createElement("style");
      styleSheet.className = themeClassName;
      styleSheet.innerHTML = baseCSSString;
      document.head.appendChild(styleSheet);
    }
  }

  componentDidMount() {
    this.updateBaseCSS();
  }

  componentDidUpdate() {
    this.updateBaseCSS();
  }

  saveTheme = (theme?: ThemeType) => {
    theme.saveTheme = this.saveTheme;
    localStorage.setItem(customLocalStorageName, JSON.stringify({
      themeName: theme.themeName,
      accent: theme.accent
    }));
    this.setState({
      theme
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
    theme: this.getDefaultTheme()
  };

  getChildContext() {
    return { theme: this.state.theme };
  }

  render() {
    const { autoSaveTheme, children, theme, style, className, ...attributes } = this.props;

    return (
      <div
        {...attributes}
        className={className ? `${themeClassName} ${className}` : themeClassName}
        style={darkTheme.prepareStyles({
          fontSize: 14,
          fontFamily: darkTheme.fontFamily,
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
