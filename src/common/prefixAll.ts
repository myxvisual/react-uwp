export interface PrefixAll {
  (userAgent?: string): (style: React.CSSProperties) => React.CSSProperties;
}
const Prefixer = require("inline-style-prefixer");

import IS_NODE_ENV from "./nodeJS/IS_NODE_ENV";

function prefixAll(userAgent?: string | false): (style?: React.CSSProperties) => React.CSSProperties {
  const isServer = IS_NODE_ENV;

  if (userAgent === false) {
    return (style?: React.CSSProperties) => style;
  }

  if (!isServer && userAgent === void 0) {
    userAgent = navigator.userAgent;
  }

  if (!isServer || (isServer && (userAgent !== void 0 && userAgent !== "all"))) {
    const prefixer = new Prefixer({ userAgent });
    return (style?: React.CSSProperties) => {
      if (!style) return;
      return prefixer.prefix(style) as React.CSSProperties;
    };
  } else {
    return (style?: React.CSSProperties) => {
      if (!style) return;
      const stylePrefixed = Prefixer.prefixAll(style);
      const isFlex = ["flex", "inline-flex"].includes(style.display);

      // We can't apply this join with react-dom:
      // #https://github.com/facebook/react/issues/6467
      if (isFlex) {
        stylePrefixed.display = stylePrefixed.display.join("; display: ") + ";";
      }
      return stylePrefixed;
    };
  }
};

export default prefixAll;
