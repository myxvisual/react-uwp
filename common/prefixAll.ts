interface PrefixAll {
	(): (style: React.CSSProperties) => React.CSSProperties;
}
const Prefixer = require("inline-style-prefixer");

const prefixAll = () => {
	const { userAgent } = navigator || {} as any;
	const isServer = window === void(0);
	if (userAgent === void(0)) {
		return (style: React.CSSProperties) => {
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
		};
	}

	const prefixer = new Prefixer({ userAgent });
	return (style: React.CSSProperties) => prefixer.prefix(style) as React.CSSProperties;
};

export default prefixAll;
