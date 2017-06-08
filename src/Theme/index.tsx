import * as React from "react";
import * as PropTypes from "prop-types";

import darkTheme from "../styles/darkTheme";
import getTheme from "../styles/getTheme";
import RenderToBody from "../RenderToBody";

export interface DataProps {
  theme?: ReactUWP.ThemeType;
  useFluentDesign?: boolean;
  autoSaveTheme?: boolean;
  blurBackground?: string;
}

export interface ThemeProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export interface ThemeState {
  currTheme?: ReactUWP.ThemeType;
}

const customLocalStorageName = "__REACT_UWP__";
const themeClassName = "react-uwp-theme";
const getBaseCSSString = (theme: ReactUWP.ThemeType) => `.${themeClassName} * {
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

export class Theme extends React.Component<ThemeProps, ThemeState> {
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

  componentDidMount() {
    this.updateDidMethod();
  }

  componentDidUpdate() {
    this.updateDidMethod();
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScrollReveal);
  }

  updateDidMethod = () => {
    if (!window.__REACT_UWP__) {
      window.__REACT_UWP__ = {};
    }
    window.addEventListener("scroll", this.handleScrollReveal);
    this.updateBaseCSS();
  }

  componentWillReceiveProps(nextProps: ThemeProps) {
    if (nextProps && nextProps.theme) {
      if (
        nextProps.theme.accent !== this.state.currTheme.accent ||
        nextProps.theme.themeName !== this.state.currTheme.themeName
      ) {
        this.setState({
          currTheme: nextProps.theme
        });
      }
    }
  }

  handleScrollReveal = (e?: Event) => {
    if (window.__REACT_UWP__ && window.__REACT_UWP__.scrollReveals) {
      for (const scrollReveal of window.__REACT_UWP__.scrollReveals) {
        const {
          rootElm,
          animate,
          animated,
          initializeAnimation,
          props: {
            topOffset,
            bottomOffset
          }
        } = scrollReveal;
        const { top, height } = rootElm.getBoundingClientRect();
        const { innerHeight } = window;

        let isIn = false;
        if (height > innerHeight) {
          isIn = top < innerHeight - height * height && top > - height * 0.5;
        } else {
          isIn = top > 0 + topOffset && top + height + bottomOffset < innerHeight;
        }
        if (isIn) {
          if (!animated) {
            animate();
            scrollReveal.animated = true;
          }
        } else {
          if (animated) {
            initializeAnimation();
            scrollReveal.animated = false;
          }
        }
      }
    }
  }

  saveTheme = (newTheme?: ReactUWP.ThemeType) => {
    newTheme.blurBackground = this.state.currTheme.blurBackground;
    newTheme.useFluentDesign = this.state.currTheme.useFluentDesign;
    newTheme.saveTheme = this.saveTheme;
    localStorage.setItem(customLocalStorageName, JSON.stringify({
      themeName: newTheme.themeName,
      accent: newTheme.accent
    }));
    this.setState({
      currTheme: newTheme
    });
  }

  getDefaultTheme = () => {
    let theme: ReactUWP.ThemeType;

    if (this.props.autoSaveTheme) {
      const storageString = localStorage.getItem(customLocalStorageName);
      if (storageString) {
        let data: any = {};
        try {
          data = JSON.parse(storageString);
          theme = getTheme(data.themeName, data.accent, this.props.useFluentDesign);
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
    if (this.props.blurBackground) theme.blurBackground = this.props.blurBackground;
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
      useFluentDesign,
      blurBackground,
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
          background: useFluentDesign ? void 0 : currTheme.altHigh,
          width: "100%",
          height: "100%",
          ...style
        })}
      >
        {useFluentDesign && blurBackground && (
          <RenderToBody
            style={currTheme.prepareStyles({
              position: "fixed",
              zIndex: -1,
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: `url(${currTheme.blurBackground}) no-repeat fixed top left / cover`
            })}
          />
        )}
        {children}
      </div>
    );
  }
}

export default Theme;
