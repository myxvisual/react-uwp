interface PrefixAll {
	(style: React.CSSProperties): React.CSSProperties;
}
const prefix: PrefixAll = require("inline-style-prefix-all");
const prefixAll: PrefixAll = (style) => {
	style = prefix(style);
	for (const property in style) {
		let value = style[property];
		if (typeof value === "object") {
			if (Array.isArray(value) && property === "display") {
				style[property] = style[property].join("; display: ");
			} else { throw Error(`${property}: ${value} is Wrong!`); }
		}
	}
	return style;
};

export default prefixAll;
