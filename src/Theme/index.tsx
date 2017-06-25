import * as React from "react";
import * as PropTypes from "prop-types";

import darkTheme from "../styles/darkTheme";
import getTheme from "../styles/getTheme";
import RenderToBody from "../RenderToBody";
import ToastWrapper from "../Toast/ToastWrapper";
import getBaseCSS from "./getBaseCSS";
import generateAcrylicTexture from "../styles/generateAcrylicTexture";
import { setSegoeMDL2AssetsFonts } from "../styles/fonts/segoe-mdl2-assets";
import IS_NODE_ENV from "../common/nodeJS/IS_NODE_ENV";

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
  cacheDarkAcrylicTextures: ReactUWP.ThemeType = {};
  cacheLightAcrylicTextures: ReactUWP.ThemeType = {};
  toastWrapper: ToastWrapper;

  getDefaultTheme = () => {
    let { theme, autoSaveTheme } = this.props;

    if (!IS_NODE_ENV && autoSaveTheme) {
      theme = this.getLocalStorageTheme();
    } else {
      theme = theme || darkTheme;
    }

    return theme;
  }

  getLocalStorageTheme = () => {
    let themeConfig: any = {};
    let { theme } = this.props;

    if (theme) {
      Object.assign(themeConfig, {
        themeName: theme.themeName,
        accent: theme.accent,
        useFluentDesign: theme.useFluentDesign,
        desktopBackgroundImage: theme.desktopBackgroundImage
      });
    }

    const storageString = localStorage.getItem(customLocalStorageName);
    if (storageString) {
      let data: any = {};
      try {
        data = JSON.parse(storageString);
        const { themeName, accent, useFluentDesign, desktopBackgroundImage } = data;
        theme = getTheme({
          themeName: themeName === void 0 ? themeConfig.themeName : themeName,
          accent: accent === void 0 ? themeConfig.accent : accent,
          useFluentDesign: useFluentDesign === void 0 ? themeConfig.useFluentDesign : useFluentDesign,
          desktopBackgroundImage: desktopBackgroundImage === void 0 ? themeConfig.desktopBackgroundImage : desktopBackgroundImage
        });
      } catch (error) {
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
    const newWindow = window as ReactUWP.Window;
    if (!newWindow.__REACT_UWP__) newWindow.__REACT_UWP__ = {};
    if (!newWindow.__REACT_UWP__.scrollReveals) {
      newWindow.__REACT_UWP__.scrollReveals = [];
    }

    const { currTheme } = this.state;

    if (IS_NODE_ENV && this.props.autoSaveTheme) {
      this.setState({ currTheme: this.getLocalStorageTheme() });
    }

    if (IS_NODE_ENV) setSegoeMDL2AssetsFonts();

    if (currTheme.useFluentDesign && currTheme.desktopBackgroundImage && this.props.needGenerateAcrylic) {
      this.generateAcrylicTextures();
    }

    this.updateBaseCSS();

    window.addEventListener("scroll", this.handleScrollReveal);
  }

  componentWillReceiveProps(nextProps: ThemeProps) {
    const { theme } = nextProps;
    const { currTheme } = this.state;
    const needGenerateAcrylic = this.sureNeedGenerateAcrylic(theme);

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

    const needGenerateAcrylic = this.sureNeedGenerateAcrylic(newTheme);

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
    const needGenerateAcrylic = this.sureNeedGenerateAcrylic(newTheme);

    this.setState({
      currTheme: newTheme
    }, () => {
      callback(newTheme);
      if (needGenerateAcrylic) {
        this.generateAcrylicTextures();
      }
    });
  }

  sureNeedGenerateAcrylic = (newTheme: ReactUWP.ThemeType): boolean => {
    const { currTheme } = this.state;
    let needGenerateAcrylic = newTheme.desktopBackgroundImage && this.props.needGenerateAcrylic;

    if (needGenerateAcrylic &&
      newTheme.desktopBackgroundImage === currTheme.desktopBackgroundImage
    ) {
      if (currTheme.useFluentDesign) {
        Object.assign(currTheme.isDarkTheme ? this.cacheDarkAcrylicTextures : this.cacheLightAcrylicTextures, {
          acrylicTexture40: currTheme.acrylicTexture40,
          acrylicTexture60: currTheme.acrylicTexture60,
          acrylicTexture80: currTheme.acrylicTexture80
        } as ReactUWP.ThemeType);
        needGenerateAcrylic = false;
      }
      if (newTheme.useFluentDesign) {
        if (newTheme.isDarkTheme && this.cacheDarkAcrylicTextures.acrylicTexture40 || (
          !newTheme.isDarkTheme && this.cacheLightAcrylicTextures.acrylicTexture40
        )) {
          Object.assign(newTheme, newTheme.isDarkTheme ? this.cacheDarkAcrylicTextures : this.cacheLightAcrylicTextures);
          needGenerateAcrylic = false;
        } else {
          needGenerateAcrylic = true;
        }
      } else {
        needGenerateAcrylic = false;
        Object.assign(newTheme, {
          acrylicTexture40: currTheme.acrylicTexture40,
          acrylicTexture60: currTheme.acrylicTexture60,
          acrylicTexture80: currTheme.acrylicTexture80
        } as ReactUWP.ThemeType);
      }
    }
    needGenerateAcrylic = needGenerateAcrylic && newTheme.useFluentDesign;
    return needGenerateAcrylic;
  }

  updateBaseCSS = (init = false) => {
    const newWindow = window as ReactUWP.Window;

    const styleSheetClassName = `.${this.themeClassName}-style-sheet`;
    let styleSheet = document.querySelector(styleSheetClassName);
    const CSSString = getBaseCSS(this.state.currTheme, this.themeClassName);
    if (!newWindow.__REACT_UWP__) newWindow.__REACT_UWP__ = {};
    if (styleSheet || newWindow.__REACT_UWP__.baseCSSRequired) {
      if (styleSheet) {
        styleSheet.innerHTML = CSSString;
      } else return;
    } else {
      styleSheet = document.createElement("style");
      styleSheet.className = styleSheetClassName;
      styleSheet.innerHTML = CSSString;
      document.head.appendChild(styleSheet);
      newWindow.__REACT_UWP__.baseCSSRequired = true;
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

  addToast = (toast: React.ReactNode) => {
    this.toastWrapper.addToast(toast);
  }

  updateToast = (toastID: number, toast: React.ReactNode) => {
    this.toastWrapper.updateToast(toastID, toast);
  }

  deleteToast = (toastID: number) => {
    this.state.currTheme.toasts[toastID] = void 0;
  }

  handleScrollReveal = (e?: Event) => {
    const newWindow = window as ReactUWP.Window;
    if (newWindow.__REACT_UWP__ && newWindow.__REACT_UWP__.scrollReveals) {
      for (const scrollReveal of newWindow.__REACT_UWP__.scrollReveals) {
        const {
          rootElm,
          animated,
          setEnterStyle,
          setLeaveStyle,
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
            setEnterStyle();
            scrollReveal.animated = true;
          }
        } else {
          if (animated) {
            setLeaveStyle();
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
      saveTheme: this.saveTheme,
      addToast: this.addToast,
      updateToast: this.updateToast,
      deleteToast: this.deleteToast
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
        <RenderToBody>
          <ToastWrapper ref={toastWrapper => this.toastWrapper = toastWrapper} />
        </RenderToBody>
        {children}
      </div>
    );
  }
}

export default Theme;
