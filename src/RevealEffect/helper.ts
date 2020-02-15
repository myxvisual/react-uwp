import * as tinyColor from "tinycolor2";
import * as easing from "d3-ease";

export function px2numb(px: string | null) {
  return px ? Number(px.replace("px", "")) : 0;
}

export function getBorderRadius(style: CSSStyleDeclaration) {
  return {
      borderTopLeftRadius: px2numb(style.borderTopLeftRadius),
      borderTopRightRadius: px2numb(style.borderTopRightRadius),
      borderBottomLeftRadius: px2numb(style.borderBottomLeftRadius),
      borderBottomRightRadius: px2numb(style.borderBottomRightRadius)
  };
}

/**
 * Detect rectangle is overlap.
 * @param rect1 - DOMRect
 * @param rect2 - DOMRect
 */
export interface OverlapRect {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

export function isRectangleOverlap(rect1: OverlapRect, rect2: OverlapRect) {
    return Math.max(rect1.left, rect2.left) < Math.min(rect1.right, rect2.right) && Math.max(rect1.top, rect2.top) < Math.min(rect1.bottom, rect2.bottom);
}

/**
 * Detect cursor is inside to rect.
 * @param position The mouse cursor position.
 * @param rect The DOMRect.
 */
export function inRectInside(position: { left: number; top: number }, rect: DOMRect) {
  return (position.left > rect.left && position.left < rect.right && position.top > rect.top && position.top < rect.bottom);
}

export function drawRadiusRect(ctx: CanvasRenderingContext2D, rect: { x: number, y: number, w: number, h: number }, radius: { borderTopLeftRadius: number; borderTopRightRadius: number; borderBottomLeftRadius: number; borderBottomRightRadius: number; }) {
  const { x, y, w, h } = rect;
  const {
      borderTopLeftRadius,
      borderTopRightRadius,
      borderBottomLeftRadius,
      borderBottomRightRadius
  } = radius;

  ctx.beginPath();
  // tl start point.
  ctx.moveTo(x, y + borderTopLeftRadius);

  // tl radius.
  ctx.arcTo(x, y, x + borderTopLeftRadius, y, borderTopLeftRadius);

  // top line.
  ctx.lineTo(x + w - borderTopRightRadius, y);
  // tr radius.
  ctx.arcTo(x + w, y, x + w, y + borderTopRightRadius, borderTopRightRadius);

  // right line.
  ctx.lineTo(x + w, y + h - borderBottomRightRadius);

  // br radius.
  ctx.arcTo(x + w, y + h, x + w - borderBottomRightRadius, y + h, borderBottomRightRadius);
  // bottom line.
  ctx.lineTo(x + borderBottomLeftRadius, y + h);
  // bl radius.
  ctx.arcTo(x, y + h, x, y + h - borderBottomLeftRadius, borderBottomLeftRadius);

  // left line.
  ctx.lineTo(x, y + borderTopLeftRadius);
}


export enum DrawType {
  Fill,
  Stroke
}

export function drawElement2Ctx(ctx: CanvasRenderingContext2D, element: HTMLElement, drawType: DrawType = DrawType.Stroke, renderToScreen = true) {
  const rect = element.getBoundingClientRect() as DOMRect;
  let {
      left: x,
      top: y,
      width: w,
      height: h
  } = rect;
  if (!renderToScreen) {
    x = 0;
    y = 0;
  }
  const style = window.getComputedStyle(element);
  const {
      borderTopWidth,
      borderBottomWidth,
      borderLeftWidth,
      borderRightWidth
  } = style;
  const [topWidth, bottomWidth, leftWidth, rightWidth] = [borderTopWidth, borderBottomWidth, borderLeftWidth, borderRightWidth].map(t => Number.parseInt(t));
  const isExistBorder = [topWidth, bottomWidth, leftWidth, rightWidth].some(t => Boolean(t));
  const isStroke = drawType === DrawType.Stroke;

  const borderRadius = getBorderRadius(style);
  if (isStroke) {
      if (isExistBorder) {
          drawRadiusRect(ctx, { x, y, w, h }, borderRadius);
          ctx.fill();

          ctx.globalCompositeOperation = "destination-out";
          drawRadiusRect(ctx, { x: x + leftWidth, y: y + topWidth, w: w - leftWidth - rightWidth, h: h - topWidth - bottomWidth }, borderRadius);
          ctx.fill();
      } else {
          const offsetWidth = ctx.lineWidth / 2;
          drawRadiusRect(ctx, { x: x + offsetWidth, y: y + offsetWidth, w: w - ctx.lineWidth, h: h - ctx.lineWidth }, borderRadius);
          ctx.closePath();
          ctx.stroke();
      }
  } else {
      drawRadiusRect(ctx, { x, y, w, h }, borderRadius);
      ctx.fill();
  }

  return ctx;
}

export function drawRectAtRange(
  ctx: CanvasRenderingContext2D,
  config: { x: number; y: number; scale: number; size: number; },
  fillStyle: string | CanvasGradient | CanvasPattern = "#fff"
) {
  let { x, y, scale, size } = config;
  const width = size * scale;

  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = fillStyle;
  ctx.scale(width, width);
  ctx.fillRect(-.5, -.5, 1, 1);
  ctx.restore();
}

export function createRadialGradient(ctx: CanvasRenderingContext2D, colorStr: string, timingFunc = easing.easeQuadInOut) {
  const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
  const tColor = tinyColor(colorStr);
  const hsla = tColor.toHsl();
  const hslaStr = tColor.toHslString();

  const step = 0.01;
  for (let x = 1; x > 0; x -= step) {
      let alpha = timingFunc(x);
      gradient.addColorStop(x / 2, `hsla(${hsla.h}, ${hsla.h * 100}%, ${hsla.l * 100}%, ${(1 - alpha) * hsla.a})`);
  }

  return { hslaStr, gradient };
}

export function drawBorder(config: {
  borderCanvas: HTMLCanvasElement;
  hoverSize: number;
  borderWidth: number;
  gradient: CanvasGradient;
  x: number;
  y: number;
}) {
  const {
    borderCanvas,
    hoverSize,
    borderWidth,
    gradient,
    x,
    y
  } = config;
  const borderCtx = borderCanvas.getContext("2d");
  borderCtx.clearRect(0, 0, borderCanvas.width, borderCanvas.height);

  borderCtx.globalCompositeOperation = "source-over";
  drawRectAtRange(borderCtx, {
    x,
    y,
    scale: 1,
    size: hoverSize * 2
  }, gradient);

  borderCtx.globalCompositeOperation = "destination-in";
  borderCtx.lineWidth = borderWidth;
  borderCtx.fillStyle = "#fff";
  borderCtx.strokeStyle = "#fff";
  drawElement2Ctx(borderCtx, borderCanvas.parentElement, DrawType.Stroke, false);
}

export function drawHover(config: {
  hoverCanvas: HTMLCanvasElement;
  hoverSize: number;
  gradient: CanvasGradient;
  x: number;
  y: number;
}) {
  const {
    hoverCanvas,
    hoverSize,
    gradient,
    x,
    y
  } = config;
  const hoverCtx = hoverCanvas.getContext("2d");
  hoverCtx.clearRect(0, 0, hoverCanvas.width, hoverCanvas.height);

  drawRectAtRange(hoverCtx, {
    x,
    y,
    scale: 1,
    size: hoverSize * 2
  }, gradient);
}

export function updateCanvasRect(borderCanvasEl: HTMLCanvasElement) {
  const hoverCanvasEl = borderCanvasEl.previousElementSibling as HTMLCanvasElement;
  const parentEl = borderCanvasEl.parentElement as HTMLElement;
  if (!parentEl) return;
  const style = window.getComputedStyle(parentEl);
  const { width: elWidth, height: elHeight } = parentEl.getBoundingClientRect();
  const {
    borderTopWidth,
    borderLeftWidth
  } = style;

  const btWidth = Number.parseInt(borderTopWidth);
  const blWidth = Number.parseInt(borderLeftWidth);
  const width = `${elWidth}px`;
  const height = `${elHeight}px`;

  const isSameBorderEl = borderCanvasEl.width === elWidth && borderCanvasEl.height === elHeight;
  const isSameHoverEl = hoverCanvasEl.width === elWidth && hoverCanvasEl.height === elHeight;

  const currStyle = {
    left: blWidth ? `${-blWidth}px` : "0px",
    top: btWidth ? `${-btWidth}px` : "0px",
    width,
    height,
    display: "block"
  } as CSSStyleDeclaration;
  if (!isSameBorderEl) {
    Object.assign(borderCanvasEl, { width: elWidth, height: elHeight });
    Object.assign(borderCanvasEl.style, currStyle);
  }
  if (!isSameHoverEl) {
    Object.assign(hoverCanvasEl, { width: elWidth, height: elHeight });
    Object.assign(hoverCanvasEl.style, currStyle);
  }
}
