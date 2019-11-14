const now = performance.now();

const noiseCanvas = document.createElement("canvas");
const noiseCtx = noiseCanvas.getContext("2d");
const noiseSize = 100;
const noiseRectSize = Math.ceil(Math.sqrt(Math.pow(noiseSize, 2) * 2));
const noiseOffset = (noiseRectSize - noiseSize) / 2;
noiseCanvas.width = noiseRectSize;
noiseCanvas.height = noiseRectSize;

const cacheCanvas = document.createElement("canvas");
const cacheCtx = cacheCanvas.getContext("2d");
cacheCanvas.width = noiseSize;
cacheCanvas.height = noiseSize;
const cacheCenter = noiseSize / 2;

const drawCanvas = document.createElement("canvas");
const drawCtx = drawCanvas.getContext("2d");
const drawSize = 1000;
drawCanvas.width = drawSize;
drawCanvas.height = drawSize;

document.body.appendChild(noiseCanvas);
document.body.appendChild(cacheCanvas);
document.body.appendChild(drawCanvas);

const noiseImageData = noiseCtx.createImageData(noiseRectSize, noiseRectSize);
const pixels = noiseImageData.data;
const baseLight = .7;
const maxLight = 1;

const pixelSize = pixels.length;
for (let i = 0; i < pixelSize; i += 4) {
  pixels[i] = pixels[i + 1] = pixels[i + 2] = (baseLight + Math.random() * (maxLight - baseLight)) * 255; // Set a random gray
  pixels[i + 3] = 255; // 100% opaque
}
noiseCtx.putImageData(noiseImageData, 0, 0);

cacheCtx.save();
function setCacheNoise() {
  cacheCtx.restore();

  const randomNumb = Math.random();
  if (1) {
    const offset = Math.floor(randomNumb * noiseOffset);
    cacheCtx.translate(-offset, -offset);
    cacheCtx.drawImage(noiseCanvas, 0, 0);
    cacheCtx.translate(offset, offset);
  } else {
    const degrees = Math.PI / 180 * randomNumb * 360;
    cacheCtx.translate(cacheCenter, cacheCenter);
    cacheCtx.rotate(degrees);
    cacheCtx.drawImage(noiseCanvas, -cacheCenter, -cacheCenter);
  }
}

function drawPattern(x, y) {
  setCacheNoise();
  drawCtx.drawImage(cacheCanvas, x, y);
}

const lineX = Math.ceil(drawCanvas.width / noiseSize);
const lineY = Math.ceil(drawCanvas.height / noiseSize);


for (let x = 0; x < lineX; x++) {
  for (let y = 0; y < lineY; y++) {
    drawPattern(x * noiseSize, y * noiseSize);
  }
}

console.log(`run time by: ${performance.now() - now}ms`);
