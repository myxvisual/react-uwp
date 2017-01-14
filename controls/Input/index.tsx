import * as React from "react";

import ElementState from "../../components/ElementState";
import { fade } from "../../common/colorManipulator";
import { ThemeType } from "react-uwp/style/ThemeType";

let theme: ThemeType;
const defaultProps: InputProps = __DEV__ ? require("./devDefaultProps").default : {};

export interface DataProps {
	hoverStyle?: React.CSSProperties;
	activeStyle?: React.CSSProperties;
	inputStyle?: React.CSSProperties;
	leftNode?: any;
	rightNode?: any;
}
type Attributes = React.HTMLAttributes<HTMLDivElement> | React.HTMLAttributes<HTMLInputElement>
interface InputProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}
interface InputState {}

export default class Input extends React.Component<InputProps, InputState> {
	static defaultProps: InputProps = {
		...defaultProps,
		placeholder: "Input Component",
		inputStyle: {
			fontSize: 14,
			outline: "none",
			transition: "all .25s 0s ease-in-out",
		}
	};
	state: InputState = {};
	static contextTypes = { theme: React.PropTypes.object };

	handleFocus = (e?: React.SyntheticEvent<HTMLInputElement>) => {
		e.currentTarget.style.color = theme.baseHigh;
	}

	handleMouseLeave = (e?: React.SyntheticEvent<HTMLInputElement>) => {
		e.currentTarget.style.color = theme.baseMediumHigh;
	}

	render() {
		const { hoverStyle, activeStyle, leftNode, rightNode, style, inputStyle, ...attributes } = this.props;
		const haveChild = leftNode || rightNode;
		theme = this.context.theme;
		const styles = {
			style : {
				padding: "5px 10px",
				border: `2px solid ${theme.baseLow}`,
				color: theme.baseMedium,
				background: theme.altHigh,
				...style,
				...inputStyle,
			},
			hoverStyle: {
				color: theme.baseMediumHigh,
				border: `2px solid ${theme.baseMedium}`
			},
			activeStyle: {
				color: theme.baseHigh,
				border: `2px solid ${theme.accent}`
			}
		};

		return (haveChild
			?
			<ElementState {...styles}>
				<div>
					{leftNode}
					<input
						onFocus={this.handleFocus}
						onMouseLeave={this.handleMouseLeave}
						style={{
							color: theme.baseMedium,
							width: "100%",
							background: "none",
							border: "none",
							...inputStyle,
						}}
						{...attributes as any}
					/>
					{rightNode}
				</div>
			</ElementState>
			:
			<ElementState {...styles}>
				<input {...attributes as any}/>
			</ElementState>
		);
	}
}
