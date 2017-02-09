import * as React from "react";

import ElementState from "../../components/ElementState";
import { ThemeType } from "../../styles/ThemeType";

const defaultProps: ButtonProps = __DEV__ ? require("./devDefaultProps").default : {};

export interface DataProps {
	borderSize?: string;
	hoverStyle?: React.CSSProperties;
}

interface ButtonProps extends DataProps, React.HTMLAttributes<HTMLButtonElement> {}

interface ButtonState {}

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
			borderSize, style, hoverStyle, children,
			...attributes
		} = this.props;
		const { theme } = this.context;

		return (
			<ElementState
				style={{
					background: theme.chromeMedium,
					color: theme.baseHigh,
					cursor: "pointer",
					outline: "none",
					padding: "5px 20px",
					border: `${borderSize} solid transparent`,
					transition: "all ease-in-out .25s",
					...theme.prepareStyles(style),
				}}
				hoverStyle={{
					border: `2px solid ${theme.baseMediumLow}`,
					...theme.prepareStyles(hoverStyle),
				}}
				activeStyle={{ background: theme.baseMediumLow }}
				{...attributes}
			>
				<button>
					{children}
				</button>
			</ElementState>
		);
	}
}
