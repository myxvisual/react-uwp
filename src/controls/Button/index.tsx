import * as React from "react";

import ElementState from "../ElementState";
import Tooltip from "../Tooltip";
import Icon from "../Icon";
import { ThemeType } from "../../styles/ThemeType";

export interface DataProps {
	borderSize?: string;
	hoverStyle?: React.CSSProperties;
	icon?: string;
	iconStyle?: React.CSSProperties;
	iconPosition?: "left" | "right";
	disable?: boolean;
	tooltip?: React.ReactElement<any> | string;
}

export interface ButtonProps extends DataProps, React.HTMLAttributes<HTMLButtonElement> {}

export interface ButtonState {}

export class Button extends React.PureComponent<ButtonProps, {}> {
	static defaultProps: ButtonProps = {
		children: "Button",
		borderSize: "2px"
	};

	static contextTypes = { theme: React.PropTypes.object };
	context: { theme: ThemeType };

	refs: { container: HTMLButtonElement };

	render() {
		const {
			borderSize,
			style,
			hoverStyle,
			children,
			icon,
			iconStyle,
			iconPosition,
			disable,
			tooltip,
			...attributes
		} = this.props;
		const { theme } = this.context;

		const currIconStyle: React.CSSProperties = {
			padding: "0 4px",
			display: "inline",
			...theme.prepareStyles(iconStyle)
		};

		const normalRender =  (
			<ElementState
				style={{
					background: attributes.disabled ? theme.baseMedium : theme.baseLow,
					cursor: disable ? "not-allowed" : "pointer",
					color: disable ? theme.baseMedium : theme.baseHigh,
					outline: "none",
					padding: "4px 16px",
					border: `${borderSize} solid transparent`,
					transition: "all ease-in-out .25s",
					display: "inline-bloc",
					...theme.prepareStyles(style),
				}}
				hoverStyle={disable ? void 0 : {
					border: `2px solid ${theme.baseMediumLow}`,
					...theme.prepareStyles(hoverStyle),
				}}
				activeStyle={disable ? void 0 : { background: theme.baseMediumLow }}
				{...attributes}
			>
				{icon ? (iconPosition === "right" ? (
						<button>
							<span style={{ verticalAlign: "middle" }}>
								{children}
							</span>
							<Icon style={currIconStyle}>
								{icon}
							</Icon>
						</button>
					) : (
						<button>
							<Icon style={currIconStyle}>
								{icon}
							</Icon>
							<span style={{ verticalAlign: "middle" }}>
								{children}
							</span>
						</button>
					)) : (
					<button>
						{children}
					</button>
				)}
			</ElementState>
		);

		return tooltip ? (
			<Tooltip contentNode={tooltip}>
				{normalRender}
			</Tooltip>
		) : normalRender;
	}
}

export default Button;
