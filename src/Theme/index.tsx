import * as React from "react";
import * as PropTypes from "prop-types";

import { handleScrollReveal } from "./handleScrollReveal";
import darkTheme from "../styles/darkTheme";
import getTheme, { Theme as ThemeType } from "../styles/getTheme";
import RenderToBody from "../RenderToBody";
import ToastWrapper from "../Toast/ToastWrapper";
import { getThemeBaseCSS, getBaseCSS } from "../styles/getBaseCSSText";
import { isSupportBackdropFilter } from "../styles/getAcrylicTextureStyle";
import GlobalRevealStore from "../RevealEffect/GlobalRevealStore";
import { Throttle } from "../utils/Throttle";

const supportedBackdropFilter = isSupportBackdropFilter();
export { getTheme };

export interface DataProps {
  /**
   * Set theme object. [ThemeType](https://github.com/myxvisual/react-uwp/blob/master/src/index.d.ts#L43), Usually use [getTheme](https://github.com/myxvisual/react-uwp/blob/master/src/styles/getTheme.ts#L28) function to get it.
   */
  theme?: ThemeType;
  /**
   * toggle desktopBackground show.
   */
  desktopBackgroundConfig?: {
    enableRender?: boolean;
    renderToScreen?: boolean;
  };
  /**
   * set theme will update callback.
   */
  themeWillUpdate?: (theme?: ThemeType) => void;
  /**
   * use canvas generate AcrylicTextures to replace CSS backdropFilter style.
   */
  forceGenerateAcrylicTextures?: boolean;

  /**
   * Use the Cloudflare Content Delivery Network.
   * Disable if you are going to provide your own copy.
   * @default true
   */
  enableCDN?: boolean;

  /**
   * Set noise texture style.
   */
  enableNoiseTexture?: boolean;
  enableGlobalThemeCSSText?: boolean;
}

export interface ThemeProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export interface ThemeState {
  currTheme?: ThemeType;
}

const desktopBgDefaultConfig = {
  enableRender: true,
  renderToScreen: true
};
const themeCallback: (theme?: ThemeType) => void = () => {};

export class Theme extends React.Component<ThemeProps, ThemeState> {
  static defaultProps: ThemeProps = {
    desktopBackgroundConfig: desktopBgDefaultConfig,
    themeWillUpdate: themeCallback,
    forceGenerateAcrylicTextures: true,
    enableCDN: true,
    enableNoiseTexture: false,
    enableGlobalThemeCSSText: true
  };
  static childContextTypes = {
    theme: PropTypes.object
  };
  cacheDarkAcrylicTextures: ThemeType;
  cacheLightAcrylicTextures: ThemeType;
  toastWrapper: ToastWrapper;
  styleEl: HTMLStyleElement;
  useUpdateTheme: boolean = false;

  getThemeFromProps(props: ThemeProps) {
    const { theme } = props;
    let currTheme = theme || darkTheme;
    // this.mergeStyleManager(currTheme);
    return currTheme;
  }

  handleThemeUpdate: (theme: ThemeType) => void = (theme: ThemeType) => {
    this.props.themeWillUpdate(theme);
  }

  state: ThemeState = {
    currTheme: this.getThemeFromProps(this.props)
  };

  getChildContext() {
    return { theme: this.state.currTheme };
  }

  componentDidMount() {
    this.setThemeHelper(this.state.currTheme, null, newTheme => {
      this.setState({ currTheme: newTheme });
    });
    this.updateAllCSSToEl();
    window.addEventListener("scroll", this.handleScrollReveal);
  }

  componentDidUpdate() {
    this.updateAllCSSToEl();
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScrollReveal);

