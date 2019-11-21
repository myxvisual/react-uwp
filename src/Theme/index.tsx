import * as React from "react";
import * as PropTypes from "prop-types";

import { handleScrollReveal } from "./handleScrollReveal";
import darkTheme from "../styles/darkTheme";
import getTheme, { Theme as ThemeType, ThemeConfig } from "../styles/getTheme";
import RenderToBody from "../RenderToBody";
import ToastWrapper from "../Toast/ToastWrapper";
import { StyleManagerSheet } from "./StyleManagerSheet";
import getBaseCSSText from "./getBaseCSSText";

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
  cacheDarkAcrylicTextures: ThemeType;
  cacheLightAcrylicTextures: ThemeType;
  styleManagerSheet: StyleManagerSheet;
  toastWrapper: ToastWrapper;

  getDefaultTheme() {
    const { theme } = this.props;
    return theme ? getTheme(theme) : darkTheme;
  }

  handleThemeUpdate: (theme: ThemeType) => void = (theme: ThemeType) => {
    this.props.themeWillUpdate(theme);
  }

  state: ThemeState = {
    currTheme: this.getDefaultTheme()
  };

  getChildContext() {
    return { theme: this.state.currTheme };
  }

  componentDidMount() {
    window.addEventListener("scroll", this.handleScrollReveal);
  }

  componentWillUnmount() {
    const {
      currTheme: {
        acrylicTexture40,
        acrylicTexture60,
        acrylicTexture80,
        styleManager
      }
    } = this.state;
    URL.revokeObjectURL(acrylicTexture40.background);
    URL.revokeObjectURL(acrylicTexture60.background);
    URL.revokeObjectURL(acrylicTexture80.background);
    styleManager.cleanStyleSheet();

    window.removeEventListener("scroll", this.handleScrollReveal);
  }

  componentWillReceiveProps(nextProps: ThemeProps) {
    const { theme } = nextProps;
    this.setState(() => ({ currTheme: theme }));
  }

  setThemeHelper(theme: ThemeType) {
    const { scrollBarStyleSelector } = this.props;
    const { styleManager } = theme;
    styleManager.addCSSText(getBaseCSSText(theme, scrollBarStyleSelector));
    styleManager.onSheetsUpdate = (() => {
      if (this.styleManagerSheet) {
        this.styleManagerSheet.setState(() => ({ CSSText: styleManager.getAllCSSText() }));
      }
    });

    Object.assign(theme, {
      onThemeUpdate: currTheme => {
        this.setState({ currTheme });
      },
      onToastsUpdate: (toasts) => {
        const { toastWrapper } = this;
        if (toastWrapper) {
          toastWrapper.setState(() => ({
            toastEls: toasts.map(toast => toast.virtualRender())
          }));
        }
      }
    } as ThemeType);

    if (theme.useFluentDesign && theme.desktopBackgroundImage && theme.acrylicTextureCount !== 3) {
      theme.generateAcrylicTextures(currTheme => {
        this.setState({ currTheme });
        this.handleThemeUpdate(currTheme);
      });
    }
    this.handleThemeUpdate(theme);
  }

  updateTheme(currTheme: ThemeType) {
    this.setState(() => ({ currTheme }));
  }

  // sureNeedGenerateAcrylic(newTheme: ThemeType) {
  //   const { currTheme } = this.state;
  //   let needGenerateAcrylic = newTheme.desktopBackgroundImage && this.props.needGenerateAcrylic;

  //   if (needGenerateAcrylic &&
  //     newTheme.desktopBackgroundImage === currTheme.desktopBackgroundImage
  //   ) {
  //     if (currTheme.useFluentDesign) {
  //       Object.assign(currTheme.isDarkTheme ? this.cacheDarkAcrylicTextures : this.cacheLightAcrylicTextures, {
  //         acrylicTexture40: currTheme.acrylicTexture40,
  //         acrylicTexture60: currTheme.acrylicTexture60,
  //         acrylicTexture80: currTheme.acrylicTexture80
  //       } as ThemeType);
  //       needGenerateAcrylic = false;
  //     }
  //     if (newTheme.useFluentDesign) {
  //       if (newTheme.isDarkTheme && this.cacheDarkAcrylicTextures.acrylicTexture40 || (
  //         !newTheme.isDarkTheme && this.cacheLightAcrylicTextures.acrylicTexture40
  //       )) {
  //         Object.assign(newTheme, newTheme.isDarkTheme ? this.cacheDarkAcrylicTextures : this.cacheLightAcrylicTextures);
  //         needGenerateAcrylic = false;
  //       } else {
  //         needGenerateAcrylic = true;
  //       }
  //     } else {
  //       needGenerateAcrylic = false;
  //       Object.assign(newTheme, {
  //         acrylicTexture40: currTheme.acrylicTexture40,
  //         acrylicTexture60: currTheme.acrylicTexture60,
  //         acrylicTexture80: currTheme.acrylicTexture80
  //       } as ThemeType);
  //     }
  //   }
  //   needGenerateAcrylic = needGenerateAcrylic && newTheme.useFluentDesign && this.props.needGenerateAcrylic;

  //   return needGenerateAcrylic;
  // }

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
    this.setThemeHelper(currTheme);

    const styles = getStyles(this);
    const classes = currTheme.prepareStyles({
      className: "theme",
      styles
    });

    return (
      <div {...attributes} {...classes.root}>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/react-uwp/1.1.0/css/segoe-mdl2-assets.css" />
        <StyleManagerSheet
          CSSText={currTheme.styleManager.getAllCSSText()}
          ref={styleManagerSheet => this.styleManagerSheet = styleManagerSheet}
        />
        <RenderToBody {...classes.desktopBackground} />
        <RenderToBody>
          <ToastWrapper
            toastEls={Array.from(currTheme.toasts.keys()).map(toast => toast.virtualRender())}
            ref={toastWrapper => this.toastWrapper = toastWrapper}
          />
        </RenderToBody>
        {children}
      </div>
    );
  }
}

function getStyles(context: Theme) {
  const { currTheme } = context.state;
  const { style, needGenerateAcrylic } = context.props;
  return {
    root: {
      fontSize: 14,
      fontFamily: currTheme.fonts.sansSerifFonts,
      color: currTheme.baseHigh,
      display: "inline-block",
      verticalAlign: "middle",
      background: currTheme.useFluentDesign ? (
        currTheme.acrylicTextureCount === 3 ? "none" : (needGenerateAcrylic ? currTheme.altMediumHigh : "none")
      ) : currTheme.altHigh,
      width: "100%",
      height: "100%",
      ...style
    } as React.CSSProperties,
    desktopBackground: {
      position: "fixed",
      zIndex: -1,
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: (currTheme.useFluentDesign && currTheme.desktopBackgroundImage) ? currTheme.desktopBackground : currTheme.altHigh,
      pointerEvents: "none"
    } as React.CSSProperties
  };
}


export default Theme;
