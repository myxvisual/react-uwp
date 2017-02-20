import * as React from "react";
import Separator, { SeparatorProps } from "../Separator";

export default function AppBarSeparator(props: SeparatorProps) {
	return (
		<Separator
			direction="column"
			style={{
				height: 28,
				width: 2,
				margin: "auto 10px",
				...props.style,
			}}
		/>
	);
};
