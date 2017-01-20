import * as React from "react";

import ElementState from "../../components/ElementState";
import { ThemeType } from "../../style/ThemeType";

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
	context: { theme: ThemeType };

	handleFocus = (e?: React.SyntheticEvent<HTMLInputElement>) => {
		e.currentTarget.style.color = this.context.theme.baseHigh;
	}

	handleMouseLeave = (e?: React.SyntheticEvent<HTMLInputElement>) => {
		e.currentTarget.style.color = this.context.theme.baseMediumHigh;
	}

	render() {
		// tslint:disable-next-line:no-unused-variable
		const { hoverStyle, activeStyle, leftNode, rightNode, style, inputStyle, ...attributes } = this.props;
		const haveChild = leftNode || rightNode;
		const { theme } = this.context;
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
						style={theme.prepareStyles({
							color: theme.baseMedium,
							width: "100%",
							background: "none",
							border: "none",
							...inputStyle,
						})}
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
