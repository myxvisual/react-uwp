import * as React from "react";

import { ThemeType } from "react-uwp/style/ThemeType";
let theme: ThemeType;

import * as styles from "./index.scss";
const defaultProps: ButtonProps = __DEV__ ? require("./devDefaultProps").default : {};

interface EventHanlder {
}
interface DataProps {
	borderSize?: string;
}
interface ButtonProps extends DataProps, React.HTMLAttributes<HTMLButtonElement> {}
interface ButtonState {}
export default class Button extends React.Component<ButtonProps, ButtonState> {
	static defaultProps: ButtonProps = {
		...defaultProps,
		className: "",
		borderSize: "2px"
	};
	state: ButtonState = {};
	static contextTypes = { theme: React.PropTypes.object };

	clickOrMouseEnterHandler = (e?: React.SyntheticEvent<HTMLButtonElement>) => {
		e.currentTarget.style.border = `${this.props.borderSize} solid ${theme.baseMediumLow}`;
	}

	mouseLeaveOrUpHandler = (e?: React.SyntheticEvent<HTMLButtonElement>, attributeFun?: (e?: React.SyntheticEvent<HTMLButtonElement>) => void) => {
		e.currentTarget.style.border = `${this.props.borderSize} solid transparent`;
	}

	render() {
		const {
			borderSize, className,
			onClick, onMouseDown, onMouseEnter, onMouseLeave, onTouchStart, onTouchEnd, children,
			...attributes
		} = this.props;
		theme = this.context.theme;

		return (
			<button
				{...attributes}
				className={`${styles.c} ${className}`}
				style={{
					background: theme.baseLow,
					color: theme.baseMediumHigh,
					padding: "5px 20px",
					...attributes.style,
					border: `${borderSize} solid transparent`
				}}
				onClick={(e) => { this.clickOrMouseEnterHandler(e); }}
				onMouseDown={this.clickOrMouseEnterHandler}
				onMouseEnter={this.clickOrMouseEnterHandler}
				onTouchStart={this.clickOrMouseEnterHandler}
				onMouseLeave={this.mouseLeaveOrUpHandler}
				onTouchEnd={this.mouseLeaveOrUpHandler}
			>
				{children}
			</button>
		);
	}
}
