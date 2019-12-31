export function paramCase(str: string) {
  return str.replace(/[A-Z]/g, $1 => `-${$1.toLowerCase()}`);
}

export interface TagConfig {
  tag: string;
  attributes?: Object;
  children?: TagConfig[];
}

export function createTagString(tagConfig: TagConfig) {
  const { tag, attributes, children } = tagConfig;
  const hadChild = Boolean(children);

  let elStr = `<${tag}${hadChild ? ">" : ""}`;

  if (attributes) {
    elStr += getAttributesString(attributes);
  }

  if (hadChild) {
    for (const child of children) {
      elStr += createTagString(child);
    }
    elStr += `</${tag}>`;
  } else {
    elStr += " />";
  }

  return elStr;
}

// @link https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feDropShadow
export function createFeDropShadow(attributes?: React.SVGAttributes<SVGFEDropShadowElement>) {
  const elStr = createTagString({ tag: "feDropShadow", attributes });

  return elStr;
}

export function getAttributesString(attribute: Object) {
  let attributesStr = "";
  if (!attribute) return attributesStr;

  for (let key in attribute) {
    const value = attribute[key];
    if (value !== void 0) {
      const paramCaseKey = paramCase(key);
      attributesStr += ` ${paramCaseKey}="${value}"`;
    }
  }

  return attributesStr;
}

export function getProtrudingSquares(config: { mainColor: string; shadowColor: string; opacity: number; }) {
  const dataImageType = `data:image/svg+xml;charset=utf-8,`;
  let svgText = `<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 200 200'>
<defs>
    <linearGradient id='a' gradientUnits='userSpaceOnUse' x1='100' y1='33' x2='100' y2='-3'>
        <stop offset='0' stop-color='${config.shadowColor}' stop-opacity='0'/>
        <stop offset='1' stop-color='${config.shadowColor}' stop-opacity='1'/>
    </linearGradient>
    <linearGradient id='b' gradientUnits='userSpaceOnUse' x1='100' y1='135' x2='100' y2='97'>
        <stop offset='0' stop-color='${config.shadowColor}' stop-opacity='0'/>
        <stop offset='1' stop-color='${config.shadowColor}' stop-opacity='1'/>
    </linearGradient>
</defs>
<g fill='${config.mainColor}' fill-opacity='${config.opacity}'>
    <rect x='100' width='100' height='100'/>
    <rect y='100' width='100' height='100'/>
</g>
<g fill-opacity='0.5'>
    <polygon fill='url(#a)' points='100 30 0 0 200 0'/>
    <polygon fill='url(#b)' points='100 100 0 130 0 100 200 100 200 130'/>
</g>
</svg>`;
  svgText = encodeURIComponent(svgText);
  const backgroundStyle = " repeat";

  return dataImageType + svgText + backgroundStyle;
}

export interface StripedConfig {
  size?: number;
  primaryColor?: string;
  secondaryColor?: string;
  direction?: "ltr" | "rtl";
}

export function getStriped(config?: StripedConfig) {
  let { size, primaryColor, secondaryColor, direction } = config || {} as StripedConfig;
  size = size || 4;
  primaryColor = primaryColor || "#000";
  secondaryColor =  secondaryColor || "transparent";
  direction = direction || "ltr";
  const isLtr = direction === "ltr";

  return `linear-gradient(${isLtr ? 45 : 135}deg, ${primaryColor} 25%, ${secondaryColor} 0px, ${secondaryColor} 50%, ${primaryColor} 0px, ${primaryColor} 75%, ${secondaryColor} 0px) 0% 0% / ${size}px ${size}px ${primaryColor}`;
}

export function getDot(color = "#fff") {
  const dataImageType = `data:image/svg+xml;charset=utf-8,`;
  let svgText = `<svg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 16 16' style='enable-background:new 0 0 16 16' xml:space='preserve'><rect width='16' fill='none' height='16'/><rect x='0' y='0' fill='${color}' width='1' height='1'/></svg>`;
  svgText = encodeURIComponent(svgText);
  const backgroundStyle = " repeat";

  return dataImageType + svgText + backgroundStyle;
}

// console.log(createFeDropShadow({ dx: 22, dy: 22, floodColor: "#fff", floodOpacity: 3 }));
