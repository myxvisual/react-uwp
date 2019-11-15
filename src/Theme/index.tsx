import * as React from "react";
import * as PropTypes from "prop-types";

import { handleScrollReveal } from "./handleScrollReveal";
import StyleManager from "../styles/StyleManager";
import darkTheme from "../styles/darkTheme";
import getTheme, { Theme as ThemeType } from "../styles/getTheme";
import RenderToBody from "../RenderToBody";
import ToastWrapper from "../Toast/ToastWrapper";
import getBaseCSSText from "./getBaseCSSText";
import { setSegoeMDL2AssetsFonts } from "../styles/fonts/segoe-mdl2-assets";
import IS_NODE_ENV from "../utils/nodeJS/IS_NODE_ENV";

export { getTheme };
export interface DataProps {
  /**
   * Set theme object. [ThemeType](https://github.com/myxvisual/react-uwp/blob/master/src/index.d.ts#L43), Usually use [getTheme](https://github.com/myxvisual/react-uwp/blob/master/src/styles/getTheme.ts#L28) function to get it.
   */
  theme?: ThemeType;
  /**
   * set theme will update callback.
   */
  themeWillUpdate?: (theme?: ThemeType) => void;
  /**
   * onGeneratedAcrylic callback, base acrylic textures is base64 url image, for production, you can set this callback, post image to your server, and update theme(use this callback will not auto update theme).
   */
  onGeneratedAcrylic?: (theme?: ThemeType) => void;
  /**
   * for production if you have generated acrylic textures, you can disabled generation acrylic textures.
   */
  needGenerateAcrylic?: boolean;
  /**
   * default is "*", set all element scroll bar style to uwp style.
   */
  scrollBarStyleSelector?: string;
}

export interface ThemeProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export interface ThemeState {
  currTheme?: ThemeType;
}

const baseClassName = "react-uwp-theme";
const themeCallback: (theme?: ThemeType) => void = () => {};

export class Theme extends React.Component<ThemeProps, ThemeState> {
  static defaultProps: ThemeProps = {
    needGenerateAcrylic: true,
    onGeneratedAcrylic: themeCallback,
    themeWillUpdate: themeCallback,
    scrollBarStyleSelector: "*"
  };
  static childContextTypes = {
    theme: PropTypes.object
  };
  acrylicTextureCount = 0;
  themeClassName = "react-uwp-theme-dark";
  cacheDarkAcrylicTextures: ThemeType;
  cacheLightAcrylicTextures: ThemeType;
  toastWrapper: ToastWrapper;
  prevStyleManager: ReactUWP.StyleManager = null;
  backgroundEl: RenderToBody;

  getDefaultTheme: () => ThemeType = () => {
    let { theme } = this.props;
    theme = theme || darkTheme;

    return theme;
  }

  state: ThemeState = {
    currTheme: this.getDefaultTheme()
  };

  bindNewThemeMethods: (theme: ThemeType) => void = (theme: ThemeType) => {
    const { scrollBarStyleSelector } = this.props;
    const styleManager: ReactUWP.StyleManager =  new StyleManager({ theme });
    styleManager.addCSSTextWithUpdate(getBaseCSSText(theme, "uwp-base", scrollBarStyleSelector));
    Object.assign(theme, {
      desktopBackground: `url(${theme.desktopBackgroundImage}) no-repeat fixed top left / cover`,
      updateTheme: this.updateTheme,
      addToast: this.addToast,
      updateToast: this.updateToast,
      deleteToast: this.deleteToast,
      scrollRevealListener: this.handleScrollReveal,
      forceUpdateTheme: this.forceUpdateTheme,
      styleManager
    });
  }

  handleNewTheme: (theme: ThemeType) => void = (theme: ThemeType) => {
    this.props.themeWillUpdate(theme);
  }

  getChildContext: () => { theme: ThemeType } = () => {
    return { theme: this.state.currTheme };
  }

  componentDidMount() {
    const { currTheme } = this.state;
    if (IS_NODE_ENV) setSegoeMDL2AssetsFonts();

    if (currTheme.useFluentDesign && currTheme.desktopBackgroundImage && this.props.needGenerateAcrylic) {
      this.handleNewTheme(currTheme);
      currTheme.generateAcrylicTextures(currTheme, currTheme => this.setState({ currTheme }));
    }

    window.addEventListener("scroll", this.handleScrollReveal);
  }

  componentWillReceiveProps(nextProps: ThemeProps) {
    const { theme } = nextProps;
    const { currTheme } = this.state;
    const needGenerateAcrylic = this.sureNeedGenerateAcrylic(theme);

    if (nextProps && nextProps.theme) {
      if (
        theme.accent !== currTheme.accent ||
        theme.themeName !== currTheme.themeName ||
        theme.useFluentDesign !== currTheme.useFluentDesign ||
        theme.desktopBackgroundImage !== currTheme.desktopBackgroundImage
      ) {
        this.handleNewTheme(theme);
        this.setState({
          currTheme: theme
        }, () => {
          if (needGenerateAcrylic) {
            this.handleNewTheme(theme);
            theme.generateAcrylicTextures(theme, currTheme => this.setState({ currTheme }));
          }
        });
      }
    }
  }

