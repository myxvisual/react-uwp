import * as React from "react";

import ElementState from "../ElementState";
import Icon from "../Icon";
import { ThemeType } from "../../styles/ThemeType";

const defaultProps: ButtonProps = __DEV__ ? require("./devDefaultProps").default : {};

export interface DataProps {
	borderSize?: string;
	hoverStyle?: React.CSSProperties;
	icon?: string;
	iconPosition?: "left" | "right";
}

export interface ButtonProps extends DataProps, React.HTMLAttributes<HTMLButtonElement> {}

export interface ButtonState {}

export default class Button extends React.Component<ButtonProps, ButtonState> {
	static defaultProps: ButtonProps = {
		...defaultProps,
		children: "Button",
		borderSize: "2px"
	};

	state: ButtonState = {};

	static contextTypes = { theme: React.PropTypes.object };
	context: { theme: ThemeType };

	refs: { container: HTMLButtonElement };

	render() {
		const {
			borderSize, style, hoverStyle, children, icon,
			iconPosition,
			...attributes
		} = this.props;
		const { theme } = this.context;

		return (
			<ElementState
				style={{
					background: attributes.disabled ? theme.baseMedium : theme.baseLow,
					cursor: attributes.disabled ? "not-allowed" : "pointer",
					color: attributes.disabled ? theme.baseMedium : theme.baseHigh,
					outline: "none",
					padding: "4px 16px",
					border: `${borderSize} solid transparent`,
					transition: "all ease-in-out .25s",
					display: "inline-bloc",
					...theme.prepareStyles(style),
				}}
				hoverStyle={{
					border: `2px solid ${theme.baseMediumLow}`,
					...theme.prepareStyles(hoverStyle),
				}}
				activeStyle={{ background: theme.baseMediumLow }}
				{...attributes}
			>
				{icon ? (iconPosition === "right" ? (
						<div>
							<span>{children}</span>
							<Icon style={{ padding: "0 4px" }}>{icon}</Icon>
						</div>
					) : (
						<div>
							<Icon style={{ padding: "0 4px" }}>{icon}</Icon>
							<span>{children}</span>
						</div>
					)) : (
					<button>
						{children}
					</button>
				)}
			</ElementState>
		);
	}
}
