import * as React from "react";
import Link, { LinkProps } from "../Link";

export default (props: LinkProps) => (
	<Link
		{...{
			style: { textDecoration: "underline" },
			children: "HyperLink",
			...props
		}}
	/>
);
