export default function (r = 255, g = 255, b = 255, resultIsArray = false) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = (max + min) / 2;
  let s = h;
  let l = h;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return resultIsArray ? [
    (h * 100 + 0.5) | 0,
    (s * 100 + 0.5) | 0,
    (l * 100 + 0.5) | 0
  ] : `hsl(${[
    (h * 100 + 0.5) | 0,
    `${(s * 100 + 0.5) | 0}%`,
    `${(l * 100 + 0.5) | 0}%`
  ].join(", ")})`;
}
