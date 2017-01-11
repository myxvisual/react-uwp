declare module "inline-style-prefix-all" {
	import * as React from "react";

	export default function prefixAll(styles?: React.CSSProperties): React.CSSProperties;
}

interface PrefixAll {
	(style: React.CSSProperties): React.CSSProperties;
}