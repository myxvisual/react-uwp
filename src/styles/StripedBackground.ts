export default function getStripedBackground(size = 4, firstColor = "#000", secondColor = "hsla(0, 0%, 0%, 0)") {
  return {
    background: `linear-gradient(45deg, ${firstColor} 25%, ${secondColor} 0, ${secondColor} 50%, ${firstColor} 0, ${firstColor} 75%, ${secondColor} 0)`,
    backgroundSize: `${size}px ${size}px`
  } as React.CSSProperties;
}
