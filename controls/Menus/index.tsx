import * as React from "react";

import * as styles from "./index.scss";
const defaultProps: MenusProps = __DEV__ ? require("./devDefaultProps").default : {};

interface DataProps {}
interface MenusProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}
interface MenusState {}

export default class Menus extends React.Component<MenusProps, MenusState> {
	static defaultProps: MenusProps = { ...defaultProps, className: "" };
	state: MenusState = {};

	render() {
		const { className, children, ...attributes } = this.props;

		return (
			<div {...attributes} className={`${styles.c} ${className}`}>
				{children}
			</div>
		);
	}
}
