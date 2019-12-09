export function toBlob(canvas: HTMLCanvasElement, callback?: (blob?: Blob) => void) {
  if (HTMLCanvasElement.prototype.toBlob) {
    canvas.toBlob(callback);
  } else if (HTMLCanvasElement.prototype["msToBlob"]) {
    const blob = canvas["msToBlob"]();
    if (callback) callback(blob);
  } else {
    callback(null);
  }
}

export function toUrl(canvas: HTMLCanvasElement, callback?: (imageUrl?: string) => void) {
  toBlob(canvas, blob => {
    let imageUrl: string;
    if (blob) {
      imageUrl = URL.createObjectURL(blob);
    } else {
      imageUrl = canvas.toDataURL("image/png");
    }

    if (callback) callback(imageUrl);
  });
}

let detectCanvas: HTMLCanvasElement;
let isSupportedWebGL: boolean;
export function isSupportWebGL() {
  if (isSupportedWebGL !== void 0) {
    return isSupportedWebGL;
  } else {
    if (!detectCanvas) detectCanvas = document.createElement("canvas");
    const gl = detectCanvas.getContext("webgl") || detectCanvas.getContext("experimental-webgl");
    isSupportedWebGL = Boolean(gl && gl instanceof WebGLRenderingContext);

    return isSupportedWebGL;
  }
}

export interface Point {
  x: number;
  y: number;
}

export function deg2rad(deg: number) {
  return Math.PI / 180 * deg;
}

export function rad2deg(rad: number) {
  return rad / Math.PI * 180;
}

export function getRadEndPos(pos: Point, radius: number, rad: number) {
  return { x: pos.x + radius * Math.cos(rad), y: pos.y + radius * Math.sin(rad) };
}

export function getRegularPolygon(center= { x: 0, y: 0 }, radius = 1, angleSize = 4) {
  const isDoublePolygon = angleSize % 2 === 0;
  const singleRad = (angleSize - 2) * Math.PI / angleSize;
  const singleAngle = 360 / angleSize;
  const rads: number[] = [];
  const angles: number[] = [];
  const points: Point[] = [];
  const offsetRad = isDoublePolygon ? (Math.PI / 2 - singleRad / 2) : Math.PI / 2;
  // Set polygon position is vertical.
  const offsetAngle = isDoublePolygon ? (90 - singleAngle / 2) : 90;

  for (let ind = 0; ind < angleSize; ind++) {
    const rad = (ind * singleRad + offsetRad) % (Math.PI * 2);
    const angle = (ind * singleAngle + offsetAngle) % 360;
    const point = getRadEndPos(center, radius, rad);
    rads.push(rad);
    angles.push(angle);
    points.push(point);
  }

  return {
    rads,
    angles,
    points
  };
}

export function isPatternRegularPolygon(sides: number) {
  const insideAngle = 360 / sides;
  const outSideAngle = 180 - insideAngle;

  // result is [1, 3, 4, 6].
  return 360 % outSideAngle === 0;
}
