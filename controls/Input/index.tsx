import * as React from "react";

import ElementState from "../../components/ElementState";
import { fade } from "../../common/colorManipulator";
import { ThemeType } from "react-uwp/style/ThemeType";

let theme: ThemeType;
const defaultProps: InputProps = __DEV__ ? require("./devDefaultProps").default : {};

export interface DataProps {}
interface InputProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}
interface InputState {}

export default class Input extends React.Component<InputProps, InputState> {
	static defaultProps: InputProps = {
		...defaultProps,
		placeholder: "Input Component"
	};
	state: InputState = {};
	static contextTypes = { theme: React.PropTypes.object };

	render() {
		const { style, ...attributes } = this.props;
		theme = this.context.theme;

		return (
			<ElementState
				{...attributes}
				style={{
					outline: "none",
					padding: "5px 10px",
					fontSize: 14,
					transition: "all .25s 0s ease-in-out",
					color: theme.baseMedium,
					border: `2px solid ${theme.baseMediumLow}`,
					background: theme.baseLow,
					...style
				}}
				hoverStyle={{
					color: theme.baseMediumHigh,
					border: `2px solid ${theme.baseLow}`
				}}
				activeStyle={{
					color: theme.baseHigh,
					background: fade(theme.baseLow, 0.1),
					border: `2px solid ${fade(theme.accent, 0.75)}`
				}}
			>
				<input />
			</ElementState>
		);
	}
}
