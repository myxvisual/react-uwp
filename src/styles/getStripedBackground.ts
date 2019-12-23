export interface Config {
  size?: number;
  primaryColor?: string;
  secondaryColor?: string;
  direction?: "ltr" | "rtl";
}

export function getStripedBackground(config?: Config) {
  let { size, primaryColor, secondaryColor, direction } = config || {} as Config;
  size = size || 4;
  primaryColor = primaryColor || "#000";
  secondaryColor =  secondaryColor || "#fff";
  direction = direction || "ltr";
  const isLtr = direction === "ltr";

  return `linear-gradient(${isLtr ? 45 : 135}deg, ${primaryColor} 25%, ${secondaryColor} 0px, ${secondaryColor} 50%, ${primaryColor} 0px, ${primaryColor} 75%, ${secondaryColor} 0px) 0% 0% / ${size}px ${size}px ${primaryColor}`;
}

export default getStripedBackground;
