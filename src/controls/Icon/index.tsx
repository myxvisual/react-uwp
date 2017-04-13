import * as React from "react";

import ElementState from "../ElementState";
import iconsType from "./icons";
const icons: any = iconsType;

import { ThemeType } from "../../styles/ThemeType";

export interface DataProps {
	hoverStyle?: React.CSSProperties;
}

export interface IconProps extends DataProps, React.HTMLAttributes<HTMLSpanElement> {}

export interface IconState {}

export default class Icon extends React.Component<IconProps, IconState> {
	static defaultProps: IconProps = {};

	state: IconState = {};

	context: { theme: ThemeType };
	static contextTypes = { theme: React.PropTypes.object };

	render() {
		const { style, hoverStyle, children, ...attributes } = this.props;
		const { theme } = this.context;

		return (
			<ElementState
				{...attributes}
				style={theme.prepareStyles({
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					verticalAlign: "middle",
					fontFamily: "Segoe MDL2 Assets",
					transition: "all .25s 0s ease-in-out",
					border: "none",
					outline: "none",
					userSelect: "none",
					fontSize: "inherit",
					cursor: "default",
					color: theme.baseHigh,
					...style
				})}
				hoverStyle={hoverStyle}
			>
				<span>{icons[children as any] || children}</span>
			</ElementState>
		);
	}
}
