import * as React from "react";
import * as PropTypes from "prop-types";
import IS_NODE_ENV from "../common/nodeJS/IS_NODE_ENV";

export interface DataProps {
  /**
   * Set the Slider display mode.
   */
  displayMode?: "vertical" | "horizon";
  /**
   * Set the Slider minValue.
   */
  minValue?: number;
  /**
   * Set the Slider maxValue.
   */
  maxValue?: number;
  /**
   * Set the Slider initValue.
   */
  initValue?: number;
  /**
   * Set `value.toFixed(numberToFixed)`.
   */
  numberToFixed?: number;
  /**
   * Set value info add `unit`.
   */
  unit?: string;
  /**
   * Toggle show value info.
   */
  showValueInfo?: boolean;
  /**
   * Set transition to all Slider Element.
   */
  transition?: string;
  /**
   * onChangeValue callback.
   */
  onChangeValue?: (value?: number) => void;
  /**
   * After finished onChangeValue callback.
   */
  onChangedValue?: (value?: number) => void;
  /**
   * onChangeValueRatio callback.
   */
  onChangeValueRatio?: (valueRatio?: number) => void;
  /**
   * After finished onChangeValueRatio callback.
   */
  onChangedValueRatio?: (value?: number) => void;
  /**
   * Set custom Slider bar Hight.
   */
  barHeight?: number;
  /**
   * Set custom Slider bar background.
   */
  barBackground?: string;
  /**
   * Set custom Slider bar backgroundImage.
   */
  barBackgroundImage?: string;
  /**
   * Set custom Slider controllerStyle.
   */
  customControllerStyle?: React.CSSProperties;
  /**
   * Set custom Slider controller width.
   */
  controllerWidth?: number;
  /**
   * Set custom Slider controller without animation.
   */
  useSimpleController?: boolean;
  /**
   * How many time call onChange callback.
   */
  throttleTimer?: number;
  width?: string | number;
  height?: string | number;
  label?: string;
}

export interface SliderProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export interface SliderState {
  currValue?: number;
  valueRatio?: number;
  hovered?: boolean;
  dragging?: boolean;
}

const emptyFunc = () => {};
export class Slider extends React.Component<SliderProps, SliderState> {
  static defaultProps: SliderProps = {
    displayMode: "horizon",
    minValue: 0,
    maxValue: 1,
    initValue: 0,
    onChangeValue: emptyFunc,
    onChangedValue: emptyFunc,
    onChangeValueRatio: emptyFunc,
    onChangedValueRatio: emptyFunc,
    height: 24,
    barHeight: 2,
    controllerWidth: 8,
    showValueInfo: false,
    numberToFixed: 0,
    unit: "",
    transition: "all 0.25s",
    throttleTimer: 120 / 1000
  };
  originBodyStyle = IS_NODE_ENV ? void 0 : { ...document.body.style };

  state: SliderState = {
    currValue: this.props.initValue,
    valueRatio: this.props.initValue / (this.props.maxValue - this.props.minValue)
  };
  throttleNow: number = null;
  throttleNowTimer: any = null;
  onChangedValueTimer: any = null;
  rootElm: HTMLDivElement;
  labelElm: HTMLSpanElement;
  controllerWrapperElm: HTMLDivElement;
  controllerElm: HTMLDivElement;
  barElm: HTMLDivElement;

  componentWillReceiveProps(nextProps: SliderProps) {
    if (this.state.currValue !== nextProps.initValue) {
      this.setState({ currValue: nextProps.initValue });
    }
  }
  componentDidMount() {
    this.rootElm.addEventListener("touchstart", this.handleDraggingStart as any, false);
    this.rootElm.addEventListener("touchend", this.handleDragged as any, false);
  }

