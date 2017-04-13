import * as React from "react";

import { ThemeType } from "../../styles/ThemeType";

export interface DataProps {
	hoverStyle?: React.CSSProperties;
	focusStyle?: React.CSSProperties;
	inputStyle?: React.CSSProperties;
	onChangeValue?: (value: string) => void;
	leftNode?: any;
	rightNode?: any;
}

type Attributes = React.HTMLAttributes<HTMLDivElement> | React.HTMLAttributes<HTMLInputElement>;

export interface InputProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}
export interface InputState {
	hovered?: boolean;
	focused?: boolean;
}
const emptyFunc = () => {};
export default class Input extends React.Component<InputProps, InputState> {
	static defaultProps: InputProps = {
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

	handleHover = (e?: React.FocusEvent<HTMLDivElement>) => {
		this.setState({ hovered: true });
	}

	handleUnHover = (e?: React.FocusEvent<HTMLDivElement>) => {
		this.setState({ hovered: false });
	}

	handleFocus = (e?: React.FocusEvent<HTMLInputElement>) => {
		this.setState({ focused: true });
		this.props.onFocus(e as any);
	}

	handleBlur = (e?: React.FocusEvent<HTMLInputElement>) => {
		this.setState({ focused: false });
		this.props.onBlur(e as any);
	}

	setValue = (value: string) => this.refs.input.value = value;

	getValue = () => this.refs.input.value;

	render() {

		const {
			hoverStyle, // tslint:disable-line:no-unused-variable
			focusStyle, // tslint:disable-line:no-unused-variable
			leftNode,
			rightNode,
			style,
			inputStyle,
			onChangeValue,
			children,
			...attributes
		} = this.props;
		const { hovered, focused } = this.state;
		const haveChild = leftNode || rightNode;
		const { theme } = this.context;

		return (
			<div
				onMouseEnter={this.handleHover}
				onMouseLeave={this.handleUnHover}
				style={theme.prepareStyles({
					height: 32,
					width: 296,
					padding: haveChild ? "0 10px" : void 0,
					fontSize: 15,
					display: "flex",
					flexDirection: "row",
					alignItems: "center",
					color: "#000",
					background: focused ? "#fff" : theme.altHigh,
					border: focused ? `2px solid ${this.context.theme.accent}` : hovered ? `2px solid ${theme.baseMedium}` : `2px solid ${theme.baseLow}`,
					transition: "all .25s",
					...style,
				})}
			>
				{leftNode}
				<input
					ref="input"
					{...attributes as any}
					style={theme.prepareStyles({
						color: focused ? "#000" : theme.baseHigh,
						width: "100%",
						height: "100%",
						background: "none",
						border: "none",
						transition: "all .25s",
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
				{children}
			</div>
		);
	}
}
