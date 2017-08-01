import * as React from "react";
import { findDOMNode } from "react-dom";
import * as PropTypes from "prop-types";

export interface DataProps {
  /**
   * The FlyoutContent `verticalPosition`.
   */
  verticalPosition?: "top" | "bottom" | "center";
  /**
   * The FlyoutContent `horizontalPosition`.
   */
  horizontalPosition?: "left" | "right" | "center";
  /**
   * The default show FlyoutContent.
   */
  show?: boolean;
  /**
   * FlyoutContent margin `rootElm` position.
   */
  margin?: number;
  /**
   * Default is `false`, is `true` the Flyout component only show in `props.show === true`.
   */
  isControlled?: boolean;
  /**
   * After showed the flyout, auto hidden Flyout.
   */
  autoClose?: boolean;
  /**
   * Set `autoClose` timeout.
   */
  autoCloseTimeout?: number;
  /**
   * In `props.isControlled === false`, this will control `FlyoutContent` fade in timer.
   */
  enterDelay?: number;
}
export interface FlyoutContentProps extends DataProps, React.HTMLAttributes<HTMLSpanElement> {}
export interface FlyoutContentState {
  showFlyoutContent?: boolean;
}

const emptyFunc = () => {};
class FlyoutContent extends React.Component<FlyoutContentProps, FlyoutContentState> {
  static defaultProps: FlyoutContentProps = {
    verticalPosition: "top",
    horizontalPosition: "center",
    margin: 4,
    isControlled: false,
    enterDelay: 0,
    onMouseLeave: emptyFunc,
    onMouseEnter: emptyFunc,
    autoClose: false,
    autoCloseTimeout: 1250
  };

  state: FlyoutContentState = {
    showFlyoutContent: this.props.show
  };
  rootElm: HTMLDivElement;
  autoHideTimer: any = null;
  hideTimer: any = null;

  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  componentWillReceiveProps(nextProps: FlyoutContentProps) {
    if (this.state.showFlyoutContent !== nextProps.show) {
      this.setState({ showFlyoutContent: nextProps.show });
    }
  }

  componentDidMount() {
    Object.assign(this.rootElm.style, this.getDynamicStyle("px"));
    if (!this.props.isControlled) {
      this.rootElm.parentElement.addEventListener("mouseenter", this.showFlyoutContent);
      this.rootElm.parentElement.addEventListener("mouseleave", this.hideFlyoutContent);
    }
  }

  componentWillUnmount() {
    clearTimeout(this.autoHideTimer);
    if (!this.props.isControlled) {
      this.rootElm.parentElement.removeEventListener("mouseenter", this.showFlyoutContent);
      this.rootElm.parentElement.removeEventListener("mouseleave", this.hideFlyoutContent);
    }
  }

  showFlyoutContent = () => {
    clearTimeout(this.autoHideTimer);
    clearTimeout(this.hideTimer);
    this.toggleShowFlyoutContent(true);
    let now = Date.now();
    if (this.props.autoClose) {
      this.autoHideTimer = setTimeout(() => {
        this.hideFlyoutContent();
      }, this.props.autoCloseTimeout);
    }
  }

  hideFlyoutContent = () => {
    this.hideTimer = setTimeout(() => {
      this.toggleShowFlyoutContent(false);
    }, 250);
  }

  toggleShowFlyoutContent = (showFlyoutContent?: boolean) => {
    if (typeof showFlyoutContent === "boolean") {
      if (showFlyoutContent !== this.state.showFlyoutContent) {
        this.setState({ showFlyoutContent });
      }
    } else {
      this.setState({
        showFlyoutContent: !this.state.showFlyoutContent
      });
    }
  }

  getStaticStyle = (showFlyoutContent = this.state.showFlyoutContent): React.CSSProperties => {
    const { context: { theme }, props: { style } } = this;
    const enterDelay = showFlyoutContent ? this.props.enterDelay : 0;
    return theme.prefixStyle({
      width: 280,

      boxSizing: "content-box",
      padding: 8,
      border: `1px solid ${theme.baseLow}`,
      color: theme.baseMediumHigh,
      background: theme.chromeLow,
      pointerEvents: showFlyoutContent ? "all" : "none",
      opacity: showFlyoutContent ? 1 : 0,
      transform: `translateY(${showFlyoutContent ? "0px" : "10px"})`,
      position: "absolute",
      zIndex: theme.zIndex.flyout,
      transition: `transform .25s ${ enterDelay}ms ease-in-out, opacity .25s ${enterDelay}ms ease-in-out, border ${enterDelay}ms .25s ease-in-out`,
      ...style
    });
  }


  getDynamicStyle = (unit = "") => {
    const { rootElm } = this;
    if (!rootElm) return;
    let parentElement: any = rootElm.parentElement;
    const { verticalPosition, horizontalPosition, margin } = this.props;
    const { showFlyoutContent } = this.state;
    const { width, height } = parentElement.getBoundingClientRect();
    const containerWidth = rootElm.getBoundingClientRect().width;
    const containerHeight = rootElm.getBoundingClientRect().height;
    const positionStyle: React.CSSProperties = {};
    if (width !== void(0) && height !== void(0)) {
      switch (horizontalPosition) {
        case "left": {
          positionStyle.right = unit ? `0${unit}` : 0;
          break;
        }
        case "center": {
          const left = (width - containerWidth) / 2;
          positionStyle.left = unit ? `${left}${unit}` : left;
          break;
        }
        case "right": {
          positionStyle.left = unit ? `0${unit}` : 0;
          break;
        }
        default: {
          break;
        }
      }
      switch (verticalPosition) {
        case "top": {
          const top = -containerHeight - margin;
          positionStyle.top = unit ? `${top}${unit}` : top;
          break;
        }
        case "center": {
          const top = (height - containerHeight) / 2;
          positionStyle.top = unit ? `${top}${unit}` : top;
          break;
        }
        case "bottom": {
          const top = height + margin;
          positionStyle.top = unit ? `${top}${unit}` : top;
          break;
        }
        default: {
          break;
        }
      }
    }
    return positionStyle;
  }

  handelMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    clearTimeout(this.autoHideTimer);
    clearTimeout(this.hideTimer);
    e.currentTarget.style.border = `1px solid ${this.context.theme.listAccentLow}`;
    if (!this.props.isControlled) this.showFlyoutContent();
    this.props.onMouseEnter(e);
  }

  handelMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.border = `1px solid ${this.context.theme.baseLow}`;
    this.hideFlyoutContent();
    this.props.onMouseLeave(e);
  }

  render() {
    const {
      verticalPosition,
      enterDelay,
      isControlled,
      margin,
      horizontalPosition,
      show,
      autoClose,
      autoCloseTimeout,
      children,
      ...attributes
    } = this.props;
    const { theme } = this.context;

    const staticStyle = this.getStaticStyle();
    const stylesClasses = theme.prepareStyle({
      className: "flyout-content",
      style: staticStyle
    });
    const dynamicStyle = this.getDynamicStyle();

    return (
      <div
        {...attributes}
        onMouseEnter={this.handelMouseEnter}
        onMouseLeave={this.handelMouseLeave}
        ref={rootElm => this.rootElm = rootElm}
        style={dynamicStyle ? { ...stylesClasses.style, ...dynamicStyle } : stylesClasses.style}
        className={stylesClasses.className}
      >
        {children}
      </div>
    );
  }
}

export default FlyoutContent;
