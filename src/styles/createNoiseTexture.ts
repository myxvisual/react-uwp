const now = performance.now();
const patternCanvas = document.createElement("canvas");
const patternCtx = patternCanvas.getContext("2d");
const patternSize = 100;
const patternRectSize = patternSize * 4;
patternCanvas.width = patternRectSize;
patternCanvas.height = patternRectSize;

const drawCanvas = document.createElement("canvas");
const drawCtx = drawCanvas.getContext("2d");
const drawSize = 1000;
drawCanvas.width = drawSize;
drawCanvas.height = drawSize;

document.body.appendChild(patternCanvas);
document.body.appendChild(drawCanvas);

const noiseImageData = patternCtx.createImageData(patternRectSize, patternRectSize);
const pixels = noiseImageData.data;
const baseLight = .7;
const maxLight = 1;

const pixelSize = pixels.length;
for (let i = 0; i < pixelSize; i += 4) {
  pixels[i] = pixels[i + 1] = pixels[i + 2] = (baseLight + Math.random() * (maxLight - baseLight)) * 255; // Set a random gray
  pixels[i + 3] = 255; // 100% opaque
}
patternCtx.putImageData(noiseImageData, 0, 0);


function getNoiseOffset() {
  return Math.floor(Math.random() * (patternRectSize - patternSize * 2));
}

function drawPattern(x, y) {
  const imageData = patternCtx.getImageData(getNoiseOffset(), getNoiseOffset(), patternSize, patternSize);
  drawCtx.putImageData(imageData, x, y);
}

const lineX = Math.ceil(drawCanvas.width / patternSize);
const lineY = Math.ceil(drawCanvas.height / patternSize);

for (let x = 0; x < lineX; x++) {
  for (let y = 0; y < lineY; y++) {
    drawPattern(x * patternSize, y * patternSize);
  }
}

console.log(`run time by: ${performance.now() - now}ms`);
