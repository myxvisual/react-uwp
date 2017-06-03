import * as React from "react";
import * as PropTypes from "prop-types";

export interface DataProps {
  minValue?: number;
  maxValue?: number;
  initValue?: number;
  onChangeValue?: (value?: number) => void;
  onChangeValueRatio?: (valueRatio?: number) => void;
  barHeight?: number;
  barBackground?: string;
  barBackgroundImage?: string;
  customControllerStyle?: React.CSSProperties;
  controllerWidth?: number;
  useSimpleController?: boolean;
  showValueInfo?: boolean;
  numberToFixed?: number;
  unit?: string;
  transition?: string;
}

export interface SliderProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export interface SliderState {
  currValue?: number;
  valueRatio?: number;
  hovered?: boolean;
  dragging?: boolean;
}

const emptyFunc = () => {};
export default class Slider extends React.Component<SliderProps, SliderState> {
  static defaultProps: SliderProps = {
    minValue: 0,
    maxValue: 1,
    initValue: 0,
    onChangeValue: emptyFunc,
    onChangeValueRatio: emptyFunc,
    width: "100%",
    height: 24,
    barHeight: 2,
    controllerWidth: 8,
    showValueInfo: false,
    numberToFixed: 0,
    unit: "",
    transition: "all 0.25s"
  };
  originBodyStyle = { ...document.body.style };

  state: SliderState = {
    currValue: this.props.initValue,
    valueRatio: this.props.initValue / (this.props.maxValue - this.props.minValue)
  };
  rootElm: HTMLDivElement;
  controllerWrapperElm: HTMLDivElement;
  controllerElm: HTMLDivElement;
  barElm: HTMLDivElement;

  componentWillReceiveProps(nextProps: SliderProps) {
    if (this.state.currValue !== nextProps.initValue) {
      this.setState({ currValue: nextProps.initValue });
    }
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

  handelMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    Object.assign(document.body.style, {
      userSelect: "none",
      msUserSelect: "none",
      webkitUserSelect: "none",
      cursor: "default"
    });
    window.addEventListener("mousemove", this.setValueByEvent);
    window.addEventListener("mouseup", this.handelMouseUp);
    this.setValueByEvent(e);
  }

  handelMouseUp = (e: any) => {
    Object.assign(document.body.style, {
      userSelect: void 0,
      msUserSelect: void 0,
      webkitUserSelect: void 0,
      cursor: void 0,
      ...this.originBodyStyle
    });
    this.setState({ dragging: false });
    window.removeEventListener("mousemove", this.setValueByEvent);
    window.removeEventListener("mouseup", this.handelMouseUp);
  }

  setValueByEvent = (e: any, type?: any) => {
    if (e.type === "mousemove" && !this.state.dragging) {
      this.setState({ dragging: true });
    }
    const { maxValue, minValue, barBackground, barBackgroundImage } = this.props;
    const useCustomBackground = barBackground || barBackgroundImage;
    const { left, width } = this.rootElm.getBoundingClientRect();
    const mouseLeft = e.clientX;
    const controllerWidth = this.controllerElm.getBoundingClientRect().width;
    let valueRatio = (mouseLeft - left) / (width - controllerWidth);
    valueRatio = valueRatio < 0 ? 0 : (valueRatio > 1 ? 1 : valueRatio);
    const currValue = minValue + (maxValue - minValue) * valueRatio;
    this.state.currValue = currValue;
    this.state.valueRatio = valueRatio;

    if (!useCustomBackground) {
      const barTransform = `translateX(${(valueRatio - 1) * 100}%)`;
      Object.assign(this.barElm.style, {
        transform: barTransform,
        webKitTransform: barTransform,
        msTransform: barTransform,
        mozTransform: barTransform
      } as React.CSSProperties);
    }

    const transform = `translateX(${valueRatio * 100}%)`;
    Object.assign(this.controllerWrapperElm.style, {
      transform,
      webKitTransform: transform,
      msTransform: transform,
      mozTransform: transform
    } as React.CSSProperties);
    this.props.onChangeValue(currValue);
  }

