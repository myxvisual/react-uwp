export default function getStripedBackground(size = 4, firstColor = "#000", secondColor = "hsla(0, 0%, 0%, 0.85)"): React.CSSProperties {
  return {
    background: `linear-gradient(45deg, ${firstColor} 25%, ${secondColor} 0px, ${secondColor} 50%, ${firstColor} 0px, ${firstColor} 75%, ${secondColor} 0px) 0% 0% / ${size}px ${size}px ${firstColor}`
  } as React.CSSProperties;
}
