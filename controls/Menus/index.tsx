import * as React from "react";

import ElementState from "../../components/ElementState";
import { ThemeType } from "react-uwp/style/ThemeType";
import * as styles from "./index.scss";

let theme: ThemeType;
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

	render() {
		const { direction, children, className, ...attributes } = this.props;
		theme = this.context.theme;

		return (
			<ElementState
				{...attributes}
				className={`${styles.c} ${className}`}
				style={{
					padding: "5px 20px",
					userSelect: "none",
					cursor: "pointer",
					...attributes.style,
					color: theme.baseMediumHigh,
					background: theme.accent,
					transition: "all ease-in-out .25s"
				}}
				hoverStyle={{
					color: theme.baseHigh,
					background: theme.accentDarker1
				}}
			>
				<div><p>{children}</p></div>
			</ElementState >
		);
	}
}
