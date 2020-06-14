import * as React from "react";
import * as PropTypes from "prop-types";
import { Throttle } from "../utils/Throttle";

export interface DataProps {
  /**
   * Set Tooltip content.
   */
  content?: string;
  /**
   * Set ReactNode to replace content.
   */
  contentNode?: React.ReactNode;
  /**
   * Set Tooltip custom vertical position.
   */
  verticalPosition?: "top" | "bottom" | "center";
  /**
   * Set Tooltip custom horizontal position.
   */
  horizontalPosition?: "left" | "right" | "center";
  /**
   * Set Tooltip custom margin from `rootElm` (px).
   */
  margin?: number;
  /**
   * Set Tooltip auto close in showed some time.
   */
  autoClose?: boolean;
  /**
   * Set Tooltip auto close time (ms).
   */
  autoCloseTimeout?: number;
  /**
   * Set close delay by time (ms).
   */
  closeDelay?: number;
  /**
   * Set custom background.
   */
  background?: string;
}
export interface TooltipProps extends DataProps, React.HTMLAttributes<HTMLSpanElement> {}

export class Tooltip extends React.Component<TooltipProps> {
  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  static defaultProps: TooltipProps = {
    verticalPosition: "top",
    horizontalPosition: "center",
    margin: 4,
    autoClose: false,
    autoCloseTimeout: 750,
    closeDelay: 0
  };
  rootElm: HTMLDivElement;
  tooltipElm: HTMLSpanElement;
  showTooltip: boolean = false;

  atuoCloseTimer: any = null;
  showThrottle = new Throttle();
  toggleShow = (e?: React.MouseEvent<HTMLDivElement>) => {
    if (!this.showThrottle.shouldFunctionRun()) return;
    clearTimeout(this.atuoCloseTimer);
    if (this.showTooltip) return;
    this.showTooltip = true;
    const classes = this.getTooltipClasses();
    const { tooltipElm, props: { autoClose, autoCloseTimeout } } = this;
    if (tooltipElm) {
      if (autoClose && autoCloseTimeout) {
        this.atuoCloseTimer = setTimeout(this.toggleHide, autoCloseTimeout);
      }
      Object.assign(tooltipElm, classes);
    }
  }

  hideThrottle = new Throttle();
  closeDelayTimer: any = null;
  toggleHide = (e?: React.MouseEvent<HTMLDivElement>) => {
    if (!this.hideThrottle.shouldFunctionRun()) return;
    clearTimeout(this.closeDelayTimer);
    if (!this.showTooltip) return;
    this.showTooltip = false;
    const classes = this.getTooltipClasses();
    const { tooltipElm, props: { closeDelay } } = this;
    if (tooltipElm) {
      if (closeDelay) {
        this.closeDelayTimer = setTimeout(() => {
          Object.assign(tooltipElm, classes);
        }, closeDelay);
        return;
      }
      Object.assign(tooltipElm, classes);
    }
  }

  getBaseStyle = (showTooltip = false, positionStyle?: React.CSSProperties): React.CSSProperties =>  {
    const { context: { theme }, props: { style, background } } = this;
    return theme.prefixStyle({
      height: 28,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      padding: "4px 8px",
      transition: (!showTooltip && !positionStyle) ? void 0 : "transform .25s 0s ease-in-out, opacity .25s 0s ease-in-out",
      border: `1px solid ${theme.useFluentDesign ? theme.listLow : theme.baseLow}`,
      color: theme.baseMediumHigh,
      background: background || theme.chromeMedium,
      opacity: showTooltip ? 1 : 0,
      transform: `translateY(${showTooltip ? "0px" : "10px"})`,
      position: "absolute",
      fontSize: 14,
      pointerEvents: showTooltip ? "all" : "none",
      zIndex: theme.zIndex.tooltip,
      ...style,
      ...positionStyle
    });
  }

  getTooltipStyle = (): React.CSSProperties => {
    const { rootElm, tooltipElm } = this;
    if (!(rootElm && tooltipElm)) return this.getBaseStyle();

    const { verticalPosition, horizontalPosition, margin } = this.props;
    const { width, height } = rootElm.getBoundingClientRect();
    const containerWidth = tooltipElm.getBoundingClientRect().width;
    const containerHeight = tooltipElm.getBoundingClientRect().height;
    const { showTooltip } = this;
    const positionStyle: React.CSSProperties = {};
    const isVerticalCenter = verticalPosition === "center";

    if (width !== void(0) && height !== void(0)) {
      switch (horizontalPosition) {
        case "left": {
          positionStyle.right = isVerticalCenter ? (width + margin) : 0;
          break;
        }
        case "center": {
          positionStyle.left = (width - containerWidth) / 2;
          break;
        }
        case "right": {
          positionStyle.left = isVerticalCenter ? (-width - margin) : 0;
          break;
        }
        default: {
          break;
        }
      }
      switch (verticalPosition) {
        case "top": {
          positionStyle.top = -containerHeight - margin;
          break;
        }
        case "center": {
          positionStyle.top = (height - containerHeight) / 2;
          break;
        }
        case "bottom": {
          positionStyle.top = height + margin;
          break;
        }
        default: {
          break;
        }
      }
    }

    return this.getBaseStyle(showTooltip, positionStyle);
  }

  getTooltipClasses() {
    const { theme } = this.context;
    const { className } = this.props;
    const tooltipStyle = this.getTooltipStyle();
    const classes = theme.prepareStyle({
      className: "tooltip",
      style: tooltipStyle,
      extendsClassName: className
    });
    return classes;
  }

  render() {
    const {
      verticalPosition,
      autoCloseTimeout,
      autoClose,
      margin,
      horizontalPosition,
      children,
      content,
      contentNode,
      closeDelay,
      background,
      className,
      ...attributes
    } = this.props;
    const { theme } = this.context;
    const tooltipStyle = this.getTooltipStyle();
    const classes = theme.prepareStyles({
      className: "tooltip",
      styles: {
        tooltip: tooltipStyle,
        root: { position: "relative", display: "inline-block" }
      }
    });

    return (
      <div
        {...classes.root}
        ref={rootElm => this.rootElm = rootElm}
        onMouseEnter={this.toggleShow}
        onClick={this.toggleShow}
        onMouseLeave={this.toggleHide}
      >
        <span
          ref={tooltipElm => this.tooltipElm = tooltipElm}
          {...attributes}
          {...classes.tooltip}
        >
          {content || contentNode}
        </span>
        {children}
      </div>
    );
  }
}

export default Tooltip;
