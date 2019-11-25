const baseLight = 0;
const maxLight = 1;

function createNoiseTexture(
  width = window.innerWidth,
  height = window.innerHeight,
  getPixels = ratio => {
    const pixels = [];
    pixels[0] = pixels[1] = pixels[2] = 255;
    pixels[3] = (baseLight + ratio * (maxLight - baseLight)) * 255;
    return pixels;
  }
) {
  const now = performance.now();

  const noiseCanvas = document.createElement("canvas");
  const noiseCtx = noiseCanvas.getContext("2d");
  noiseCanvas.width = width;
  noiseCanvas.height = height;
  document.body.appendChild(noiseCanvas);

  const noiseImageData = noiseCtx.createImageData(width, height);
  const pixels = noiseImageData.data;

  const pixelSize = pixels.length;
  for (let i = 0; i < pixelSize; i += 4) {
    const newPixels = getPixels(Math.random());
    pixels[i] = newPixels[0];
    pixels[i + 1] = newPixels[1];
    pixels[i + 2] = newPixels[2];
    pixels[i + 3] = newPixels[3];
  }
  noiseCtx.putImageData(noiseImageData, 0, 0);

  document.body.style.background = "yellowgreen";
  console.log(`run time by: ${performance.now() - now}ms`);
}


function createNoiseTextureByGL(
  width = window.innerWidth,
  height = window.innerHeight,
  getPixels = ratio => {
    const pixels = [];
    pixels[0] = pixels[1] = pixels[2] = 255;
    pixels[3] = (baseLight + ratio * (maxLight - baseLight)) * 255;
    return pixels;
  }
) {
  const now = performance.now();

  const noiseCanvas = document.createElement("canvas");
  const gl = noiseCanvas.getContext("webgl");
  noiseCanvas.width = width;
  noiseCanvas.height = height;
  document.body.appendChild(noiseCanvas);

  document.body.style.background = "yellowgreen";
  console.log(`run time by: ${performance.now() - now}ms`);
}

createNoiseTexture();
