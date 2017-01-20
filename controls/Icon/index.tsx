import * as React from "react";

import ElementState from "../../components/ElementState";
import { ThemeType } from "../../style/ThemeType";

const defaultProps: IconProps = __DEV__ ? require("./devDefaultProps").default : {};

export interface DataProps {
	hoverStyle?: React.CSSProperties;
}
interface IconProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}
interface IconState {}

export default class Icon extends React.Component<IconProps, IconState> {
	static defaultProps: IconProps = {
		...defaultProps
	};
	state: IconState = {};
	context: { theme: ThemeType };
	static contextTypes = { theme: React.PropTypes.object };

	render() {
		const { style, hoverStyle, children, ...attributes } = this.props;
		const { theme } = this.context;

		return (
			<ElementState
				{...attributes}
				style={{
					fontFamily: "Segoe MDL2 Assets",
					transition: "all .25s 0s ease-in-out",
					userSelect: "none",
					fontSize: 22,
					cursor: "default",
					color: theme.baseHigh,
					...style
				}}
				hoverStyle={hoverStyle || { color: theme.accent }}
			>
				<span>{children || "&#xE73E;"}</span>
			</ElementState>
		);
	}
}
