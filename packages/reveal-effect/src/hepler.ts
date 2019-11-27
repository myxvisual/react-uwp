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
  const [topWidth, bottomWidth, leftWidth, rightWidth] = [borderTopWidth, borderBottomWidth, borderLeftWidth, borderRightWidth].map(t => px2numb(t));
  const isExistBorder = [topWidth, bottomWidth, leftWidth, rightWidth].some(t => Boolean(t));
  const isStroke = drawType === DrawType.Stroke;

  const borderRadius = getBorderRadius(style);
  if (isStroke) {
      if (isExistBorder) {
          ctx.globalCompositeOperation = "source-over";
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
