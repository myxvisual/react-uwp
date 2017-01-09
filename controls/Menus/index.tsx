import * as React from "react";

import { ThemeType } from "react-uwp/style/ThemeType";
let theme: ThemeType;

import * as styles from "./index.scss";
const defaultProps: MenusProps = __DEV__ ? require("./devDefaultProps").default : {};

export interface DataProps {
	direction?: "top" | "right" | "bottom" | "left";
}
interface MenusProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}
interface MenusState {}

export default class Menus extends React.Component<MenusProps, MenusState> {
	static defaultProps: MenusProps = { ...defaultProps, className: "" };
	static contextTypes = { theme: React.PropTypes.object };
	state: MenusState = {};

	enterHanlder = (e?: React.SyntheticEvent<HTMLDivElement>) => {
		const { style } = e.currentTarget;
		style.background = theme.accent;
		style.color = theme.baseHigh;
	}

	leaveHandler = (e?: React.SyntheticEvent<HTMLDivElement>) => {
		const { currentTarget: { style } } = e;
		style.background = theme.baseLow;
		style.color = theme.baseMediumHigh;
	}

	render() {
		const { direction, className, onMouseEnter, children, ...attributes } = this.props;
		theme = this.context.theme;

		return (
			<div
				{...attributes}
				style={{
					color: theme.baseMediumHigh,
					background: theme.baseLow
				}}
				onMouseLeave={this.leaveHandler}
				onMouseEnter={this.enterHanlder}
				className={`${styles.c} ${className}`
			}>
				{children}
			</div>
		);
	}
}
