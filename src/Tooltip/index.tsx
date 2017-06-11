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
    autoCloseTimeout: 750
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
    this.unShowTimer = setTimeout(() => {
      this.setState({
        showTooltip: false
      });
      clearTimeout(this.unShowTimer);
    }, 500);
  }

  getStyle = (showTooltip = false, positionStyle = {}): React.CSSProperties =>  {
    const { context: { theme }, props: { style, background } } = this;
    return theme.prepareStyles({
      height: 28,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      padding: "4px 8px",
      transition: "all .25s 0s ease-in-out",
      border: `1px solid ${theme.useFluentDesign ? theme.listLow : theme.baseLow}`,
      color: theme.baseMediumHigh,
      background: background || (theme.useFluentDesign ? theme.acrylicTexture60.background : theme.chromeMedium),
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
    if (width !== void(0) && height !== void(0)) {
      switch (horizontalPosition) {
        case "left": {
          positionStyle.right = 0;
          break;
        }
        case "center": {
          positionStyle.left = (width - containerWidth) / 2;
          break;
        }
        case "right": {
          positionStyle.left = 0;
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
      background,
      ...attributes
    } = this.props;
    const { theme } = this.context;

    return (
      <div
        style={{ position: "relative", display: "inline-block" }}
        ref={rootElm => this.rootElm = rootElm}
        onMouseEnter={this.showTooltip}
        onClick={this.showTooltip}
        onMouseLeave={this.unShowTooltip}
      >
        <span
          {...attributes}
          ref={tooltipElm => this.tooltipElm = tooltipElm}
          style={this.getTooltipStyle()}
        >
          {content || contentNode}
        </span>
        {children}
      </div>
    );
  }
}

export default Tooltip;
