import * as React from "react";
import * as PropTypes from "prop-types";
import IS_NODE_ENV from "../common/nodeJS/IS_NODE_ENV";

import Slider from "../Slider";
import * as tinycolor from "tinycolor2";

export interface DataProps {
  /**
   * init ColorPicker Default color.
   */
  defaultColor?: string;
  /**
   * init ColorPicker Default size. passed number covert to `px`.
   */
  size?: number;
  /**
   * onChange ColorPicker color event `callback`.
   */
  onChangeColor?: (color?: string) => void;
  /**
   * onChanged color event `callback`.
   */
  onChangedColor?: (color?: string) => void;
  /**
   * setTimeout to onChanged color event `callback`. default is 0.
   */
  onChangedColorTimeout?: number;
}
export interface ColorPickerProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export interface ColorPickerState {
  h?: number;
  s?: number;
  v?: number;
  dragging?: boolean;
}
const emptyFunc = () => {};

export class ColorPicker extends React.Component<ColorPickerProps, ColorPickerState> {
  static defaultProps: ColorPickerProps = {
    size: 336,
    defaultColor: "hsv(210, 100%, 100%)",
    onChangeColor: emptyFunc,
    onChangedColor: emptyFunc,
    onChangedColorTimeout: 1000 / 24
  };

