interface PrefixAll {
	(style: React.CSSProperties): React.CSSProperties;
}
const prefix: PrefixAll = require("react-prefixer");
const prefixAll: PrefixAll = (style) => {
	style = prefix(style);
	return style;
};

export default prefixAll;
