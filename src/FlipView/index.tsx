import * as React from "react";
import * as PropTypes from "prop-types";

import IconButton from "../IconButton";
import Swipe from "../Swipe";
import Dots from "./Dots";

export interface DataProps {
  /**
   * default init Show item `children[initialFocusIndex]`.
   */
  initialFocusIndex?: number;
  /**
   * Control FlipView can Swipe or not.
   */
  stopSwipe?: boolean;
  /**
   * Control FlipView auto swipe.
   */
  autoSwipe?: boolean;
  /**
   * FlipView auto swipe speed.
   */
  speed?: number;
  /**
   * FlipView is phone mod swipe to next easier `0 < easy < 1`.
   */
  easy?: number;
  /**
   * FlipView layout.
   */
  direction?: "vertical" | "horizontal";
  /**
   * Control show FlipView navigation.
   */
  showNavigation?: boolean;
  /**
   * if `true`, remove `MouseEvent` control show navigation.
   */
  controlledNavigation?: boolean;
  /**
   * Control show FlipView control.
   */
  showControl?: boolean;
  /**
   * FlipView can drag in PC mode (in the experiment).
   */
  supportPcDrag?: boolean;
  /**
   * navigation `iconSize`.
   */
  navigationIconSize?: number;
}

export interface FlipViewProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export interface FlipViewState {
  focusSwipeIndex?: number;
  currCanAutoSwipe?: boolean;
  currShowNavigation?: boolean;
}

export class FlipView extends React.Component<FlipViewProps, FlipViewState> {
  static defaultProps: FlipViewProps = {
    direction: "horizontal",
    autoSwipe: true,
    navigationIconSize: 24,
    showNavigation: true,
    controlledNavigation: true,
    showControl: true,
    supportPcDrag: false,
    stopSwipe: false
  };
  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };
  state: FlipViewState = {
    focusSwipeIndex: 0,
    currCanAutoSwipe: this.props.autoSwipe,
    currShowNavigation: this.props.showNavigation
  };
  mounted = false;
  rootElm: HTMLDivElement;
  swipe: Swipe;
  dots: Dots;

  swipeForward = () => {
    this.swipe.swipeForward();
  }

  swipeBackWord = () => {
    this.swipe.swipeBackWord();
  }

  componentDidMount() {
    this.mounted = true;
  }

  shouldComponentUpdate(nextProps: FlipViewProps, nextState: FlipViewState) {
    return nextProps !== this.props || nextState !== this.state;
  }

  handleChangeSwipe = (focusSwipeIndex: number) => {
    const count = React.Children.count(this.props.children);
    if (this.mounted) {
      this.setState({ focusSwipeIndex: focusSwipeIndex % count });
    }
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

  handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!this.state.currShowNavigation) {
      this.setState({
        currShowNavigation: true
      });
    }
  }

  handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    if (this.state.currShowNavigation) {
      this.setState({
        currShowNavigation: false
      });
    }
  }

  render() {
    const {
      className,
      children,
      showNavigation,
      initialFocusIndex,
      stopSwipe,
      autoSwipe,
      speed,
      easy,
      direction,
      navigationIconSize,
      supportPcDrag,
      showControl,
      controlledNavigation,
      ...attributes
    } = this.props;
    const { theme } = this.context;
    const { focusSwipeIndex, currCanAutoSwipe, currShowNavigation } = this.state;
    const count = React.Children.count(children);
    const isHorizontal = direction === "horizontal";
    const _showNavigation = controlledNavigation ? showNavigation : currShowNavigation;

    const inlineStyles = getStyles(this);
    const styles = theme.prepareStyles({
      className: "flip-view",
      styles: inlineStyles
    });

    return (
      <div
        ref={element => this.rootElm = element}
        style={styles.root.style}
        className={theme.classNames(styles.root.className, className)}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        {count > 1 && _showNavigation && (
          <IconButton
            onClick={this.swipeBackWord}
            style={inlineStyles.iconLeft}
            hoverStyle={{
              background: theme.baseLow
            }}
            activeStyle={{
              background: theme.accent,
              color: "#fff"
            }}
          >
            {isHorizontal ? "ChevronLeft3Legacy" : "ScrollChevronUpLegacy"}
          </IconButton>
        )}
        <Swipe
          ref={swipe => this.swipe = swipe}
          onChangeSwipe={index => this.dots.setFocusIndex(index)}
          {...{
            children,
            initialFocusIndex,
            stopSwipe,
            autoSwipe: currCanAutoSwipe,
            speed,
            easy,
            direction,
            navigationIconSize,
            supportPcDrag
          }}
        />
        {count > 1 && _showNavigation && (
          <IconButton
            onClick={this.swipeForward}
            style={inlineStyles.iconRight}
            hoverStyle={{
              background: theme.baseLow
            }}
            activeStyle={{
              background: theme.accent,
              color: "#fff"
            }}
          >
            {isHorizontal ? "ChevronRight3Legacy" : "ScrollChevronDownLegacy"}
          </IconButton>
        )}
        <Dots
          ref={dots => this.dots = dots}
          {...{
            count,
            showControl,
            controlStyle: inlineStyles.control,
            controlContentStyle: inlineStyles.controlContent,
            iconStyle: inlineStyles.icon,
            handleSwipeToIndex: this.handleSwipeToIndex,
            defaultFocusSwipeIndex: focusSwipeIndex,
            toggleCanAutoSwipe: this.toggleCanAutoSwipe,
            currCanAutoSwipe: currCanAutoSwipe
          }}
        />
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
  const { navigationIconSize, direction, style } = flipView.props;
  const { theme } = flipView.context;
  const { prefixStyle } = theme;
  const isHorizontal = direction === "horizontal";

  const baseIconStyle: React.CSSProperties = {
    position: "absolute",
    background: theme.listLow,
    zIndex: 20,
    fontSize: navigationIconSize / 2,
    width: navigationIconSize * (isHorizontal ? 1 : 2),
    lineHeight: `${navigationIconSize * (isHorizontal ? 2 : 1)}px`,
    height: navigationIconSize * (isHorizontal ? 2 : 1)
  };

  return {
    root: prefixStyle({
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      zIndex: 0,
      width: "100%",
      background: theme.chromeLow,
      height: "auto",
      minHeight: baseIconStyle.height,
      ...style
    }),
    iconLeft: {
      ...baseIconStyle,
      top: isHorizontal ? `calc(50% - ${navigationIconSize}px)` : 0,
      left: isHorizontal ? 0 : `calc(50% - ${navigationIconSize}px)`
    },
    iconRight: {
      ...baseIconStyle,
      bottom: isHorizontal ? `calc(50% - ${navigationIconSize}px)` : 0,
      right: isHorizontal ? 0 : `calc(50% - ${navigationIconSize}px)`
    },
    control: {
      display: "flex",
      justifyContent: "center",
      position: "absolute",
      pointerEvents: "none",
      ...(isHorizontal ? {
        flexDirection: "row",
        width: "100%",
        bottom: 4,
        left: 0
      } as React.CSSProperties : {
        flexDirection: "column",
        height: "100%",
        top: 0,
        right: 4
      } as React.CSSProperties)
    },
    controlContent: prefixStyle({
      display: "flex",
      flexDirection: isHorizontal ? "row" : "column",
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

export default FlipView;
