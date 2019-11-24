import * as React from "react";
import * as PropTypes from "prop-types";

import { handleScrollReveal } from "./handleScrollReveal";
import darkTheme from "../styles/darkTheme";
import getTheme, { Theme as ThemeType } from "../styles/getTheme";
import RenderToBody from "../RenderToBody";
import ToastWrapper from "../Toast/ToastWrapper";
import { getThemeBaseCSS, getGlobalBaseCSS } from "../styles/getBaseCSSText";

export { getTheme };
export interface DataProps {
  /**
   * Set theme object. [ThemeType](https://github.com/myxvisual/react-uwp/blob/master/src/index.d.ts#L43), Usually use [getTheme](https://github.com/myxvisual/react-uwp/blob/master/src/styles/getTheme.ts#L28) function to get it.
   */
  theme?: ThemeType;
  /**
   * toogle desktopBackground show.
   */
  desktopBackgroundConfig?: {
    enableRender?: boolean;
    renderToScreen?: boolean;
  };
  /**
   * set theme will update callback.
   */
  themeWillUpdate?: (theme?: ThemeType) => void;
}

export interface ThemeProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export interface ThemeState {
  currTheme?: ThemeType;
}

const desktopBgDefaultConfig = {
  enableRender: true,
  renderToScreen: true
}
const themeCallback: (theme?: ThemeType) => void = () => {};

export class Theme extends React.Component<ThemeProps, ThemeState> {
  static defaultProps: ThemeProps = {
    desktopBackgroundConfig: desktopBgDefaultConfig,
    themeWillUpdate: themeCallback
  };
  static childContextTypes = {
    theme: PropTypes.object
  };
  cacheDarkAcrylicTextures: ThemeType;
  cacheLightAcrylicTextures: ThemeType;
  toastWrapper: ToastWrapper;
  styleEl: HTMLStyleElement;

  getThemeFromProps(props: ThemeProps) {
    const { theme } = props;
    let currTheme = theme || darkTheme;
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
    this.setThemeHelper(this.state.currTheme);
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
    if (currTheme !== this.state.currTheme) {
      this.setThemeHelper(currTheme);
      this.setState({ currTheme });
    }
  }

  updateAllCSSToEl() {
    // const now = performance.now();
    if (this.styleEl) {
      this.state.currTheme.styleManager.inserAllRule2el(this.styleEl);
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
  }

  setThemeHelper(theme: ThemeType) {
    theme.styleManager.addCSSText(getGlobalBaseCSS());
    theme.styleManager.addCSSText(getThemeBaseCSS(theme));
    this.setStyleManagerUpdate(theme);
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

    if (theme.useFluentDesign && theme.desktopBackground) {
      theme.generateAcrylicTextures(currTheme => this.setState({ currTheme }));
    }
  }

  updateTheme = (currTheme: ThemeType) => {
    this.state.currTheme.styleManager.allRules.forEach((inserted, rule) => {
      currTheme.styleManager.allRules.set(rule, inserted);
    });
    this.setThemeHelper(currTheme);
    this.setState({ currTheme });
  }

  handleScrollReveal = (e?: Event) => {
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
      ...attributes
    } = this.props;
    const { currTheme } = this.state;
    desktopBackgroundConfig = desktopBackgroundConfig || desktopBgDefaultConfig;
    const { enableRender, renderToScreen } = desktopBackgroundConfig

    const styles = getStyles(this);
    const classes = currTheme.prepareStyles({
      className: "theme",
      styles
    });

    return (
      <div {...attributes} {...classes.root}>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/react-uwp/1.1.0/css/segoe-mdl2-assets.css" />
        <style type="text/css" scoped ref={styleEl => this.styleEl = styleEl} />
        {enableRender && (
           renderToScreen ? <RenderToBody {...classes.desktopBackground} /> : <div {...classes.desktopBackground} />
        )}
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
  let { style, desktopBackgroundConfig } = context.props;
  desktopBackgroundConfig = desktopBackgroundConfig || desktopBgDefaultConfig;
  const { enableRender, renderToScreen } = desktopBackgroundConfig
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