  state: ColorPickerState = tinycolor(this.props.defaultColor).toHsv();

  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };
  canvas?: HTMLCanvasElement;
  ctx?: CanvasRenderingContext2D;
  moveColorTimer: any = null;
  originBodyStyle = IS_NODE_ENV ? void 0 : { ...document.body.style };
  colorSelectorElm: HTMLDivElement;
  colorMainBarElm: HTMLDivElement;
  slider: Slider;

  componentDidMount() {
    this.renderCanvas();
    this.canvas.addEventListener("touchstart", this.handleChooseColor as any, false);
    this.canvas.addEventListener("touchend", this.handleEnd as any, false);
  }

  componentDidUpdate() {
    this.renderCanvas();
  }

  componentWillUnmount() {
    clearTimeout(this.moveColorTimer);
    this.canvas.removeEventListener("touchstart", this.handleChooseColor as any, false);
    this.canvas.removeEventListener("touchend", this.handleEnd as any, false);
  }

  renderCanvas() {
    let { size } = this.props;
    size = size * 0.8125;
    Object.assign(this.canvas, {
      width: size,
      height: size
    });
    const _xPosition = size / 2;
    const _yPosition = _xPosition;
    const _r = _xPosition;

    const _pi_2 = Math.PI * 2;
    const _c = _r * _pi_2;

    this.ctx = this.canvas.getContext("2d");
    const { ctx } = this;
    this.setCanvas2devicePixelRatio();

    // use save when using clip Path
    ctx.save();
    ctx.arc(_xPosition, _yPosition, _r, 0, _pi_2, true);
    ctx.clip();

    const { v, s } = this.state;

    for (let i = -1; i < 360; i++) {
      ctx.beginPath();
      ctx.moveTo(_xPosition, _yPosition);
      if (i === -1) {
        ctx.arc(_xPosition, _yPosition, _r, -_pi_2 / 360, 0, true);
      } else {
        ctx.arc(_xPosition, _yPosition, _r, 0, _pi_2 * i / 360, true);
      }
      ctx.closePath();
      const radialGradient = ctx.createRadialGradient(_xPosition, _yPosition, 0, _xPosition, _yPosition, _r);
      radialGradient.addColorStop(0, tinycolor(`hsv(${Math.abs(i)}, 0%, ${v * 100}%)`).toHexString());
      radialGradient.addColorStop(1, tinycolor(`hsv(${Math.abs(i)}, 100%, ${v * 100}%)`).toHexString());
      ctx.fillStyle = radialGradient;
      ctx.fill();
    }

    // reset clip to default
    ctx.restore();
  }

  setCanvas2devicePixelRatio = () => {
    const { devicePixelRatio } = window;
    const { canvas, ctx } = this;

    if (!devicePixelRatio) return;

    const { width, height } = canvas;

    Object.assign(canvas, {
      width: width * devicePixelRatio,
      height: height * devicePixelRatio
    } as HTMLCanvasElement);

    Object.assign(canvas.style, {
      width: `${width}px`,
      height: `${height}px`
    } as CSSStyleDeclaration);

    ctx.scale(devicePixelRatio, devicePixelRatio);
  }

  colorBarTimer: any = null;
  handleColorBarChange = (v: number) => {
    clearTimeout(this.colorBarTimer);
    const { h, s } = this.state;
    const { onChangeColor, onChangedColor, onChangedColorTimeout } = this.props;
    const colorHexString = tinycolor({ h, s, v }).toHexString();
    onChangeColor(colorHexString);
    this.setState({ v }, () => onChangeColor(colorHexString));
    this.colorBarTimer = setTimeout(() => {
      onChangedColor(colorHexString);
    }, onChangedColorTimeout);
  }

  clickTimer: any = null;
  handleChooseColor = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>, isClickEvent = true) => {
    e.preventDefault();
    const isTouchEvent = e.type.includes("touch");
    const { prefixStyle } = this.context.theme;

    if (isClickEvent && (e.type === "mousedown" || e.type === "touchstart")) {
      document.documentElement.addEventListener("mousemove", this.handleTouchMouseMove, false);
      document.documentElement.addEventListener("mouseup", this.handleEnd);
      this.canvas.addEventListener("touchmove", this.handleTouchMouseMove, false);
      document.documentElement.addEventListener("touchend", this.handleEnd);
      Object.assign(document.body.style, {
        userSelect: "none",
        msUserSelect: "none",
        webkitUserSelect: "none",
        cursor: "default"
      });
    }
    const { size, onChangeColor, onChangedColor, onChangedColorTimeout } = this.props;
    const { v } = this.state;
    const clientReact = this.canvas.getBoundingClientRect();
    const colorPickerBoardSize = size * 0.8125 / 2;
    const { clientX, clientY } = isTouchEvent ? (e as React.TouchEvent<HTMLCanvasElement>).changedTouches[0] : (e as React.MouseEvent<HTMLCanvasElement>);
    const x = clientX - clientReact.left - colorPickerBoardSize;
    const y = clientReact.top - clientY + colorPickerBoardSize;
    const r = Math.sqrt(x * x + y * y);
    let h = Math.asin(y / r) / Math.PI * 180;
    if (x > 0 && y > 0) h = 360 - h;
    if (x > 0 && y < 0) h = -h;
    if (x < 0 && y < 0) h = 180 + h;
    if (x < 0 && y > 0) h = 180 + h;
    let s = r / colorPickerBoardSize;
    if (s > 1) s = 1;

    const colorHexString = tinycolor({ h, s, v }).toHexString();
    if (this.slider) {
      const halfLightColor = tinycolor({ h, s, v: 1 });
      this.slider.barElm.style.backgroundImage = `linear-gradient(90deg, #000, ${halfLightColor.toHexString()})`;
    }

    if (isClickEvent && e.type === "click") {
      onChangeColor(colorHexString);
      this.setState({ h, s }, () => {
        clearTimeout(this.clickTimer);
        this.clickTimer = setTimeout(() => {
          onChangedColor(colorHexString);
        }, 0);
      });
    } else {
      onChangeColor(colorHexString);
      clearTimeout(this.moveColorTimer);
      const r = colorPickerBoardSize * s;
      const mainBoardDotSize = size / 25;
      const x = Math.cos(h / 180 * Math.PI) * r;
      const y = Math.sin(h / 180 * Math.PI) * r;

      Object.assign(this.colorSelectorElm.style, prefixStyle({
        transform: `translate3d(${x}px, ${y}px, 0)`
      }));
      if (this.colorMainBarElm) {
        this.colorMainBarElm.style.background = colorHexString;
      }
      this.moveColorTimer = setTimeout(() => {
        onChangedColor(colorHexString);
        this.setState({ h, s });
      }, onChangedColorTimeout);
    }
  }

  handleTouchMouseMove = (e: any) => {
    if (!this.state.dragging) {
      this.setState({ dragging: true });
    }
    this.handleChooseColor(e, false);
  }

  handleEnd = (e: any) => {
    if (this.state.dragging) {
      this.setState({ dragging: false });
    }
    clearTimeout(this.moveColorTimer);
    Object.assign(document.body.style, {
      userSelect: void 0,
      msUserSelect: void 0,
      webkitUserSelect: void 0,
      cursor: void 0,
      ...this.originBodyStyle
    });
    document.documentElement.removeEventListener("mousemove", this.handleTouchMouseMove);
    this.canvas.removeEventListener("touchmove", this.handleTouchMouseMove);
    document.documentElement.removeEventListener("mouseup", this.handleEnd);
    document.documentElement.removeEventListener("touchend", this.handleEnd);
  }

  render() {
    const {
      size,
      defaultColor,
      onChangeColor,
      onChangedColor,
      onChangedColorTimeout,
      className,
      ...attributes
    } = this.props;
    const { h, s, v, dragging } = this.state;
    const { context: { theme } } = this;

    const color = tinycolor({ h, s, v });
    const halfLightColor = tinycolor({ h, s, v: 1 });
    const colorPickerBoardSize = size * 0.8125 / 2;
    const r = colorPickerBoardSize * s;
    const mainBoardDotSize = size / 25;
    const x = Math.cos(h / 180 * Math.PI) * r;
    const y = Math.sin(h / 180 * Math.PI) * r;
    const selectorSize = colorPickerBoardSize - mainBoardDotSize / 2;

    const styles = getStyles(this);
    styles.colorSelector = {
      ...styles.colorSelector,
      top: selectorSize,
      left: selectorSize,
      width: mainBoardDotSize,
      height: mainBoardDotSize,
      borderRadius: mainBoardDotSize,
      background: "none",
      boxShadow: `0 0 0 4px #fff`
    };
    const classes = theme.prepareStyles({
      className: "color-picker",
      styles
    });

    return (
      <div {...attributes} style={classes.root.style} className={theme.classNames(classes.root.className, className)}>
        <div {...classes.board}>
          <div style={{ position: "relative" }}>
            <canvas
              {...classes.mainBoard}
              ref={canvas => this.canvas = canvas}
              onClick={this.handleChooseColor}
              onMouseDown={this.handleChooseColor}
              onMouseUp={this.handleEnd}
            >
              Your Browser not support canvas.
            </canvas>
            <div
              ref={colorSelectorElm => this.colorSelectorElm = colorSelectorElm}
              className={classes.colorSelector.className}
              style={theme.prefixStyle({
                ...classes.colorSelector.style,
                transform: `translate3d(${x}px, ${y}px, 0)`
              })}
            />
          </div>
          <div
            {...classes.colorMainBar}
            ref={colorMainBarElm => this.colorMainBarElm = colorMainBarElm}
          />
        </div>
        <Slider
          maxValue={1}
          ref={slider => this.slider = slider}
          onChangeValue={this.handleColorBarChange}
          style={{ marginTop: size * 0.0125, width: "100%" }}
          initValue={v}
          width={size}
          barHeight={size * 0.025}
          barBackgroundImage={`linear-gradient(90deg, #000, ${halfLightColor.toHexString()})`}
          useSimpleController
        />
      </div>
    );
  }
}

function getStyles(colorPicker: ColorPicker): {
  root?: React.CSSProperties;
  board?: React.CSSProperties;
  mainBoard?: React.CSSProperties;
  colorMainBar?: React.CSSProperties;
  colorSelector?: React.CSSProperties;
} {
  const {
    context: { theme },
    props: {
      style,
      size,
      defaultColor
    },
    state: { h, s, v }
  } = colorPicker;
  const { prefixStyle } = theme;
  const currColor = tinycolor({ h, s, v }).toHslString();

  return {
    root: prefixStyle({
      display: "inline-block",
      verticalAlign: "middle",
      width: size,
      flexDirection: "column",
      ...style
    }),
    board: prefixStyle({
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between"
    }),
    mainBoard: prefixStyle({
      userDrag: "none",
      margin: 0,
      userSelect: "none"
    } as any),
    colorMainBar: {
      height: size * 0.8125,
      marginLeft: size * 0.025,
      width: size * 0.125,
      background: currColor
    },
    colorSelector: prefixStyle({
      pointerEvents: "none",
      userDrag: "none",
      position: "absolute"
    } as any)
  };
}



export default ColorPicker;
