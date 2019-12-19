const Prefixer = require("inline-style-prefixer");
import IS_NODE_ENV from "../utils/nodeJS/IS_NODE_ENV";
import { replace2Dashes } from "./StyleManager";

const flexArr = ["flex", "inline-flex"];

const arrayProperties = {
  "flex": "",
  "inline-flex": ""
};

function prefixAll(): (style?: React.CSSProperties) => React.CSSProperties {
  const prefixer =  new Prefixer({ userAgent: navigator.userAgent });
  return (style?: React.CSSProperties) => {
    if (style) {
      const prefixedStyle = IS_NODE_ENV ? Prefixer.prefixAll(style) : prefixer.prefix(style);

      if (IS_NODE_ENV) {
        const { display } = style;
        if (display && flexArr.includes(display)) {
          // We can't apply this join with react-dom:
          // #https://github.com/facebook/react/issues/6467
          prefixedStyle.display = arrayProperties[display] || (arrayProperties[display] = prefixedStyle.display.map(t => replace2Dashes(t)).join("; display: "));
        }
      }

      return prefixedStyle;
    }
  };
}

export default prefixAll;
