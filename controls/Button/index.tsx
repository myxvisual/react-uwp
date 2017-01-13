import * as React from "react";

import ElementState from "../../components/ElementState";
import { fade } from "../../common/colorManipulator";
import { ThemeType } from "react-uwp/style/ThemeType";

let theme: ThemeType;
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
	refs: { container: HTMLButtonElement };

	render() {
		const {
			borderSize, style, hoverStyle, children,
			...attributes
		} = this.props;
		theme = this.context.theme;

		return (
			<ElementState
				style={{
					background: theme.baseLow,
					color: theme.baseMedium,
					cursor: "pointer",
					outline: "none",
					display: "flex",
					padding: "5px 20px",
					border: `${borderSize} solid transparent`,
					transition: "all ease-in-out .25s",
					...style,
				}}
				hoverStyle={{
					border: `2px solid ${theme.baseMediumLow}`,
					...hoverStyle
				}}
				activeStyle={{
					background: theme.baseMedium
				}}
				{...attributes}
			>
				<button>
					{children}
				</button>
			</ElementState>
		);
	}
}
