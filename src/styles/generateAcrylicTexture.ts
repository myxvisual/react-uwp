import * as stackBlurCanvas from "stackblur-canvas";
import * as tinycolor2 from "tinycolor2";
import { toUrl } from "../utils/canvasHelper";

export interface AcrylicTextureConfig {
  image: string;
  tintColor: string;
  blurSize?: number;
  callback?: (image?: string, isCanvasFilter?: boolean) => void;
}

const acrylicTextureMap = new Map<string, { texture?: string; isCanvasFilter?: boolean; }>();
export default function generateAcrylicTexture(config: AcrylicTextureConfig) {
  let { image, tintColor, blurSize, callback } = config;
  blurSize = blurSize || 24;
  const configStr = JSON.stringify({ image, tintColor, blurSize });
  let acrylicTexture = acrylicTextureMap.get(configStr);

  function updateAcrylicTexture() {
    if (callback) callback(acrylicTexture.texture, acrylicTexture.isCanvasFilter);
    acrylicTextureMap.set(configStr, acrylicTexture);
  }

  if (acrylicTexture) {
    callback(acrylicTexture.texture, acrylicTexture.isCanvasFilter);
    return;
  } else {
    acrylicTexture = {};
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

    const fillRect = () => {
      context.fillStyle = tinycolor2(tintColor).toRgbString();
      context.fillRect(0, 0, naturalWidth, naturalHeight);
    };
    const drawImage = () => {
      context.drawImage(imageNode, 0, 0, naturalWidth, naturalHeight);
    };
    // const now = performance.now();
    // blur image.
    const isCanvasFilter = false && "filter" in context; // canvas filter is not good.
    if (isCanvasFilter) {
      context.filter = `blur(${blurSize}px)`;
      drawImage();
      context.filter = "blur(0px)";
      fillRect();
    } else {
      drawImage();
      stackBlurCanvas.canvasRGBA(canvas, 0, 0, naturalWidth, naturalHeight, blurSize);
      fillRect();
    }
    // console.log(performance.now() - now);

    toUrl(canvas, imageUrl => {
      acrylicTexture.texture = imageUrl;
      acrylicTexture.isCanvasFilter = isCanvasFilter;
      updateAcrylicTexture();
    });
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
