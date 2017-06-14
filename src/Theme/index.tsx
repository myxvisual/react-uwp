import * as React from "react";
import * as PropTypes from "prop-types";

import darkTheme from "../styles/darkTheme";
import getTheme from "../styles/getTheme";
import RenderToBody from "../RenderToBody";
import getBaseCSS from "./getBaseCSS";
import generateAcrylicTexture from "../styles/generateAcrylicTexture";

export { getTheme };
export interface DataProps {
  /**
   * Set theme object. [ThemeType](https://github.com/myxvisual/react-uwp/blob/master/typings/index.d.ts#L34), Usually use [getTheme](https://github.com/myxvisual/react-uwp/blob/master/src/styles/getTheme.ts#L23) function to get it.
   */
  theme?: ReactUWP.ThemeType;
  /**
   * For simple development, autoSaveTheme can read and save theme to `localStorage`. use global context `theme.saveTheme` method to save.
   */
  autoSaveTheme?: boolean;
  /**
   * onGeneratedAcrylic callback, base acrylic textures is base64 url image, for production, you can set this callback, post image to your server, and update theme(use this callback will not auto update theme).
   */
  onGeneratedAcrylic?: (theme?: ReactUWP.ThemeType) => void;
  /**
   * for production if you have generated acrylic textures, you can disabled generation acrylic textures.
   */
  needGenerateAcrylic?: boolean;
}

export interface ThemeProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export interface ThemeState {
  currTheme?: ReactUWP.ThemeType;
}

if (!window.__REACT_UWP__) window.__REACT_UWP__ = {};
const customLocalStorageName = "__REACT_UWP__";
const baseClassName = "react-uwp-theme";
const themeCallback: (theme?: ReactUWP.ThemeType) => void = () => {};

export class Theme extends React.Component<ThemeProps, ThemeState> {
  static defaultProps: ThemeProps = {
    needGenerateAcrylic: true
  };
  static childContextTypes = {
    theme: PropTypes.object
  };
  acrylicTextureCount = 0;
  themeClassName = "react-uwp-theme-dark";

