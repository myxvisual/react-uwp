import * as React from "react";

import ElementState from "../../components/ElementState";
import { ThemeType } from "react-uwp/style/ThemeType";

let theme: ThemeType;
const defaultProps: MenusProps = __DEV__ ? require("./devDefaultProps").default : {};

export interface DataProps {
	direction?: "top" | "right" | "bottom" | "left";
}
interface MenusProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}
interface MenusState {}

export default class Menus extends React.Component<MenusProps, MenusState> {
	static defaultProps: MenusProps = { ...defaultProps };
	static contextTypes = { theme: React.PropTypes.object };
	state: MenusState = {};

	render() {
		const { direction, children, ...attributes } = this.props;
		theme = this.context.theme;

		return (
			<ElementState
				{...attributes}
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
				<div>{children}</div>
			</ElementState >
		);
	}
}
