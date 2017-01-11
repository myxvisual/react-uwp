interface PrefixAll {
	(style: React.CSSProperties): React.CSSProperties;
}
const prefix: PrefixAll = require("inline-style-prefix-all");
const prefixAll: PrefixAll = (style) => {
	style = prefix(style);
	for (const property in style) {
		let value = style[property];
		if (typeof value === "object") {
			if (Array.isArray(value)) {
				style[property] = value[value.length - 1];
			} else { throw Error(`${property}: ${value} is Wrong!`); }
		}
	}
	return style;
};

export default prefixAll;
