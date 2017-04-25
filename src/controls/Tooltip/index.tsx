import * as React from "react";

import ThemeType from "../../styles/ThemeType";
const defaultProps: TooltipProps = __DEV__ ? require("./devDefaultProps").default : {};

export interface DataProps {
  verticalPosition?: "top" | "bottom" | "center";
  horizontalPosition?: "left" | "right" | "center";
  show?: boolean;
  itemHeigh?: number;
  margin?: number;
  autoClose?: boolean;
  timeout?: number;
  contentNode?: any;
}
export interface TooltipProps extends DataProps, React.HTMLAttributes<HTMLSpanElement> {}

export interface TooltipState {
  showTooltip?: boolean;
}

export default class Tooltip extends React.Component<TooltipProps, TooltipState> {
  static defaultProps: TooltipProps = {
    ...defaultProps,
    verticalPosition: "bottom",
    horizontalPosition: "center",
    content: "Tooltip",
    margin: 4,
    autoClose: false,
    timeout: 2500,
  };

  state: TooltipState = {
    showTooltip: false
  };
  refs: { rootElm: HTMLDivElement; tooltipElm: HTMLSpanElement };
  timer: any = null;

  static contextTypes = { theme: React.PropTypes.object };
  context: { theme: ThemeType };

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  showTooltip = (e: React.MouseEvent<HTMLDivElement>) => {
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
      }, this.props.timeout);
    } else {
      show();
    }
  }

  notShowTooltip = (e: React.MouseEvent<HTMLDivElement>) => {
    this.setState({
      showTooltip: false
    });
  }

  getStyle = (showTooltip = false, positionStyle = {}): React.CSSProperties =>  {
    const { context: { theme }, props: { style } } = this;
    return theme.prepareStyles({
      height: 28,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      padding: "4px 8px",
      transition: "all .25s 0s ease-in-out",
      border: `1px solid ${theme.baseLow}`,
      color: theme.baseMediumHigh,
      background: theme.chromeMedium,
      opacity: showTooltip ? 1 : 0,
      transform: `translateY(${showTooltip ? "0px" : "10px"})`,
      position: "absolute",
      fontSize: 14,
      pointerEvents: showTooltip ? "all" : "none",
      zIndex: theme.zIndex.tooltip,
      ...style,
      ...positionStyle,
    });
  }

  getTooltipStyle = (): React.CSSProperties => {
    const { rootElm, tooltipElm } = this.refs;
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
    };
    return this.getStyle(showTooltip, positionStyle);
  }

  render() {
    // tslint:disable-next-line:no-unused-variable
    const { verticalPosition, timeout, autoClose, margin, horizontalPosition, show, children, itemHeigh, content, contentNode, ...attributes } = this.props;
    const { theme } = this.context;

    return (
      <div
        style={{ position: "relative", display: "inline-block" }}
        ref="rootElm"
        onMouseEnter={this.showTooltip}
        onClick={this.showTooltip}
        onMouseLeave={this.notShowTooltip}
      >
        <span
          {...attributes}
          ref="tooltipElm"
          style={this.getTooltipStyle()}
        >
          {content || contentNode}
        </span>
        {children}
      </div>
    );
  }
}
