import * as React from "react";

import ElementState from "../../components/ElementState";
import { ThemeType } from "../../style/ThemeType";

let theme: ThemeType;
const defaultProps: IconButtonProps = __DEV__ ? require("./devDefaultProps").default : {};

export interface DataProps {
	hoverStyle?: React.CSSProperties;
}
interface IconButtonProps extends DataProps, React.HTMLAttributes<HTMLButtonElement> {}
interface IconButtonState {}

export default class IconButton extends React.Component<IconButtonProps, IconButtonState> {
	static defaultProps: IconButtonProps = {
		...defaultProps
	};
	state: IconButtonState = {};
	static contextTypes = { theme: React.PropTypes.object };

	render() {
		const { style, hoverStyle, children, ...attributes } = this.props;
		theme = this.context.theme;

		return (
			<ElementState
				{...attributes}
				style={{
					fontFamily: "Segoe MDL2 Assets",
					transition: "all .25s 0s ease-in-out",
					userSelect: "none",
					background: theme.altHigh,
					border: "none",
					outline: "none",
					fontSize: 22,
					cursor: "pointer",
					color: theme.baseHigh,
					padding: 4,
					...style
				}}
				hoverStyle={hoverStyle || {
					background: theme.accent,
				}}
			>
				<button {...attributes}>{children || "&#xE73E;"}</button>
			</ElementState>
		);
	}
}