    const {
      acrylicTexture40,
      acrylicTexture60,
      acrylicTexture80
  } = this.state.currTheme;
    // URL.revokeObjectURL(acrylicTexture40.background);
    // URL.revokeObjectURL(acrylicTexture60.background);
    // URL.revokeObjectURL(acrylicTexture80.background);
  }

  componentWillReceiveProps(nextProps: ThemeProps) {
    const currTheme = this.getThemeFromProps(nextProps);
    const prevTheme = this.state.currTheme;
    if (currTheme !== prevTheme && !this.useUpdateTheme) {
      this.setThemeHelper(currTheme, prevTheme, newTheme => {
        this.mergeStyleManager(newTheme, prevTheme);
        this.setState({ currTheme: newTheme });
      });
    }
  }

  updateAllCSSToEl() {
    // const now = performance.now();
    if (this.styleEl) {
      this.state.currTheme.styleManager.insertAllRule2el(this.styleEl);
    }
    // console.log(performance.now() - now);
  }

  setStyleManagerUpdate(theme: ThemeType) {
    theme.styleManager.onAddRules = (rules => {
      rules.forEach((inserted, rule) => {
        if (!inserted) {
          theme.styleManager.insertRule2el(this.styleEl, rule);
          rules.set(rule, true);
        }
      });
    });
    theme.styleManager.onRemoveRules = (rules => {
      rules.forEach((inserted, rule) => {
        if (inserted) {
          theme.styleManager.deleteRule2el(this.styleEl, rule);
          rules.set(rule, false);
        }
      });
    });
  }

  mergeStyleManager(newTheme: ThemeType, prevTheme?: ThemeType) {
    if (prevTheme) {
      this.removeCSSText4theme(prevTheme);
      prevTheme.styleManager.allRules.forEach((inserted, rule) => {
        newTheme.styleManager.allRules.set(rule, inserted);
      });
    }
    this.setStyleManagerUpdate(newTheme);
    this.addCSSText2theme(newTheme);
  }

  removeCSSText4theme(theme: ThemeType) {
    const { enableGlobalThemeCSSText } = this.props;
    const selector = theme ? `.${theme.themeClassName}` : "";
    const themeBaseCSSText = getThemeBaseCSS(theme, enableGlobalThemeCSSText ? "" : selector);
    theme.styleManager.removeCSSText(themeBaseCSSText);
  }

  addCSSText2theme(theme: ThemeType) {
    const { enableGlobalThemeCSSText } = this.props;
    const selector = theme ? `.${theme.themeClassName}` : "";
    theme.styleManager.addCSSText(getBaseCSS());
    theme.styleManager.addCSSText(getThemeBaseCSS(theme, enableGlobalThemeCSSText ? "" : selector));
  }

  setThemeHelper(theme: ThemeType, prevTheme?: ThemeType, themeCallback?: (currTheme?: ThemeType) => void) {
    const { enableNoiseTexture, forceGenerateAcrylicTextures } = this.props;
    this.mergeStyleManager(theme, prevTheme);

    Object.assign(theme, {
      updateTheme: this.updateTheme,
      onToastsUpdate: (toasts) => {
        const { toastWrapper } = this;
        if (toastWrapper) {
          toastWrapper.setState(() => ({
            toastEls: toasts.map(toast => toast.virtualRender())
          }));
        }
      }
    } as ThemeType);

    if (theme.useFluentDesign) {
      if (theme.desktopBackground && (!supportedBackdropFilter || forceGenerateAcrylicTextures)) {
        if (enableNoiseTexture) {
          theme.generateBackgroundTexture(currTheme => {
            currTheme.generateAcrylicTextures(themeCallback);
          });
        } else {
          theme.generateAcrylicTextures(themeCallback);
        }
      } else if (enableNoiseTexture) {
        theme.generateBackgroundTexture(themeCallback);
      }
    } else if (enableNoiseTexture) {
      theme.generateBackgroundTexture(themeCallback);
    }
  }

  updateTheme = (currTheme: ThemeType) => {
    this.useUpdateTheme = true;
    const prevTheme = this.state.currTheme;
    this.setThemeHelper(currTheme, prevTheme, newTheme => {
      this.mergeStyleManager(newTheme, prevTheme);
      this.setState({ currTheme: newTheme });
    });
  }

  scrollThrottle = new Throttle();
  handleScrollReveal = (e?: Event) => {
    if (!this.scrollThrottle.shouldFunctionRun()) return;
    e.stopPropagation();
    e.preventDefault();
    handleScrollReveal(this.state.currTheme);
  }

  render() {
    let {
      theme,
      desktopBackgroundConfig,
      children,
      style,
      className,
      themeWillUpdate,
      forceGenerateAcrylicTextures,
      enableNoiseTexture,
      enableGlobalThemeCSSText,
      enableCDN,
      ...attributes
    } = this.props;
    const { currTheme } = this.state;
    desktopBackgroundConfig = desktopBackgroundConfig || desktopBgDefaultConfig;
    const { enableRender, renderToScreen } = desktopBackgroundConfig;

    const styles = getStyles(this);
    const classes = currTheme.prepareStyles({
      className: "theme",
      styles
    });

    return (
      <div
        {...attributes}
        style={classes.root.style}
        className={currTheme.classNames(className, classes.root.className, currTheme.themeClassName)}
        >
        {enableCDN && (
          <link key="not-change" rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/react-uwp/1.1.0/css/segoe-mdl2-assets.css" />
        )}
        <style type="text/css" ref={styleEl => this.styleEl = styleEl} />
        {enableRender && (
          renderToScreen ? <RenderToBody {...classes.desktopBackground} /> : <div {...classes.desktopBackground} />
        )}
        {currTheme.toasts.size > 0 && <RenderToBody>
          <ToastWrapper
            toastEls={Array.from(currTheme.toasts.keys()).map(toast => toast.virtualRender())}
            ref={toastWrapper => this.toastWrapper = toastWrapper}
          />
        </RenderToBody>}
        {children}
        <GlobalRevealStore theme={currTheme} />
      </div>
    );
  }
}

function getStyles(context: Theme) {
  const { currTheme } = context.state;
  let { style, desktopBackgroundConfig } = context.props;
  desktopBackgroundConfig = desktopBackgroundConfig || desktopBgDefaultConfig;
  const { enableRender, renderToScreen } = desktopBackgroundConfig;
  const isInsideBg = enableRender && !renderToScreen;

  return {
    root: {
      position: "relative",
      overflow: isInsideBg ? "hidden" : void 0,
      fontSize: 14,
      fontFamily: currTheme.fonts.sansSerifFonts,
      color: currTheme.baseHigh,
      display: "inline-block",
      verticalAlign: "middle",
      background: currTheme.useFluentDesign ? "tranparent" : currTheme.altHigh,
      width: "100%",
      height: "100%",
      ...style
    } as React.CSSProperties,
    desktopBackground: {
      position: isInsideBg ? "absolute" : "fixed",
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