  componentWillUnmount() {
    clearTimeout(this.throttleNowTimer);
    clearTimeout(this.onChangedValueTimer);
    this.rootElm.removeEventListener("touchstart", this.handleDraggingStart as any, false);
    this.rootElm.removeEventListener("touchend", this.handleDragged as any, false);
  }

  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };
  handelMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    this.setState({ hovered: true });
  }

  handelMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    this.setState({ hovered: false });
  }

  handelOnClick = (e: React.MouseEvent<HTMLDivElement>) => {
    this.setValueByEvent(e);
  }

  handleDraggingStart = (e: any) => {
    e.preventDefault();
    Object.assign(document.body.style, {
      userSelect: "none",
      msUserSelect: "none",
      webkitUserSelect: "none",
      cursor: "default"
    });
    document.documentElement.addEventListener("mousemove", this.setValueByEvent);
    document.documentElement.addEventListener("touchmove", this.setValueByEvent);
    document.documentElement.addEventListener("mouseup", this.handleDragged);
    document.documentElement.addEventListener("touchend", this.handleDragged);
  }

  handleDragged = (e: any) => {
    Object.assign(document.body.style, {
      userSelect: void 0,
      msUserSelect: void 0,
      webkitUserSelect: void 0,
      cursor: void 0,
      ...this.originBodyStyle
    });
    if (this.state.dragging) {
      this.setState({ dragging: false });
    }
    document.documentElement.removeEventListener("mousemove", this.setValueByEvent);
    document.documentElement.removeEventListener("touchmove", this.setValueByEvent);
    document.documentElement.removeEventListener("mouseup", this.handleDragged);
    document.documentElement.removeEventListener("touchend", this.handleDragged);
  }

  setValueByEvent = (e: any, type?: any) => {
    const isTouchEvent = e.type.includes("touch");
    clearTimeout(this.onChangedValueTimer);
    const isDraggingEvent = e.type === "mousemove" || e.type === "touchmove";
    if (isDraggingEvent && !this.state.dragging) {
      e.preventDefault();
      this.setState({ dragging: true });
    }

    if (isDraggingEvent) {
      const nowTime = performance ? performance.now() : Date.now();
      if (!this.throttleNow || (nowTime - this.throttleNow > this.props.throttleTimer)) {
        clearTimeout(this.throttleNowTimer);
        this.throttleNow = nowTime;
      } else {
        this.throttleNowTimer = setTimeout(() => {
          this.setValueByEvent(e, type);
        }, this.props.throttleTimer);
        return;
      }
    }

    const {
      displayMode,
      maxValue,
      minValue,
      barBackground,
      barBackgroundImage,
      label,
      numberToFixed,
      unit,
      onChangeValue,
      onChangedValue,
      onChangeValueRatio
    } = this.props;

    const isHorizonMode = displayMode === "horizon";
    const useCustomBackground = barBackground || barBackgroundImage;
    const { left, width, bottom, height } = this.rootElm.getBoundingClientRect();
    const { clientX, clientY } = isTouchEvent ? e.changedTouches[0] : e;
    const controllerClientRect = this.controllerElm.getBoundingClientRect();
    const controllerWidth = controllerClientRect.width;
    const controllerHeight = controllerClientRect.height;

    let valueRatio = isHorizonMode ? (clientX - left) / (width - controllerWidth) : -(clientY - bottom) / (height - controllerHeight);
    valueRatio = valueRatio < 0 ? 0 : (valueRatio > 1 ? 1 : valueRatio);
    const currValue = minValue + (maxValue - minValue) * valueRatio;

    this.state.currValue = currValue;
    this.state.valueRatio = valueRatio;

    if (e.type === "click" || e.type === "touchstart") {
      this.setState({ currValue });
    } else {
      if (!useCustomBackground) {
        const barTransform = `translate${isHorizonMode ? "X" : "Y"}(${(isHorizonMode ? (valueRatio - 1) : (1 - valueRatio)) * 100}%)`;
        Object.assign(this.barElm.style, {
          transform: barTransform,
          webKitTransform: barTransform,
          msTransform: barTransform,
          mozTransform: barTransform
        } as React.CSSProperties);
      }

      const transform = `translate${isHorizonMode ? "X" : "Y"}(${(isHorizonMode ? valueRatio : 1 - valueRatio) * 100}%)`;
      Object.assign(this.controllerWrapperElm.style, {
        transform,
        webKitTransform: transform,
        msTransform: transform,
        mozTransform: transform
      } as React.CSSProperties);

      if (label) this.labelElm.innerText = `${currValue.toFixed(numberToFixed)}${unit}`;
    }

    onChangeValue(currValue);
    onChangeValueRatio(valueRatio);

    this.onChangedValueTimer = setTimeout(() => {
      onChangedValue(currValue);
      onChangeValueRatio(valueRatio);
    }, 0);
  }

  render() {
    const {
      minValue,
      maxValue,
      initValue,
      onChangeValue,
      onChangeValueRatio,
      onChangedValue,
      onChangedValueRatio,
      barHeight,
      controllerWidth,
      barBackground,
      barBackgroundImage,
      useSimpleController,
      showValueInfo,
      numberToFixed,
      unit,
      customControllerStyle,
      transition,
      throttleTimer,
      displayMode,
      ...attributes
    } = this.props;
    const { currValue } = this.state;
    const { theme } = this.context;
    const inlineStyles = getStyles(this);
    const styles = theme.prepareStyles({
      className: "slider",
      styles: inlineStyles
    });

    const normalRender = (
      <div
        ref={elm => this.rootElm = elm}
        {...styles.root}
        onMouseEnter={this.handelMouseEnter}
        onMouseLeave={this.handelMouseLeave}
        onClick={this.setValueByEvent}
        onTouchStart={this.setValueByEvent}
        onMouseDown={this.handleDraggingStart}
        onMouseUp={this.handleDragged}
      >
        <div {...styles.barContainer}>
          <div {...styles.bar} ref={elm => this.barElm = elm} />
        </div>
        <div {...styles.controllerWrapper} ref={controllerWrapperElm => this.controllerWrapperElm = controllerWrapperElm}>
          <div {...styles.controller} ref={controllerElm => this.controllerElm = controllerElm} />
        </div>
      </div>
    );

    return (
      <div {...attributes} {...styles.wrapper}>
        {showValueInfo ? (
          <div {...styles.infoWrapper}>
            {normalRender}
            <span
              ref={labelElm => this.labelElm = labelElm}
              {...styles.label}
            >
              {`${currValue.toFixed(numberToFixed)}${unit}`}
            </span>
          </div>
        ) : normalRender}
      </div>
    );
  }
}