  render() {
    const {
      minValue, // tslint:disable-line:no-unused-variable
      maxValue, // tslint:disable-line:no-unused-variable
      initValue, // tslint:disable-line:no-unused-variable
      onChangeValue, // tslint:disable-line:no-unused-variable
      onChangeValueRatio, // tslint:disable-line:no-unused-variable
      barHeight, // tslint:disable-line:no-unused-variable
      controllerWidth, // tslint:disable-line:no-unused-variable
      barBackground, // tslint:disable-line:no-unused-variable
      barBackgroundImage, // tslint:disable-line:no-unused-variable
      useSimpleController, // tslint:disable-line:no-unused-variable
      showValueInfo, // tslint:disable-line:no-unused-variable
      numberToFixed, // tslint:disable-line:no-unused-variable
      unit, // tslint:disable-line:no-unused-variable
      customControllerStyle, //  tslint:disable-line:no-unused-variable
      ...attributes
    } = this.props;
    const { currValue } = this.state;
    const { theme } = this.context;
    const styles = getStyles(this);

    return (
      <div {...attributes} style={styles.wrapper}>
        <div
          ref={elm => this.rootElm = elm}
          style={styles.root}
          onMouseEnter={this.handelMouseEnter}
          onMouseLeave={this.handelMouseLeave}
          onMouseDown={this.handelMouseDown}
          onMouseUp={this.handelMouseUp}
        >
          <div style={styles.barContainer}>
            <div style={styles.bar} ref={elm => this.barElm = elm} />
          </div>
          <div style={styles.controllerWrapper} ref={controllerWrapperElm => this.controllerWrapperElm = controllerWrapperElm}>
            <div style={styles.controller} ref={controllerElm => this.controllerElm = controllerElm} />
          </div>
        </div>
        {showValueInfo && (
          <span style={styles.label}>{`${currValue.toFixed(numberToFixed)}${unit}`}</span>
        )}
      </div>
    );
  }
}

function getStyles(slider: Slider): {
  wrapper?: React.CSSProperties;
  root?: React.CSSProperties;
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
      customControllerStyle
    },
    state: {
      currValue,
      dragging,
      hovered
    }
  } = slider;
  const { prepareStyles } = theme;
  const height2px: number = Number.parseFloat(height as any);
  const barHeight2px: number = Number.parseFloat(barHeight as any);
  const controllerWidth2px: number = Number.parseFloat(controllerWidth as any);
  const currTransition = dragging ? void 0 : (transition || void 0);
  const useCustomBackground = barBackground || barBackgroundImage;
  const valueRatio = currValue / maxValue;

  return {
    wrapper: prepareStyles({
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      ...style
    }),
    root: prepareStyles({
      width: "100%",
      height: height2px,
      cursor: "default",
      position: "relative",
      display: "inline-block"
    }),
    barContainer: {
      background: theme.baseLow,
      position: "relative",
      width: "100%",
      overflow: "hidden",
      height: barHeight,
      left: 0,
      top: `calc(50% - ${barHeight2px / 2}px)`
    },
    bar: prepareStyles({
      transition: currTransition,
      background: useCustomBackground ? barBackground : theme.listAccentLow,
      backgroundImage: barBackgroundImage,
      position: "absolute",
      width: "100%",
      transform: useCustomBackground ? void 0 : `translateX(${(valueRatio - 1) * 100}%)`,
      height: "100%",
      left: 0,
      top: 0
    }),
    controllerWrapper: prepareStyles({
      transition: currTransition,
      position: "absolute",
      width: "100%",
      left: 0,
      top: 0,
      transform: `translate3D(${valueRatio * 100}%, 0, 0)`
    }),
    controller: prepareStyles({
      transition: currTransition,
      display: "inline-block",
      background: (useSimpleController || dragging || hovered) ? theme.baseHigh : theme.accent,
      borderRadius: controllerWidth2px / 2,
      width: controllerWidth2px,
      height: height2px,
      transform: `translate3D(-${controllerWidth2px / 2}px, 0, 0)`,
      ...customControllerStyle
    }),
    label: {
      display: "inline-block",
      marginLeft: 12,
      fontSize: height2px / 1.5,
      lineHeight: `${height2px / 1.5}px`,
      color: theme.baseMediumHigh
    }
  };
}
