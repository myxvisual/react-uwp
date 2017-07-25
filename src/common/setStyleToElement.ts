const isUnitlessNumber = [
  "animationIterationCount",
  "borderImageOutset",
  "borderImageSlice",
  "borderImageWidth",
  "boxFlex",
  "boxFlexGroup",
  "boxOrdinalGroup",
  "columnCount",
  "flex",
  "flexGrow",
  "flexPositive",
  "flexShrink",
  "flexNegative",
  "flexOrder",
  "gridRow",
  "gridColumn",
  "fontWeight",
  "lineClamp",
  "lineHeight",
  "opacity",
  "order",
  "orphans",
  "tabSize",
  "widows",
  "zIndex",
  "zoom",

  // SVG-related properties
  "fillOpacity",
  "floodOpacity",
  "stopOpacity",
  "strokeDasharray",
  "strokeDashoffset",
  "strokeMiterlimit",
  "strokeOpacity",
  "strokeWidth"
];

export default function setStyleToElement(elm: HTMLElement, style: React.CSSProperties, setToCSSText = false) {
  let cssText = "";
  if (setToCSSText) {
    for (const property in style) {
      const propertyNow = [].map.call(property, (str: string) => str === str.toUpperCase() ? `-${str.toLowerCase()}` : str).join("");
      let value: any = style[property];
      if (typeof value === "number" && !isUnitlessNumber.includes(property)) value = `${value}px`;
      if (typeof value === "object") {
        if (Array.isArray(value)) {
          value = value[value.length - 1];
        } else { throw Error(`${propertyNow}: ${value} is Wrong!`); }
      }
      cssText += `${propertyNow}: ${value};`;
    }
    elm.style.cssText = cssText;
  } else {
    for (const property in style) {
      const value: any = style[property];
      if (typeof value === "number" && !isUnitlessNumber.includes(property)) {
        style[property] = `${value}px`;
      }
    }
    Object.assign(elm.style, style);
  }
}
