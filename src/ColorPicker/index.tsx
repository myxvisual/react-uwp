import * as React from "react";

export interface DataProps {
  title?: string;
  size?: number;
}
export interface ColorPickerProps extends DataProps, React.HTMLAttributes<HTMLCanvasElement> {}

export class ColorPicker extends React.Component<ColorPickerProps, void> {
  static defaultProps: ColorPickerProps = {
    size: 200
  };
  canvas?: HTMLCanvasElement;
  ctx?: CanvasRenderingContext2D;

  componentDidMount() {
    const { size } = this.props;
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
    return (
      <canvas
        ref={canvas => this.canvas = canvas}
        {...attributes}
      >
        Your Browser not support canvas.
      </canvas>
    );
  }
}

export default ColorPicker;
