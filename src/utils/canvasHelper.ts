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