  componentWillUpdate(nextProps: ThemeProps, nextState: ThemeState) {
    this.prevStyleManager = this.state.currTheme.styleManager;
  }

  componentDidUpdate() {
    this.prevStyleManager.cleanStyleSheet();
    this.prevStyleManager = null;
  }

  componentWillUnmount() {
    const {
      currTheme: {
        acrylicTexture40,
        acrylicTexture60,
        acrylicTexture80
      }
    } = this.state;
    URL.revokeObjectURL(acrylicTexture40.background);
    URL.revokeObjectURL(acrylicTexture60.background);
    URL.revokeObjectURL(acrylicTexture80.background);
    this.state.currTheme.styleManager.cleanStyleSheet();
    window.removeEventListener("scroll", this.handleScrollReveal);
  }

  updateTheme: (newTheme?: ThemeType, callback?: (theme?: ThemeType) => void) => void = (newTheme?: ThemeType, callback = themeCallback) => {
    const needGenerateAcrylic = this.sureNeedGenerateAcrylic(newTheme);

    this.handleNewTheme(newTheme);
    this.setState({
      currTheme: newTheme
    }, () => {
      callback(newTheme);
      if (needGenerateAcrylic) {
        this.handleNewTheme(newTheme);
        newTheme.generateAcrylicTextures(newTheme, currTheme => this.setState({ currTheme }));
      }
    });
  }

  forceUpdateTheme: (currTheme: ThemeType) => void = (currTheme: ThemeType) => this.setState({ currTheme });

  sureNeedGenerateAcrylic: (newTheme: ThemeType) => boolean = (newTheme: ThemeType): boolean => {
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
        } as ThemeType);
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
        } as ThemeType);
      }
    }
    needGenerateAcrylic = needGenerateAcrylic && newTheme.useFluentDesign && this.props.needGenerateAcrylic;
    return needGenerateAcrylic;
  }

  findToastNodeTimers: any[] = [];
  toastId = -1;
  addToast(toast: React.ReactElement<any>, callback?: (toastId?: number) => void, increaseId = true, currToastId?: number) {
    let toastId = currToastId !== void 0 ? currToastId : this.toastId;
    if (increaseId) {
      toastId += 1;
      this.toastId = toastId;
    }

    if (this.toastWrapper) {
      clearTimeout(this.findToastNodeTimers[toastId]);
      this.toastWrapper.addToast(toast);
      if (callback) callback(toastId);
    } else {
      this.findToastNodeTimers[toastId] = setTimeout(() => {
        this.addToast(toast, callback, false, toastId);
      }, 100);
    }
  }

  updateToast(toastId: number, toast: React.ReactElement<any>) {
    if (this.toastWrapper) this.toastWrapper.updateToast(toastId, toast);
  }

  deleteToast(toastId: number) {
    this.state.currTheme.toasts[toastId] = void 0;
  }

  handleScrollReveal = (e?: Event) => {
    handleScrollReveal(this.state.currTheme);
  }

  render() {
    const {
      theme,
      onGeneratedAcrylic,
      children,
      style,
      className,
      needGenerateAcrylic,
      themeWillUpdate,
      scrollBarStyleSelector,
      ...attributes
    } = this.props;
    const { currTheme } = this.state;

    this.themeClassName = `${baseClassName}-${currTheme.themeName}`;
    this.bindNewThemeMethods(currTheme);

    const rootStyle = darkTheme.prefixStyle({
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
    });
    const backgroundStyle: React.CSSProperties = {
      position: "fixed",
      zIndex: -1,
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: (currTheme.useFluentDesign && currTheme.desktopBackgroundImage) ? currTheme.desktopBackground : currTheme.altHigh,
      pointerEvents: "none"
    };
    currTheme.generateAcrylicTextures["callback"] = (theme) => {
      if (this.backgroundEl) {
        Object.assign(this.backgroundEl.rootElm.style, backgroundStyle, { background: theme.desktopBackground } as React.CSSProperties);
      }
      if (onGeneratedAcrylic) onGeneratedAcrylic();
    };

    return (
      <div
        {...attributes}
        {...currTheme.prepareStyle({
          style: rootStyle,
          className: "theme-root",
          extendsClassName: className ? `${this.themeClassName} ${className}` : this.themeClassName
        })}
      >
        <RenderToBody
          ref={backgroundEl => this.backgroundEl = backgroundEl}
          {...currTheme.prepareStyle({
            style: backgroundStyle,
            className: "fluent-background"
          })}
        />
        <RenderToBody>
          <ToastWrapper ref={toastWrapper => this.toastWrapper = toastWrapper} />
        </RenderToBody>
        {children}
      </div>
    );
  }
}


export default Theme;
