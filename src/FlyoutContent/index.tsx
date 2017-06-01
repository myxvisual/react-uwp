import * as React from "react";
import * as PropTypes from "prop-types";

export interface DataProps {
  verticalPosition?: "top" | "bottom" | "center";
  horizontalPosition?: "left" | "right" | "center";
  show?: boolean;
  margin?: number;
  autoClose?: boolean;
  timeout?: number;
}
export interface FlyoutContentProps extends DataProps, React.HTMLAttributes<HTMLSpanElement> {}
export interface FlyoutContentState {
  showFlyoutContent?: boolean;
}

class FlyoutContent extends React.Component<FlyoutContentProps, FlyoutContentState> {
  static defaultProps: FlyoutContentProps = {
    verticalPosition: "top",
    horizontalPosition: "center",
    children: "FlyoutContent",
    margin: 4,
    autoClose: false,
    timeout: 2500,
    onMouseLeave: () => {},
    onMouseEnter: () => {}
  };

  state: FlyoutContentState = {
    showFlyoutContent: this.props.show
  };
  refs: { FlyoutContentElm: HTMLDivElement };

  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

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

  getStyle = (showFlyoutContent = false, positionStyle = {}): React.CSSProperties => {
    const { context: { theme }, props: { style } } = this;
    return theme.prepareStyles({
      width: 280,
      height: 60,

      padding: "4px 8px",
      border: `1px solid ${theme.baseLow}`,
      color: theme.baseMediumHigh,
      background: theme.chromeMedium,
      transition: "all .25s 0s ease-in-out",
      pointerEvents: showFlyoutContent ? "all" : "none",
      opacity: showFlyoutContent ? 1 : 0,
      transform: `translateY(${showFlyoutContent ? "0px" : "10px"})`,
      position: "absolute",
      zIndex: theme.zIndex.FlyoutContent,
      ...positionStyle,
      ...style
    });
  }

  getFlyoutContentStyle = (): React.CSSProperties => {
    const { FlyoutContentElm } = this.refs;
    if (!FlyoutContentElm) return this.getStyle();
    let parentNode: any = FlyoutContentElm.parentNode;

    const { theme } = this.context;
    const { verticalPosition, horizontalPosition, margin } = this.props;
    const { width, height } = parentNode.getBoundingClientRect();
    const containerWidth = FlyoutContentElm.getBoundingClientRect().width;
    const containerHeight = FlyoutContentElm.getBoundingClientRect().height;
    const { showFlyoutContent } = this.state;
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
    return this.getStyle(showFlyoutContent, positionStyle);
  }

  handelMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.borderColor = this.context.theme.accent;
    this.props.onMouseEnter(e);
  }

  handelMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.borderColor = this.context.theme.baseLow;
    this.props.onMouseLeave(e);
  }

  render() {
    const {
      verticalPosition,
      timeout,
      autoClose,
      margin,
      horizontalPosition,
      show,
      children,
      ...attributes
    } = this.props;
    const { theme } = this.context;

    return (
      <div
        {...attributes}
        onMouseEnter={this.handelMouseEnter}
        onMouseLeave={this.handelMouseLeave}
        ref="FlyoutContentElm"
        style={this.getFlyoutContentStyle()}
      >
        {children}
      </div>
    );
  }
}

export default FlyoutContent;
