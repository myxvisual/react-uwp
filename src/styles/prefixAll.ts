import { prefix } from "inline-style-prefixer";
import IS_NODE_ENV from "../utils/nodeJS/IS_NODE_ENV";
import { replace2Dashes } from "./StyleManager";

const flexArr = ["flex", "inline-flex"];
const flexDisplay: string[] = prefix({ display: "flex" }).display as any;
const inlineFlexDisplay: string[] = prefix({ display: "inline-flex" }).display as any;

const flexStyles = {
  "flex": {
    browser: flexDisplay.slice(-1)[0],
    nodeJS: flexDisplay.map(t => replace2Dashes(t)).join("; display: ")
  },
  "inline-flex": {
    browser: inlineFlexDisplay.slice(-1)[0],
    nodeJS: inlineFlexDisplay.map(t => replace2Dashes(t)).join("; display: ")
  }
};

function prefixAll(): (style?: React.CSSProperties) => React.CSSProperties {
  return (style?: React.CSSProperties) => {
    if (style) {
      const { display } = style;
      const prefixedStyle = prefix(style);

      if (display && flexArr.includes(display)) {
        // We can't apply this join with react-dom:
        // #https://github.com/facebook/react/issues/6467
        prefixedStyle.display = IS_NODE_ENV ? flexStyles[display as "flex"].nodeJS : flexStyles[display as "flex"].browser;
      }
      return prefixedStyle;
    }
  };
}

export default prefixAll;
