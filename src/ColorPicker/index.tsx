import * as React from "react";
import * as PropTypes from "prop-types";

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
}
const emptyFunc = () => {};

export class ColorPicker extends React.Component<ColorPickerProps, ColorPickerState> {
  static defaultProps: ColorPickerProps = {
    size: 336,
    defaultColor: "hsv(210, 100%, 100%)",
    onChangeColor: emptyFunc,
    onChangedColor: emptyFunc,
    onChangedColorTimeout: 250
  };

  state: ColorPickerState = tinycolor(this.props.defaultColor).toHsv();

  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };
  canvas?: HTMLCanvasElement;
  ctx?: CanvasRenderingContext2D;
  moveColorTimer: any = null;
  originBodyStyle = { ...document.body.style };
  colorSelectorElm: HTMLDivElement;
  colorMainBarElm: HTMLDivElement;

  componentDidMount() {
    this.renderCanvas();
  }

  componentDidUpdate() {
    this.renderCanvas();
  }

  componentWillUnmount() {
    clearTimeout(this.moveColorTimer);
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
      const radialGradient = ctx.createRadialGradient(_xPosition, _yPosition, _r, _xPosition, _yPosition, 0);
      radialGradient.addColorStop(0, tinycolor(`hsv(${Math.abs(i)}, 100%, ${v * 100}%)`).toHexString());
      radialGradient.addColorStop(1, tinycolor(`hsv(${Math.abs(i)}, 0%, ${v * 100}%)`).toHexString());
      ctx.closePath();
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

  handleColorBarChange = (v: number) => {
    const { h, s } = this.state;
    const { onChangeColor, onChangedColor } = this.props;
    const colorHexString = tinycolor({ h, s, v }).toHexString();
    onChangeColor(colorHexString);
    this.setState({ v }, () => onChangedColor(colorHexString));
  }

  handleChooseColor = (e: React.MouseEvent<HTMLCanvasElement>, isClickEvent = true) => {
    if (isClickEvent && e.type === "mousedown") {
      window.addEventListener("mousemove", this.handleMouseMove);
      window.addEventListener("mouseup", this.handleMouseUp);
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
    const x = e.clientX - clientReact.left - colorPickerBoardSize;
    const y = clientReact.top - e.clientY + colorPickerBoardSize;
    const r = Math.sqrt(x * x + y * y);
    let h = Math.asin(y / r) / Math.PI * 180;
    if (x > 0 && y > 0) h = 360 - h;
    if (x > 0 && y < 0) h = -h;
    if (x < 0 && y < 0) h = 180 + h;
    if (x < 0 && y > 0) h = 180 + h;
    let s = r / colorPickerBoardSize;
    if (s > 1) s = 1;

    const colorHexString = tinycolor({ h, s, v }).toHexString();
    if (isClickEvent && e.type === "click") {
      onChangeColor(colorHexString);
      onChangedColor(colorHexString);
      this.setState({ h, s });
    } else {
      onChangeColor(colorHexString);
      clearTimeout(this.moveColorTimer);
      const r = colorPickerBoardSize * s;
      const mainBoardDotSize = size / 25;
      const x = Math.cos(h / 180 * Math.PI) * r;
      const y = Math.sin(h / 180 * Math.PI) * r;

      Object.assign(this.colorSelectorElm.style, {
        top: `${y}px`,
        left: `${x}px`
      } as CSSStyleDeclaration);
      if (this.colorMainBarElm) {
        this.colorMainBarElm.style.background = colorHexString;
      }
      this.moveColorTimer = setTimeout(() => {
        onChangedColor(colorHexString);
        this.setState({ h, s });
      }, onChangedColorTimeout);
    }
  }

  handleMouseMove = (e: any) => {
    this.handleChooseColor(e, false);
  }

  handleMouseUp = (e: any) => {
    clearTimeout(this.moveColorTimer);
    Object.assign(document.body.style, {
      userSelect: void 0,
      msUserSelect: void 0,
      webkitUserSelect: void 0,
      cursor: void 0,
      ...this.originBodyStyle
    });
    window.removeEventListener("mousemove", this.handleMouseMove);
    window.removeEventListener("mouseup", this.handleMouseUp);
  }

  render() {
    const {
      size,
      defaultColor,
      onChangeColor,
      onChangedColor,
      onChangedColorTimeout,
      ...attributes
    } = this.props;
    const { h, s, v } = this.state;
    const { context: { theme } } = this;
    const styles = getStyles(this);

    const color = tinycolor({ h, s, v });
    const halfLightColor = tinycolor({ h, s, v: 1 });
    const colorPickerBoardSize = size * 0.8125 / 2;
    const r = colorPickerBoardSize * s;
    const mainBoardDotSize = size / 25;
    const x = Math.cos(h / 180 * Math.PI) * r;
    const y = Math.sin(h / 180 * Math.PI) * r;

    return (
      <div style={styles.root} {...attributes}>
        <div style={styles.board}>
          <div style={{ position: "relative" }}>
            <canvas
              style={styles.mainBoard}
              ref={canvas => this.canvas = canvas}
              onMouseDown={this.handleChooseColor}
              onMouseUp={this.handleMouseUp}
              onClick={this.handleChooseColor}
            >
              Your Browser not support canvas.
            </canvas>
            <div
              ref={colorSelectorElm => this.colorSelectorElm = colorSelectorElm}
              style={theme.prepareStyles({
                pointerEvents: "none",
                userDrag: "none",
                position: "absolute",
                top: y,
                left: x,
                width: mainBoardDotSize,
                height: mainBoardDotSize,
                borderRadius: mainBoardDotSize,
                background: "none",
                boxShadow: `0 0 0 4px #fff`,
                transform: `translate3d(${colorPickerBoardSize - mainBoardDotSize / 2}px, ${colorPickerBoardSize - mainBoardDotSize / 2}px, 0)`,
                transition: "all .25s"
              })}
            />
          </div>
          <div
            style={styles.colorMainBar}
            ref={colorMainBarElm => this.colorMainBarElm = colorMainBarElm}
          />
        </div>
        <Slider
          maxValue={1}
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
  const { prepareStyles } = theme;
  const currColor = tinycolor({ h, s, v }).toHslString();

  return {
    root: prepareStyles({
      display: "inline-block",
      verticalAlign: "middle",
      width: size,
      flexDirection: "column",
      ...style
    }),
    board: prepareStyles({
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between"
    }),
    mainBoard: {
      userDrag: "none",
      margin: 0,
      userSelect: "none"
    },
    colorMainBar: {
      height: size * 0.8125,
      marginLeft: size * 0.025,
      width: size * 0.125,
      background: currColor
    }
  };
}



export default ColorPicker;
