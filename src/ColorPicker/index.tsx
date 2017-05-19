import * as React from "react";

export interface DataProps {
  title?: string;
}
export interface ColorPickerProps extends DataProps, React.HTMLAttributes<HTMLCanvasElement> {}

export class ColorPicker extends React.Component<ColorPickerProps, void> {
  static defaultProps: ColorPickerProps = {
    width: 200,
    height: 200
  };
  canvas?: HTMLCanvasElement;
  ctx?: CanvasRenderingContext2D;

  componentDidMount() {
    const _xPosition = 100;
    const _yPosition = 100;
    const _r = 50;
    const _pi_2 = Math.PI * 2;
    const _c = _r * _pi_2;

    this.ctx = this.canvas.getContext("2d");
    const { ctx } = this;
    this.setCanvas2devicePixelRatio();

    ctx.beginPath();
    ctx.moveTo(_xPosition, _yPosition);
    ctx.arc(_xPosition, _yPosition, _r, -_pi_2 / 360, 0, true);
    ctx.closePath();
    ctx.fillStyle = "red";
    ctx.fill();

    for (let i = 0; i < 360; i++) {
      ctx.beginPath();
      ctx.moveTo(_xPosition, _yPosition);
      ctx.arc(_xPosition, _yPosition, _r, 0, _pi_2 * i / 360, true);
      ctx.closePath();
      ctx.fillStyle = `hsl(${i}, 100%, 50%)`;
      ctx.fill();
    }
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
    const { ...attributes } = this.props;
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
