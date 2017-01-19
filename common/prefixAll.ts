interface PrefixAll {
	(style: React.CSSProperties): React.CSSProperties;
}
const Prefixer = require("inline-style-prefixer");

const prefixAll: PrefixAll = (style) => {
	const isServer = typeof window === "undefined";
	if (isServer) {
		const stylePrefixed = Prefixer.prefixAll(style) as React.CSSProperties;
		const isFlex = ["flex", "inline-flex"].includes(style.display);

		// We can't apply this join with react-dom:
		// #https://github.com/facebook/react/issues/6467
		if (isFlex) {
			stylePrefixed.display = stylePrefixed.display.join("; display: ") + ";";
		}
		return stylePrefixed;
	}
	const prefixer = new Prefixer({
		userAgent: navigator.userAgent
	});
	const stylePrefixed = prefixer.prefix(style) as React.CSSProperties;
	return stylePrefixed;
};

export default prefixAll;
