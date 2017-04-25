export default function(hex = "#000", resultIsArray = false) {
  hex = hex.replace("#", "");
  const length = hex.length;

  if (length > 6) {
    hex = hex.slice(0, 6);
  } else if (length < 6) {
    if (6 % length === 0) {
      hex = hex.repeat(6 / length);
    } else {
      hex = hex + "0".repeat(6 - length);
    }
  }

  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return resultIsArray ? [r, g, b] : `rgb(${r}, ${g}, ${b})`;
}
