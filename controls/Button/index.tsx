import * as React from "react";

import ElementState from "../../components/ElementState";
import { ThemeType } from "react-uwp/style/ThemeType";

let theme: ThemeType;
const defaultProps: ButtonProps = __DEV__ ? require("./devDefaultProps").default : {};

interface EventHanlder {
	(e?: React.SyntheticEvent<HTMLButtonElement>): void;
}
export interface DataProps {
	borderSize?: string;
}
interface ButtonProps extends DataProps, React.HTMLAttributes<HTMLButtonElement> {}
interface ButtonState {}
export default class Button extends React.Component<ButtonProps, ButtonState> {
	static defaultProps: ButtonProps = {
		...defaultProps,
		borderSize: "2px"
	};
	state: ButtonState = {};
	static contextTypes = { theme: React.PropTypes.object };
	refs: { container: HTMLButtonElement };

	render() {
		const {
			borderSize, children,
			...attributes
		} = this.props;
		theme = this.context.theme;

		return (
			<ElementState
				style={{
					background: theme.baseLow,
					color: theme.baseMediumHigh,
					display: "flex",
					padding: "5px 20px",
					...attributes.style,
					border: `${borderSize} solid transparent`
				}}
				hoverStyle={{
					border: `${this.props.borderSize} solid ${theme.baseMediumLow}`
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
