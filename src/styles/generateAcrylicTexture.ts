import * as stackBlurCanvas from "stackblur-canvas";
import * as tinycolor2 from "tinycolor2";

export interface AcrylicTextureConfig {
  image: string;
  tintColor: string;
  blurSize?: number;
  callback?: (image?: string) => void;
}

const acrylicTextureMap = new Map<string, string>();
export default function generateAcrylicTexture(config: AcrylicTextureConfig) {
  let { image, tintColor, blurSize, callback } = config;
  blurSize = blurSize || 24;
  const configStr = JSON.stringify({ image, tintColor, blurSize });
  let acrylicTexture = acrylicTextureMap.get(configStr);

  function updatAcrylicTexture() {
    if (callback) callback(acrylicTexture);
    acrylicTextureMap.set(configStr, acrylicTexture);
  }

  if (acrylicTexture) {
    callback(acrylicTexture);
    return;
  }

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  const imageNode = new Image();
  imageNode.crossOrigin = "Anonymous";
  imageNode.src = image;

  imageNode.onload = () => {
    let { naturalWidth, naturalHeight } = imageNode;
    if (naturalWidth > 1000) {
      naturalHeight = naturalHeight / naturalWidth * 1000;
      naturalWidth = 1000;
    }
    if (naturalHeight > 1000) {
      naturalWidth = naturalWidth / naturalHeight * 1000;
      naturalHeight = 1000;
    }

    canvas.width = naturalWidth;
    canvas.height = naturalHeight;
    context.drawImage(imageNode, 0, 0, naturalWidth, naturalHeight);
    stackBlurCanvas.canvasRGBA(canvas, 0, 0, naturalWidth, naturalHeight, blurSize);

    context.fillStyle = tinycolor2(tintColor).toRgbString();
    context.fillRect(0, 0, naturalWidth, naturalHeight);
    if (HTMLCanvasElement.prototype.toBlob) {
      canvas.toBlob((blob) => {
        acrylicTexture = URL.createObjectURL(blob);
        updatAcrylicTexture();
      });
    } else if (HTMLCanvasElement.prototype["msToBlob"]) {
      const blob = canvas["msToBlob"]();
      acrylicTexture = URL.createObjectURL(blob);
      updatAcrylicTexture();
    } else {
      acrylicTexture = canvas.toDataURL("image/jpg");
      updatAcrylicTexture();
    }
  };
}


function generateNoise(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, width: number, height: number, noiseSize: number, opacity: number) {
  for (let x = 0; x < width; x++ ) {
    for (let y = 0; y < height; y++ ) {
      let numb = Math.floor( Math.random() * 60 );
      context.fillStyle = `rgba(${numb}, ${numb}, ${numb}, ${opacity})`;
      context.fillRect(x, y, noiseSize, noiseSize);
    }
  }

  return context.getImageData(0, 0, width, height);
}
