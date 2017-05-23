import * as React from "react";
import * as PropTypes from "prop-types";

import IconButton from "../IconButton";
import Swipe from "../Swipe";
import ThemeType from "../styles/ThemeType";


export interface DataProps {
  initialFocusIndex?: number;
  canSwipe?: boolean;
  autoSwipe?: boolean;
  speed?: number;
  easy?: number;
  direction?: "vertical" | "horizontal";
  iconSize?: number;
  iconStyle?: React.CSSProperties;
  iconHoverStyle?: React.CSSProperties;
  showIcon?: boolean;
}
export interface FlipViewProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export interface FlipViewState {}
export default class FlipView extends React.Component<FlipViewProps, FlipViewState> {
  static defaultProps: FlipViewProps = {
    direction: "horizontal",
    className: "",
    iconSize: 24,
    showIcon: true
  };
  static contextTypes = { theme: PropTypes.object };
  context: { theme: ThemeType };
  rootElm: HTMLDivElement;
  swipe: Swipe;

  swipeForward = () => {
    this.swipe.swipeForward();
  }

  swipeBackWord = () => {
    this.swipe.swipeBackWord();
  }

  shouldComponentUpdate(nextProps: FlipViewProps, nextState: FlipViewState) {
    return nextProps !== this.props || nextState !== this.state;
  }

  render() {
    // tslint:disable-next-line:no-unused-variable
    const {
      children,
      showIcon,
      initialFocusIndex,
      canSwipe,
      autoSwipe,
      speed,
      easy,
      direction,
      iconStyle,
      iconHoverStyle,
      iconSize,
      ...attributes
    } = this.props;
    const { theme } = this.context;
    const count = React.Children.count(children);
    const isHorizontal = direction === "horizontal";

    const styles = getStyles(this);
    return (
      <div
        ref={element => this.rootElm = element}
        style={{
          ...styles.root,
          ...theme.prepareStyles(attributes.style)
        }}
      >
        {count > 1 && showIcon && (
          <IconButton
            onClick={this.swipeBackWord}
            style={{
              ...styles.iconLeft,
              ...theme.prepareStyles(iconStyle)
            }}
            hoverStyle={{
              background: theme.accent,
              ...theme.prepareStyles(iconHoverStyle)
            }}
          >
            {isHorizontal ? "\uE012" : "\uE010"}
          </IconButton>
        )}
        <Swipe
          ref={swipe => this.swipe = swipe}
          {...{
            children,
            showIcon,
            initialFocusIndex,
            canSwipe,
            autoSwipe,
            speed,
            easy,
            direction,
            iconSize,
            ...attributes
          }}
          style={attributes.style}
        />
        {count > 1 && showIcon && (
          <IconButton
            onClick={this.swipeForward}
            style={{
              ...styles.iconRight,
              ...theme.prepareStyles(iconStyle)
            }}
            hoverStyle={{
              background: theme.accent,
              ...theme.prepareStyles(iconHoverStyle)
            }}
          >
            {isHorizontal ? "\uE013" : "\uE011"}
          </IconButton>
        )}
      </div>
    );
  }
}

function getStyles(flipView: FlipView): {
  root?: React.CSSProperties;
  iconLeft?: React.CSSProperties;
  iconRight?: React.CSSProperties;
} {
  const { iconSize, direction } = flipView.props;
  const { theme } = flipView.context;
  const { prepareStyles } = theme;
  const isHorizontal = direction === "horizontal";

  const baseIconStyle: React.CSSProperties = {
    position: "absolute",
    background: theme.baseLow,
    zIndex: 20,
    fontSize: iconSize / 2,
    width: iconSize * (isHorizontal ? 1 : 2),
    height: iconSize * (isHorizontal ? 2 : 1)
  };

  return {
    root: prepareStyles({
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      zIndex: 0,
      width: "100%",
      background: theme.chromeLow,
      height: "auto",
      minHeight: baseIconStyle.height
    }),
    iconLeft: {
      ...baseIconStyle,
      top: isHorizontal ? `calc(50% - ${iconSize}px)` : 0,
      left: isHorizontal ? 0 : `calc(50% - ${iconSize}px)`
    },
    iconRight: {
      ...baseIconStyle,
      bottom: isHorizontal ? `calc(50% - ${iconSize}px)` : 0,
      right: isHorizontal ? 0 : `calc(50% - ${iconSize}px)`
    }
  };
}
