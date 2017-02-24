import * as React from "react";
import { findDOMNode } from "react-dom";

import ElementState from "../ElementState";
import { ThemeType } from "../../styles/ThemeType";

const defaultProps: InputProps = __DEV__ ? require("./devDefaultProps").default : {};

export interface DataProps {
	hoverStyle?: React.CSSProperties;
	focusStyle?: React.CSSProperties;
	inputStyle?: React.CSSProperties;
	onChangeValue?: (value: string) => void;
	leftNode?: any;
	rightNode?: any;
}

type Attributes = React.HTMLAttributes<HTMLDivElement> | React.HTMLAttributes<HTMLInputElement>

interface InputProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}
interface InputState {}
const emptyFunc = () => {};
export default class Input extends React.Component<InputProps, InputState> {
	static defaultProps: InputProps = {
		...defaultProps,
		placeholder: "Input Component",
		inputStyle: {
			fontSize: "inherit",
			outline: "none",
			transition: "all .25s 0s ease-in-out",
		},
		onFocus: emptyFunc,
		onBlur: emptyFunc,
		onChange: emptyFunc,
		onChangeValue: emptyFunc,
	};

	state: InputState = {};
	refs: { input: HTMLInputElement };

	static contextTypes = { theme: React.PropTypes.object };
	context: { theme: ThemeType };

	handleFocus = (e?: React.FocusEvent<HTMLInputElement>) => {
		e.currentTarget.style.color = this.context.theme.baseHigh;
		const rootElm = findDOMNode(this) as HTMLDivElement;
		rootElm.style.border = `2px solid ${this.context.theme.accent}`;
		this.props.onFocus(e as any);
	}

	handleBlur = (e?: React.FocusEvent<HTMLInputElement>) => {
		e.currentTarget.style.color = this.context.theme.baseHigh;
		const rootElm = findDOMNode(this) as HTMLDivElement;
		rootElm.style.border = `2px solid ${this.context.theme.baseLow}`;
		this.props.onBlur(e as any);
	}

	setValue = (value: string) => this.refs.input.value = value;

	getValue = () => this.refs.input.value;


	render() {
		// tslint:disable-next-line:no-unused-variable
		const { hoverStyle, focusStyle, leftNode, rightNode, style, inputStyle, onChangeValue, ...attributes } = this.props;
		const haveChild = leftNode || rightNode;
		const { theme } = this.context;
		const styles = {
			style: theme.prepareStyles({
				height: 32,
				width: 296,
				padding: haveChild ? 10 : void 0,
				fontSize: 15,
				display: "flex",
				flexDirection: "row",
				alignItems: "center",
				border: `2px solid ${theme.baseLow}`,
				color: theme.baseMedium,
				background: theme.altHigh,
				...style,
				...inputStyle,
			}),
			hoverStyle: {
				color: theme.baseMediumHigh,
				border: `2px solid ${theme.baseMedium}`,
				...theme.prepareStyles(hoverStyle)
			},
			focusStyle: {
				border: `2px solid ${this.context.theme.accent}`
			}
		};

		return (
			<ElementState {...styles}>
				<div>
					{leftNode}
					<input
						ref="input"
						{...attributes as any}
						style={theme.prepareStyles({
							color: theme.baseMedium,
							width: "100%",
							height: "100%",
							background: "none",
							border: "none",
							...inputStyle,
						})}
						onChange={(e) => {
							onChangeValue(e.currentTarget.value);
							attributes.onChange(e as any);
						}}
						onClick={this.handleFocus}
						onFocus={this.handleFocus}
						onBlur={this.handleBlur}
					/>
					{rightNode}
				</div>
			</ElementState>
		);
	}
}
