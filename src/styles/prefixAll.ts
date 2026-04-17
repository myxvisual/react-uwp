import { prefixStyle } from "koss";

function prefixAll(): (style?: React.CSSProperties) => React.CSSProperties {
  return (style?: React.CSSProperties) => {
    if (!style) return style;

    const prefixedStyle: any = {};
    for (const prop in style) {
      if (Object.prototype.hasOwnProperty.call(style, prop)) {
        const value = style[prop];
        if (typeof value === "string") {
          // React uses camelCase, koss/css-vendor uses kebab-case
          const kebabProp = prop.replace(/[A-Z]/g, m => `-${m.toLowerCase()}`);
          const { supportedProp, supportedValue } = prefixStyle(kebabProp, value);
          
          // Convert back to camelCase for React
          const camelProp = supportedProp.replace(/-([a-z])/g, g => g[1].toUpperCase());
          prefixedStyle[camelProp] = supportedValue;
        } else {
          prefixedStyle[prop] = value;
        }
      }
    }
    return prefixedStyle as React.CSSProperties;
  };
}

export default prefixAll;
