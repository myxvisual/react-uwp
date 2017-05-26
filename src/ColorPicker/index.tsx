import * as React from "react";
import * as PropTypes from "prop-types";

import ThemeType from "../styles/ThemeType";
import Slider from "../Slider";

export interface DataProps {
  title?: string;
  size?: number;
}
export interface ColorPickerProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export class ColorPicker extends React.Component<ColorPickerProps, void> {
  static defaultProps: ColorPickerProps = {
    size: 336
  };
  static contextTypes = { theme: PropTypes.object };
  context: { theme: ThemeType };
  canvas?: HTMLCanvasElement;
  ctx?: CanvasRenderingContext2D;

  componentDidMount() {
    let { size } = this.props;
    size = size * 0.8125;
    Object.assign(this.canvas, {
      width: size,
      height: size
    });
    const _xPosition = size / 2;
    const _yPosition = _xPosition;
    const _r = _xPosition - 2;

    const _pi_2 = Math.PI * 2;
    const _c = _r * _pi_2;

    this.ctx = this.canvas.getContext("2d");
    const { ctx } = this;
    this.setCanvas2devicePixelRatio();

    // use save when using clip Path
    // ctx.save();
    // ctx.arc(_xPosition, _yPosition, _r, 0, _pi_2, true);
    // ctx.clip();

    // Generate conical gradient
    ctx.beginPath();
    ctx.moveTo(_xPosition, _yPosition);
    ctx.arc(_xPosition, _yPosition, _r, -_pi_2 / 360, 0, true);
    ctx.closePath();
    ctx.fillStyle = "red";
    ctx.fill();

    for (let i = 0; i < 360; i++) {
      ctx.beginPath();
      ctx.moveTo(_xPosition, _yPosition);
      ctx.arc(_xPosition, _yPosition, _r + 1, 0, _pi_2 * i / 360, true);
      ctx.closePath();
      ctx.fillStyle = `hsl(${i}, 100%, 50%)`;
      ctx.fill();
    }

    // Generate radial gradient
    ctx.beginPath();
    const radialGradient = ctx.createRadialGradient(_xPosition, _yPosition, _r, _xPosition, _yPosition, 0);
    radialGradient.addColorStop(1, "rgba(255, 255, 255, 1)");
    radialGradient.addColorStop(0, "rgba(255, 255, 255, 0)");
    ctx.arc(_xPosition, _yPosition, _r, 0, _pi_2, true);
    ctx.closePath();
    ctx.fillStyle = radialGradient;
    ctx.fill();

    // reset clip to default
    // ctx.restore();
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

  render() {
    const { size, ...attributes } = this.props;
    const styles = getStyles(this);
    return (
      <div style={styles.root} {...attributes}>
        <div style={styles.board}>
          <canvas style={styles.mainBoard} ref={canvas => this.canvas = canvas}>
            Your Browser not support canvas.
          </canvas>
          <div style={styles.selectColor}/>
        </div>
        <div style={styles.selectBar} />
        <Slider width={size} />
      </div>
    );
  }
}

function getStyles(colorPicker: ColorPicker): {
  root?: React.CSSProperties;
  board?: React.CSSProperties;
  mainBoard?: React.CSSProperties;
  selectBar?: React.CSSProperties;
  selectColor?: React.CSSProperties;
} {
  const {
    context: { theme },
    props: { style, size }
  } = colorPicker;
  const { prepareStyles } = theme;

  return {
    root: prepareStyles({
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
      margin: 0
    },
    selectBar: {
      marginTop: size * 0.1,
      width: size,
      height: size * 0.025,
      backgroundImage: `linear-gradient(90deg, #000, #fff)`
    },
    selectColor: {
      height: size * 0.8125,
      width: size * 0.125,
      background: "yellowgreen"
    }
  };
}



export default ColorPicker;