function getStyles(slider: Slider): {
  wrapper?: React.CSSProperties;
  root?: React.CSSProperties;
  infoWrapper?: React.CSSProperties;
  barContainer?: React.CSSProperties;
  bar?: React.CSSProperties;
  controllerWrapper?: React.CSSProperties;
  controller?: React.CSSProperties;
  label?: React.CSSProperties;
} {
  const {
    context: { theme },
    props: {
      transition,
      maxValue,
      style,
      height,
      barHeight,
      controllerWidth,
      barBackground,
      barBackgroundImage,
      useSimpleController,
      customControllerStyle,
      showValueInfo,
      displayMode
    },
    state: {
      currValue,
      dragging,
      hovered
    }
  } = slider;
  const { prefixStyle } = theme;
  const isHorizonMode = displayMode === "horizon";
  const height2px: number = Number.parseFloat(height as any);
  const barHeight2px: number = Number.parseFloat(barHeight as any);
  const controllerWidth2px: number = Number.parseFloat(controllerWidth as any);
  const currTransition = dragging ? void 0 : (transition || void 0);
  const useCustomBackground = barBackground || barBackgroundImage;
  const valueRatio = currValue / maxValue;

  return {
    wrapper: prefixStyle({
      width: isHorizonMode ? 320 : height2px,
      height: isHorizonMode ? height2px : 320,
      display: "inline-block",
      verticalAlign: "middle",
      ...style
    }),
    root: prefixStyle({
      flex: showValueInfo ? "0 0 auto" : void 0,
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      width: isHorizonMode ? "100%" : height2px,
      height: isHorizonMode ? height2px : "100%",
      cursor: "default",
      position: "relative"
    }),
    barContainer: {
      background: theme.baseLow,
      position: "absolute",
      width: isHorizonMode ? "100%" : barHeight,
      height: isHorizonMode ? barHeight : "100%",
      overflow: "hidden",
      left: isHorizonMode ? 0 : `calc(50% - ${barHeight2px / 2}px)`,
      top: isHorizonMode ? `calc(50% - ${barHeight2px / 2}px)` : 0
    },
    infoWrapper: prefixStyle({
      display: "flex",
      flexDirection: displayMode === "horizon" ? "row" : "column",
      alignItems: "center"
    }),
    bar: prefixStyle({
      transition: currTransition,
      background: useCustomBackground ? barBackground : theme.listAccentLow,
      backgroundImage: barBackgroundImage,
      position: "absolute",
      width: "100%",
      height: "100%",
      left: 0,
      top: 0,
      dynamicStyle: {
        transform: useCustomBackground ? void 0 : `translate${isHorizonMode ? "X" : "Y"}(${(isHorizonMode ? (valueRatio - 1) : (1 - valueRatio)) * 100}%)`
      }
    }),
    controllerWrapper: prefixStyle({
      position: "absolute",
      left: 0,
      top: 0,
      width: "100%",
      height: "100%",
      pointerEvents: "none",
      transition: currTransition,
      dynamicStyle: {
        transform: `translate${isHorizonMode ? "X" : "Y"}(${(isHorizonMode ? valueRatio : 1 - valueRatio) * 100}%)`
      }
    }),
    controller: prefixStyle({
      pointerEvents: "none",
      transition: currTransition,
      display: "inline-block",
      background: (useSimpleController || dragging || hovered) ? theme.baseHigh : theme.accent,
      borderRadius: controllerWidth2px / 2,
      width: isHorizonMode ? controllerWidth2px : height2px,
      height: isHorizonMode ? height2px : controllerWidth2px,
      float: "left",
      transform: `translate3d(${isHorizonMode ? -controllerWidth2px / 2 : 0}px, 0, 0)`,
      ...customControllerStyle
    }),
    label: {
      flex: showValueInfo ? "0 0 auto" : void 0,
      display: "inline-block",
      marginLeft: 12,
      fontSize: height2px / 1.5,
      lineHeight: `${height2px / 1.5}px`,
      color: theme.baseMediumHigh
    }
  };
}

export default Slider;
