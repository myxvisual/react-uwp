import * as React from "react";
import * as PropTypes from "prop-types";
import shallowEqual from "../common/shallowEqual";
import IS_NODE_ENV from "../common/nodeJS/IS_NODE_ENV";

export interface DataProps {
  initialFocusIndex?: number;
  stopSwipe?: boolean;
  autoSwipe?: boolean;
  speed?: number;
  easy?: number;
  delay?: number;
  direction?: "vertical" | "horizontal";
  transitionTimingFunction?: string;
  navigationIconSize?: number;
  showIcon?: boolean;
  animate?: "slide" | "opacity";
  supportPcDrag?: boolean;
  onChangeSwipe?: (index?: number) => void;
}

export interface SwipeProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export interface SwipeState {
  currStopSwipe?: boolean;
  focusIndex?: number;
  childrenLength?: number;
  isHorizontal?: boolean;
  isSingleChildren?: boolean;
  haveAnimate?: boolean;
  swiping?: boolean;
}

const emptyFunc = () => {};
export default class Swipe extends React.Component<SwipeProps, SwipeState> {
  static defaultProps: SwipeProps = {
    direction: "horizontal",
    autoSwipe: true,
    className: "",
    animate: "slide",
    transitionTimingFunction: "ease-in-out",
    initialFocusIndex: 0,
    stopSwipe: false,
    speed: 1500,
    delay: 5000,
    easy: 0.85,
    supportPcDrag: false,
    onChangeSwipe: emptyFunc
  };

  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  isSingleChildren = React.Children.count(this.props.children) === 1;

  state: SwipeState = (({ direction, initialFocusIndex, stopSwipe, children }: SwipeProps) => ({
    isHorizontal: direction === "horizontal",
    isSingleChildren: this.isSingleChildren,
    focusIndex: this.isSingleChildren ? initialFocusIndex : initialFocusIndex + 1,
    currStopSwipe: stopSwipe,
    childrenLength: React.Children.count(children),
    haveAnimate: false,
    swiping: false
  }))(this.props);

  private timeoutId: any;

  private swipeTimer: any;
  refs: {
    container: HTMLDivElement;
    content: HTMLDivElement;
  };
  private containerDOM: HTMLDivElement;
  private startClientX: number;
  private startClientY: number;
  private endClientX: number;
  private endClientY: number;
  originBodyStyle = IS_NODE_ENV ? void 0 : { ...document.body.style };

  componentDidMount() {
    this.containerDOM = this.refs.container;
    this.updateState(this.props);
  }

  componentWillReceiveProps(nextProps: SwipeProps) {
    if (!shallowEqual(nextProps, this.props)) {
      this.updateState(nextProps, true);
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timeoutId);
    clearTimeout(this.swipeTimer);
  }

  updateState = (props: SwipeProps, setToState = false) => {
    clearTimeout(this.timeoutId);
    const childrenLength = React.Children.count(props.children);
    const isSingleChildren = childrenLength === 1;
    if (setToState) {
      this.setState({
        isHorizontal: props.direction === "horizontal",
        childrenLength,
        isSingleChildren,
        currStopSwipe: !props.autoSwipe
      });
    }
    if (props.autoSwipe && !isSingleChildren) {
      this.timeoutId = setTimeout(() => {
        this.swipeForward();
        this.setNextSlider();
      }, props.delay);
      this.setNextSlider.funStartTime = Date.now();
    }
  }

  setNextSlider: {
    (): void;
    funStartTime?: number;
  } = () => {
    const { delay } = this.props;
    if (this.state.currStopSwipe || (this.setNextSlider.funStartTime && Date.now() - this.setNextSlider.funStartTime < delay)) return;
    this.timeoutId = setTimeout(() => {
      if (!this.state.currStopSwipe) this.swipeForward();
      this.setNextSlider();
    }, delay);
    this.setNextSlider.funStartTime = Date.now();
  }

  getFocusIndex = () => this.state.focusIndex;

  swipeToIndex = (focusIndex: number) => {
    clearTimeout(this.timeoutId);
    focusIndex = focusIndex + 1;
    this.setState({
      haveAnimate: true,
      focusIndex: this.setRightFocusIndex(focusIndex),
      currStopSwipe: true
    });
  }

  swipeForward = () => {
    const { focusIndex, swiping, isSingleChildren } = this.state;
    if (swiping) return;
    if (!isSingleChildren) this.props.onChangeSwipe(focusIndex);
    this.state.swiping = true;
    const isLast = focusIndex === this.getItemsLength() - 2;

    if (isLast) {
      this.setState({
        focusIndex: this.setRightFocusIndex(focusIndex + 1),
        haveAnimate: true
      }, () => {
        this.swipeTimer = setTimeout(() => {
          this.setState({
            focusIndex: 1,
            haveAnimate: false
          });
          this.state.swiping = false;
        }, this.props.speed);
      });
    } else {
      this.setState({
        focusIndex: this.setRightFocusIndex(focusIndex + 1),
        haveAnimate: true
      });
      this.swipeTimer = setTimeout(() => {
        this.state.swiping = false;
      }, this.props.speed);
    }
  }

