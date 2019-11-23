import * as React from "react";
import * as PropTypes from "prop-types";

import { handleScrollReveal } from "./handleScrollReveal";
import darkTheme from "../styles/darkTheme";
import getTheme, { Theme as ThemeType } from "../styles/getTheme";
import RenderToBody from "../RenderToBody";
import ToastWrapper from "../Toast/ToastWrapper";

export { getTheme };
export interface DataProps {
  /**
   * Set theme object. [ThemeType](https://github.com/myxvisual/react-uwp/blob/master/src/index.d.ts#L43), Usually use [getTheme](https://github.com/myxvisual/react-uwp/blob/master/src/styles/getTheme.ts#L28) function to get it.
   */
  theme?: ThemeType;
  /**
   * toogle desktopBackground show.
   */
  enableDesktopBackground?: boolean;
  /**
   * set theme will update callback.
   */
  themeWillUpdate?: (theme?: ThemeType) => void;
}

export interface ThemeProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export interface ThemeState {
  currTheme?: ThemeType;
}

const themeCallback: (theme?: ThemeType) => void = () => {};

export class Theme extends React.Component<ThemeProps, ThemeState> {
  static defaultProps: ThemeProps = {
    enableDesktopBackground: true,
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
      this.setState(() => ({ currTheme }), () => {
        this.setThemeHelper(currTheme);
      });
    }
  }

  updateAllCSSToEl() {
    // const now = performance.now();
    if (this.styleEl) {
      this.styleEl.textContent = this.state.currTheme.styleManager.getAllCSSText();
    }
    // console.log(performance.now() - now);
  }

  setThemeHelper(theme: ThemeType) {
    theme.styleManager.onRemoveCSSText = (CSSText => {
      if (this.styleEl && this.styleEl.textContent.includes(CSSText)) {
        this.styleEl.textContent += this.styleEl.style.cssText.replace(CSSText, "");
      }
    });

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
    currTheme.removeBaseCSSText(this.state.currTheme);
    this.setState({ currTheme }, () => {
      this.setThemeHelper(currTheme);
    });
  }

  handleScrollReveal = (e?: Event) => {
    e.stopPropagation();
    e.preventDefault();
    handleScrollReveal(this.state.currTheme);
  }

  render() {
    const {
      theme,
      enableDesktopBackground,
      children,
      style,
      className,
      themeWillUpdate,
      ...attributes
    } = this.props;
    const { currTheme } = this.state;

    const styles = getStyles(this);
    const classes = currTheme.prepareStyles({
      className: "theme",
      styles
    });

    return (
      <div {...attributes} {...classes.root}>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/react-uwp/1.1.0/css/segoe-mdl2-assets.css" />
        <style type="text/css" scoped ref={styleEl => this.styleEl = styleEl} />
        {enableDesktopBackground && <RenderToBody {...classes.desktopBackground} />}
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
  const { style } = context.props;
  return {
    root: {
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
