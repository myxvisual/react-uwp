import * as React from "react";
import * as PropTypes from "prop-types";

import IconButton from "../IconButton";
import Icon from "../Icon";
import Swipe from "../Swipe";

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
  showControl?: boolean;
  supportPC?: boolean;
}
export interface FlipViewProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export interface FlipViewState {
  focusSwipeIndex?: number;
  currCanAutoSwipe?: boolean;
}
export default class FlipView extends React.Component<FlipViewProps, FlipViewState> {
  static defaultProps: FlipViewProps = {
    direction: "horizontal",
    autoSwipe: true,
    iconSize: 24,
    showIcon: true,
    showControl: true,
    supportPC: false,
    canSwipe: true
  };
  static contextTypes = { theme: PropTypes.object };
  state: FlipViewState = {
    focusSwipeIndex: 0,
    currCanAutoSwipe: this.props.autoSwipe
  };
  context: { theme: ReactUWP.ThemeType };
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

  handleChangeSwipe = (focusSwipeIndex: number) => {
    const count = React.Children.count(this.props.children);
    this.setState({ focusSwipeIndex: focusSwipeIndex % count });
  }

  toggleCanAutoSwipe = (currCanAutoSwipe?: any) => {
    if (typeof currCanAutoSwipe === "boolean") {
      if (currCanAutoSwipe !== this.state.currCanAutoSwipe) {
        this.setState({ currCanAutoSwipe });
      }
    } else {
      this.setState((prevState, prevProps) => ({
        currCanAutoSwipe: !prevState.currCanAutoSwipe
      }));
    }
  }
  handleSwipeToIndex = (index: number) => {
    this.setState({ focusSwipeIndex: index });
    this.swipe.swipeToIndex(index);
  }

  render() {
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
      supportPC,
      showControl,
      ...attributes
    } = this.props;
    const { theme } = this.context;
    const { focusSwipeIndex, currCanAutoSwipe } = this.state;
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
              background: theme.baseLow,
              ...theme.prepareStyles(iconHoverStyle)
            }}
          >
            {isHorizontal ? "\uE012" : "\uE010"}
          </IconButton>
        )}
        <Swipe
          ref={swipe => this.swipe = swipe}
          onChangeSwipe={this.handleChangeSwipe}
          {...{
            children,
            showIcon,
            initialFocusIndex,
            canSwipe,
            autoSwipe: currCanAutoSwipe,
            speed,
            easy,
            direction,
            iconSize,
            supportPC,
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
              background: theme.baseLow,
              ...theme.prepareStyles(iconHoverStyle)
            }}
          >
            {isHorizontal ? "\uE013" : "\uE011"}
          </IconButton>
        )}
        {count > 1 && showControl && (
          <div style={styles.control}>
            <div style={styles.controlContent}>
              {Array(count).fill(0).map((numb, index) => (
                <Icon
                  style={styles.icon}
                  onClick={() => {
                    this.handleSwipeToIndex(index);
                  }}
                  key={`${index}`}
                >
                  {focusSwipeIndex === index ? "FullCircleMask" : "CircleRing"}
                </Icon>
              ))}
            <IconButton style={{ marginLeft: 2 }} size={32} onClick={this.toggleCanAutoSwipe}>
              {currCanAutoSwipe ? "Pause" : "Play"}
            </IconButton>
            </div>
          </div>
        )}
      </div>
    );
  }
}

function getStyles(flipView: FlipView): {
  root?: React.CSSProperties;
  iconLeft?: React.CSSProperties;
  iconRight?: React.CSSProperties;
  control?: React.CSSProperties;
  controlContent?: React.CSSProperties;
  icon?: React.CSSProperties;
} {
  const { iconSize, direction } = flipView.props;
  const { theme } = flipView.context;
  const { prepareStyles } = theme;
  const isHorizontal = direction === "horizontal";

  const baseIconStyle: React.CSSProperties = {
    position: "absolute",
    background: theme.listLow,
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
    },
    control: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      width: "100%",
      position: "absolute",
      bottom: 4,
      left: 0,
      pointerEvents: "none"
    },
    controlContent: prepareStyles({
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      pointerEvents: "all"
    }),
    icon: {
      fontSize: 6,
      margin: 2,
      cursor: "pointer"
    }
  };
}