  swipeBackWord = () => {
    const { focusIndex, swiping, isSingleChildren } = this.state;
    if (swiping || !this.props.autoSwipe) return;
    if (!isSingleChildren) this.props.onChangeSwipe(focusIndex);
    this.state.swiping = true;
    const isFirst = focusIndex === 1;

    if (isFirst) {
      this.setState({
        focusIndex: this.setRightFocusIndex(focusIndex - 1),
        haveAnimate: true
      }, () => {
        this.swipeTimer = setTimeout(() => {
          this.setState({
            focusIndex: this.getItemsLength() - 2,
            haveAnimate: false
          });
          this.state.swiping = false;
        }, this.props.speed);
      });
    } else {
      this.setState({
        focusIndex: this.setRightFocusIndex(focusIndex - 1),
        haveAnimate: true
      });
      this.swipeTimer = setTimeout(() => {
        this.state.swiping = false;
      }, this.props.speed);
    }
  }

  getItemsLength = () => {
    const { children } = this.props;
    const childrenSize = React.Children.toArray(children).length;
    return childrenSize > 1 ? childrenSize + 2 : childrenSize;
  }

  setRightFocusIndex = (focusIndex: number): number => {
    const length = this.getItemsLength();
    return focusIndex < 0 ? length - Math.abs(focusIndex) % length : focusIndex % length;
  }