  getDefaultTheme = () => {
    let theme: ReactUWP.ThemeType;
    let defaultConfig: any = {};

    theme = this.props.theme;
    if (theme) {
      Object.assign(defaultConfig, {
        themeName: theme.themeName,
        accent: theme.accent,
        useFluentDesign: theme.useFluentDesign,
        desktopBackgroundImage: theme.desktopBackgroundImage
      });
    }

    if (this.props.autoSaveTheme) {
      const storageString = localStorage.getItem(customLocalStorageName);
      if (storageString) {
        let data: any = {};
        try {
          data = JSON.parse(storageString);
          const { themeName, accent, useFluentDesign, desktopBackgroundImage } = data;
          theme = getTheme({
            themeName: themeName === void 0 ? defaultConfig.themeName : themeName,
            accent: accent === void 0 ? defaultConfig.accent : accent,
            useFluentDesign: useFluentDesign === void 0 ? defaultConfig.useFluentDesign : useFluentDesign,
            desktopBackgroundImage: desktopBackgroundImage === void 0 ? defaultConfig.desktopBackgroundImage : desktopBackgroundImage
          });
        } catch (error) {
          theme = this.props.theme || darkTheme;
        }
      } else {
        theme = this.props.theme || darkTheme;
      }
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

  componentDidMount() {
    const { currTheme } = this.state;
    if (currTheme.useFluentDesign && currTheme.desktopBackgroundImage && this.props.needGenerateAcrylic) {
      this.generateAcrylicTextures();
    }
    this.updateBaseCSS();
    window.addEventListener("scroll", this.handleScrollReveal);
  }

  componentWillReceiveProps(nextProps: ThemeProps) {
    const { theme } = nextProps;
    const { currTheme } = this.state;

    let needGenerateAcrylic = theme.useFluentDesign && theme.desktopBackgroundImage && this.props.needGenerateAcrylic;

    if (needGenerateAcrylic && theme.desktopBackgroundImage === currTheme.desktopBackgroundImage) {
      needGenerateAcrylic = false;
      Object.assign(theme, {
        acrylicTexture40: currTheme.acrylicTexture40,
        acrylicTexture60: currTheme.acrylicTexture60,
        acrylicTexture80: currTheme.acrylicTexture80
      } as ReactUWP.ThemeType);
    }

    if (nextProps && nextProps.theme && !this.props.autoSaveTheme) {
      if (
        theme.accent !== currTheme.accent ||
        theme.themeName !== currTheme.themeName ||
        theme.useFluentDesign !== currTheme.useFluentDesign ||
        theme.desktopBackgroundImage !== currTheme.desktopBackgroundImage
      ) {
        this.setState({
          currTheme: theme
        }, () => {
          if (needGenerateAcrylic) {
            this.generateAcrylicTextures();
          }
        });
      }
    }
  }

  componentDidUpdate() {
    this.updateBaseCSS();
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScrollReveal);
  }

  saveTheme = (newTheme?: ReactUWP.ThemeType, callback = themeCallback) => {
    localStorage.setItem(customLocalStorageName, JSON.stringify({
      themeName: newTheme.themeName,
      accent: newTheme.accent,
      useFluentDesign: newTheme.useFluentDesign,
      desktopBackgroundImage: newTheme.desktopBackgroundImage
    }));

    const { currTheme } = this.state;

    let needGenerateAcrylic = newTheme.useFluentDesign && newTheme.desktopBackgroundImage && this.props.needGenerateAcrylic;
    if (needGenerateAcrylic && newTheme.desktopBackgroundImage === currTheme.desktopBackgroundImage) {
      needGenerateAcrylic = false;
      Object.assign(newTheme, {
        acrylicTexture40: currTheme.acrylicTexture40,
        acrylicTexture60: currTheme.acrylicTexture60,
        acrylicTexture80: currTheme.acrylicTexture80
      } as ReactUWP.ThemeType);
    }

    this.setState({
      currTheme: newTheme
    }, () => {
      callback(newTheme);
      if (needGenerateAcrylic) {
        this.generateAcrylicTextures();
      }
    });
  }

  updateTheme = (newTheme?: ReactUWP.ThemeType, callback = themeCallback) => {
    const { currTheme } = this.state;

    let needGenerateAcrylic = newTheme.useFluentDesign && newTheme.desktopBackgroundImage && this.props.needGenerateAcrylic;

    if (needGenerateAcrylic && newTheme.desktopBackgroundImage === currTheme.desktopBackgroundImage) {
      needGenerateAcrylic = false;
      Object.assign(newTheme, {
        acrylicTexture40: currTheme.acrylicTexture40,
        acrylicTexture60: currTheme.acrylicTexture60,
        acrylicTexture80: currTheme.acrylicTexture80
      } as ReactUWP.ThemeType);
    }

    this.setState({
      currTheme: newTheme
    }, () => {
      callback(newTheme);
      if (needGenerateAcrylic) {
        this.generateAcrylicTextures();
      }
    });
  }

  updateBaseCSS = (init = false) => {
    const styleSheetClassName = `.${this.themeClassName}-style-sheet`;
    let styleSheet = document.querySelector(styleSheetClassName);
    const CSSString = getBaseCSS(this.state.currTheme, this.themeClassName);
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

  generateAcrylicTextures = (generateCallBack?: (theme?: ReactUWP.ThemeType) => void) => {
    const { currTheme } = this.state;
    const { onGeneratedAcrylic } = this.props;
    this.acrylicTextureCount = 0;
    const baseConfig = {
      blurSize: 24,
      noiseSize: 1,
      noiseOpacity: 0.2
    };
    let backgrounds: string[] = [];

    const callback = (image: string, key: number) => {
      if (key === 4) {
        this.acrylicTextureCount += 1;
        currTheme.acrylicTexture40 = {
          tintColor: currTheme.chromeMediumLow,
          tintOpacity: 0.4,
          background: `url(${image}) no-repeat fixed top left / cover`,
          ...baseConfig
        };
      }
      if (key === 6) {
        this.acrylicTextureCount += 1;
        currTheme.acrylicTexture60 = {
          tintColor: currTheme.chromeLow,
          tintOpacity: 0.6,
          background: `url(${image}) no-repeat fixed top left / cover`,
          ...baseConfig
        };
      }
      if (key === 8) {
        this.acrylicTextureCount += 1;
        currTheme.acrylicTexture80 = {
          tintColor: currTheme.chromeLow,
          tintOpacity: 0.8,
          background: `url(${image}) no-repeat fixed top left / cover`,
          ...baseConfig
        };
      }

      if (this.acrylicTextureCount === 3) {
        if (onGeneratedAcrylic) {
          onGeneratedAcrylic(currTheme);
        } else {
          this.setState({ currTheme });
        }
      }
    };

    generateAcrylicTexture(
      currTheme.desktopBackgroundImage,
      currTheme.chromeMediumLow,
      0.4,
      void 0,
      void 0,
      void 0,
      image => callback(image, 4)
    );
    generateAcrylicTexture(
      currTheme.desktopBackgroundImage,
      currTheme.chromeLow,
      0.6,
      void 0,
      void 0,
      void 0,
      image => callback(image, 6)
    );
    generateAcrylicTexture(
      currTheme.desktopBackgroundImage,
      currTheme.chromeLow,
      0.8,
      void 0,
      void 0,
      void 0,
      image => callback(image, 8)
    );
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

  cleanLocalStorage = () => {
    localStorage.setItem(customLocalStorageName, "");
  }

  render() {
    const {
      autoSaveTheme,
      theme,
      onGeneratedAcrylic,
      children,
      style,
      className,
      needGenerateAcrylic,
      ...attributes
    } = this.props;
    const { currTheme } = this.state;

    this.themeClassName = `${baseClassName}-${currTheme.themeName}`;
    Object.assign(currTheme, {
      desktopBackground: `url(${currTheme.desktopBackgroundImage}) no-repeat fixed top left / cover`,
      updateTheme: this.updateTheme,
      saveTheme: this.saveTheme
    } as ReactUWP.ThemeType);

    return (
      <div
        {...attributes}
        className={className ? `${this.themeClassName} ${className}` : this.themeClassName}
        style={darkTheme.prepareStyles({
          fontSize: 14,
          fontFamily: currTheme.fonts.sansSerifFonts,
          color: currTheme.baseHigh,
          display: "inline-block",
          verticalAlign: "middle",
          background: currTheme.useFluentDesign ? (
            this.acrylicTextureCount === 3 ? "none" : (needGenerateAcrylic ? currTheme.altMediumHigh : "none")
          ) : currTheme.altHigh,
          width: "100%",
          height: "100%",
          ...style
        })}
      >
        {currTheme.useFluentDesign && currTheme.desktopBackgroundImage && (
          <RenderToBody
            style={{
              position: "fixed",
              zIndex: -1,
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: currTheme.desktopBackground,
              pointerEvents: "none"
            }}
          />
        )}
        {children}
      </div>
    );
  }
}

export default Theme;
