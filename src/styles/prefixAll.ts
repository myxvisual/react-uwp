import { prefix } from "inline-style-prefixer";

const flexArr = ["flex", "inline-flex"];
function prefixAll(): (style?: React.CSSProperties) => React.CSSProperties {
  return (style?: React.CSSProperties) => {
    if (style) {
      const isFlex = flexArr.includes(style.display);
      const prefixedStyle = prefix(style);

      // We can't apply this join with react-dom:
      // #https://github.com/facebook/react/issues/6467
      if (isFlex) {
        prefixedStyle.display = (prefixedStyle.display as any).join("; display: ");
      }
      return prefixedStyle;
    }
  };
}

export default prefixAll;