  checkIsToucheEvent = (e: React.SyntheticEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => e.type.includes("touch");

  mouseOrTouchDownHandler = (e: any) => {
    Object.assign(document.body.style, {
      userSelect: "none",
      msUserSelect: "none",
      webkitUserSelect: "none"
    });
    this.endClientX = void 0;
    this.endClientY = void 0;
    const { isHorizontal } = this.state;
    this.setState({ currStopSwipe: true });
    const isToucheEvent = this.checkIsToucheEvent(e);
    if (!isToucheEvent && !this.props.supportPcDrag) return;
    if (isToucheEvent) {
      window.addEventListener("touchmove", this.mouseOrTouchMoveHandler);
      window.addEventListener("touchend", this.mouseOrTouchUpHandler);
    } else {
      window.addEventListener("mousemove", this.mouseOrTouchMoveHandler);
      window.addEventListener("mouseup", this.mouseOrTouchUpHandler);
    }
    if (isToucheEvent) {
      if (isHorizontal) {
        this.startClientX = e.changedTouches[0].clientX;
      } else {
        this.startClientY = e.changedTouches[0].clientY;
      }
    } else {
      if (isHorizontal) {
        this.startClientX = e.clientX;
      } else {
        this.startClientY = e.clientY;
      }
    }
    this.refs.content.style.webkitTransition = "all 0.06125s 0s linear";
  }

  mouseOrTouchMoveHandler = (e: any) => {
    Object.assign(document.body.style, {
      userSelect: void 0,
      msUserSelect: void 0,
      webkitUserSelect: void 0,
      ...this.originBodyStyle
    });
    const isToucheEvent = this.checkIsToucheEvent(e);
    const { focusIndex, isHorizontal } = this.state;
    if (isToucheEvent) {
      if (isHorizontal) {
        this.endClientX = e.changedTouches[0].clientX;
      } else {
        this.endClientY = e.changedTouches[0].clientY;
      }
    } else {
      if (isHorizontal) {
        this.endClientX = e.clientX;
      } else {
        this.endClientY = e.clientY;
      }
    }
    this.refs.content.style.webkitTransform = `translate${isHorizontal ? "X" : "Y"}(${this.refs.container.getBoundingClientRect()[isHorizontal ? "width" : "height"] * (-focusIndex) - this[isHorizontal ? "startClientX" : "startClientY"] + this[isHorizontal ? "endClientX" : "endClientY"]}px)`;
  }

  mouseOrTouchUpHandler = (e: any) => {
    Object.assign(document.body.style, {
      userSelect: void 0,
      msUserSelect: void 0,
      webkitUserSelect: void 0,
      cursor: void 0,
      ...this.originBodyStyle
    });
    const { childrenLength, isHorizontal } = this.state;
    const { transitionTimingFunction, speed } = this.props;
    const isToucheEvent = this.checkIsToucheEvent(e);
    if (isToucheEvent) {
      window.removeEventListener("touchmove", this.mouseOrTouchMoveHandler);
      window.removeEventListener("touchend", this.mouseOrTouchUpHandler);
    } else {
      window.removeEventListener("mousemove", this.mouseOrTouchMoveHandler);
      window.removeEventListener("mouseup", this.mouseOrTouchUpHandler);
    }

    if ((isHorizontal && this.endClientX === void 0) || (
      !isHorizontal && this.endClientY === void 0
    )) {
      return;
    }
    const transition = `all ${speed}ms 0s ${transitionTimingFunction}`;
    this.refs.content.style.webkitTransition = transition;
    this.state.currStopSwipe = false;
    let { easy } = this.props;
    if (easy < 0) easy = 0;
    if (easy > 1) easy = 1;

    const movePosition = this.endClientX - this.startClientX;
    const isNext = movePosition < 0;
    let focusIndex = this.state.focusIndex + movePosition / this.refs.container.getBoundingClientRect().width;
    focusIndex = isNext ? Math.ceil(focusIndex + easy / 2) : Math.floor(focusIndex - easy / 2);
    focusIndex = this.setRightFocusIndex(focusIndex);
    if (focusIndex === this.state.focusIndex) {
      this.refs.content.style.webkitTransform = `translateX(${this.refs.container.getBoundingClientRect().width * (-focusIndex / childrenLength) - this.startClientX + this.endClientX}px)`;
    } else {
      if (isNext) {
        this.swipeForward();
      } else {
        this.swipeBackWord();
      }
    }
    if (this.props.autoSwipe && !this.state.isSingleChildren && 0) {
      this.setNextSlider();
    }
  }

  render() {
    const {
      children,
      className,
      initialFocusIndex,
      showIcon,
      animate,
      stopSwipe,
      autoSwipe,
      speed,
      delay,
      easy,
      direction,
      style,
      transitionTimingFunction,
      navigationIconSize,
      supportPcDrag,
      onChangeSwipe,
      ...attributes
    } = this.props;
    const {
      focusIndex,
      currStopSwipe,
      childrenLength,
      isSingleChildren,
      isHorizontal,
      haveAnimate
    } = this.state;
    const { theme } = this.context;
    const childrenArray = React.Children.toArray(children);
    const childrenSize = childrenArray.length;
    if (childrenSize > 1) {
      childrenArray.push(childrenArray[0]);
      childrenArray.unshift(childrenArray[childrenSize - 1]);
    }
  const transition = `transform ${speed}ms 0s ${transitionTimingFunction}`;

    const inlineStyles = getStyles(this);
    const styles = theme.prepareStyles({
      className: "swipe",
      styles: inlineStyles
    });

    return (
      <div
        {...attributes}
        ref="container"
        style={styles.root.style}
        className={theme.classNames(styles.root.className, className)}
      >
        <div
          onMouseDown={
            (!stopSwipe && !isSingleChildren) ? this.mouseOrTouchDownHandler : void 0
          }
          onTouchStart={
            (!stopSwipe && !isSingleChildren) ? this.mouseOrTouchDownHandler : void 0
          }
          ref="content"
          style={theme.prefixStyle({
            ...styles.content.style,
            transform: `translate${isHorizontal ? "X" : "Y"}(${-focusIndex * 100 / childrenLength}%)`,
            transition: haveAnimate ? transition : void 0
          })}
          className={styles.content.className}
        >
          {childrenArray.map((child, index) => (
            <div data-index={index} {...styles.item} key={`${index}`}>
              {child}
            </div>
          ))}
        </div>
      </div>
    );
  }
}

function getStyles(swipe: Swipe): {
  root?: React.CSSProperties;
  content?: React.CSSProperties;
  item?: React.CSSProperties;
} {
  const { transitionTimingFunction, speed, style } = swipe.props;
  const transition = `transform ${speed}ms 0s ${transitionTimingFunction}`;
  const {
    focusIndex,
    childrenLength,
    isHorizontal,
    isSingleChildren,
    haveAnimate
  } = swipe.state;
  const { theme: { prefixStyle } } = swipe.context;

  return {
    root: prefixStyle({
      position: "relative",
      display: "flex",
      flexDirection: isHorizontal ? "row" : "column",
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      height: "100%",
      overflow: "hidden",
      flex: "0 0 auto",
      ...style
    }),
    content: prefixStyle({
      position: "relative",
      flex: "0 0 auto",
      display: "flex",
      flexDirection: isHorizontal ? "row" : "column",
      flexWrap: "nowrap",
      alignItems: "center",
      justifyContent: "center",
      height: isHorizontal ? "100%" : `${childrenLength * 100}%`,
      width: isHorizontal ? `${childrenLength * 100}%` : "100%",
      left: (isHorizontal && !isSingleChildren) ? `${((isSingleChildren ? 0 : 2 + childrenLength) / 2 - 0.5) * 100}%` : void 0,
      top: isHorizontal ? void 0 : `${((isSingleChildren ? 0 : 2 + childrenLength) / 2 - 0.5) * 100}%`
    }),
    item: prefixStyle({
      position: "relative",
      overflow: "hidden",
      width: isHorizontal ? `${100 / childrenLength}%` : "100%",
      height: isHorizontal ? "100%" : `${100 / childrenLength}%`,
      flex: "0 0 auto",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      userSelect: "none",
      userDrag: "none",
      WebkitUserDrag: "none"
    } as any)
  };
}
