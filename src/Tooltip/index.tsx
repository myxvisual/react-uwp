import * as React from "react";
import * as PropTypes from "prop-types";

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
   * Set close delay time (ms).
   */
  closeDelay?: number;
  /**
   * Set custom background.
   */
  background?: string;
}
export interface TooltipProps extends DataProps, React.HTMLAttributes<HTMLSpanElement> {}

export interface TooltipState {
  showTooltip?: boolean;
}

export class Tooltip extends React.Component<TooltipProps, TooltipState> {
  static defaultProps: TooltipProps = {
    verticalPosition: "top",
    horizontalPosition: "center",
    margin: 4,
    autoClose: false,
    autoCloseTimeout: 750,
    closeDelay: 0
  };

  state: TooltipState = {
    showTooltip: false
  };
  rootElm: HTMLDivElement;
  tooltipElm: HTMLSpanElement;
  timer: any = null;
  unShowTimer: any = null;

  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  showTooltip = (e: React.MouseEvent<HTMLDivElement>) => {
    clearTimeout(this.unShowTimer);
    const show = () => {
      this.setState({
        showTooltip: true
      });
    };
    if (this.props.autoClose) {
      show();
      this.timer = setTimeout(() => {
        this.setState({
          showTooltip: false
        });
      }, this.props.autoCloseTimeout);
    } else {
      show();
    }
  }

  unShowTooltip = (e: React.MouseEvent<HTMLDivElement>) => {
    this.timer = setTimeout(() => {
      this.setState({
        showTooltip: false
      });
    }, this.props.closeDelay);
  }

  getStyle = (showTooltip = false, positionStyle = {}): React.CSSProperties =>  {
    const { context: { theme }, props: { style, background } } = this;
    return theme.prefixStyle({
      height: 28,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      padding: "4px 8px",
      transition: "all .25s 0s ease-in-out",
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
    if (!(rootElm && tooltipElm)) return this.getStyle();

    const { theme } = this.context;
    const { verticalPosition, horizontalPosition, margin } = this.props;
    const { width, height } = rootElm.getBoundingClientRect();
    const containerWidth = tooltipElm.getBoundingClientRect().width;
    const containerHeight = tooltipElm.getBoundingClientRect().height;
    const { showTooltip } = this.state;
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
    return this.getStyle(showTooltip, positionStyle);
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
    return (
      <div
        style={{ position: "relative", display: "inline-block" }}
        ref={rootElm => this.rootElm = rootElm}
        onMouseEnter={this.showTooltip}
        onClick={this.showTooltip}
        onMouseLeave={this.unShowTooltip}
      >
        <span
          ref={tooltipElm => this.tooltipElm = tooltipElm}
          {...attributes}
          {...theme.prepareStyle({
            className: "tooltip",
            style: tooltipStyle,
            extendsClassName: className
          })}
        >
          {content || contentNode}
        </span>
        {children}
      </div>
    );
  }
}

export default Tooltip;
