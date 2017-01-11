import * as React from "react";

import setStyleToElement from "../../common/setStyleToElement";
import ElementState from "../../components/ElementState";
import { ThemeType } from "react-uwp/style/ThemeType";
import * as styles from "./index.scss";

let theme: ThemeType;
const defaultProps: MenusProps = __DEV__ ? require("./devDefaultProps").default : {};

export interface DataProps {
	direction?: "top" | "right" | "bottom" | "left";
	title?: string;
}
interface MenusProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}
interface MenusState {
	showItems?: boolean;
	height?: string;
	width?: string;
	borderWidth?: string;
}

export default class Menus extends React.Component<MenusProps, MenusState> {
	static defaultProps: MenusProps = {
		...defaultProps,
		className: "",
		direction: "bottom"
	};
	static contextTypes = { theme: React.PropTypes.object };
	state: MenusState = {};
	refs: { container: ElementState; itmesContainer: HTMLDivElement };
	itemsElm: HTMLDivElement[] = [];

	toggleShowItems = (e?: React.SyntheticEvent<HTMLDivElement> | boolean) => {
		const { direction, children } = this.props;
		const setToState = typeof e === "boolean";
		let { showItems } = this.state;
		if (setToState) showItems = Boolean(e);
		const { width, height, borderWidth } = window.getComputedStyle(this.refs.container.getDOM());
		this.setState((prevState, prevProps) => {
			return { showItems: true, width, height, borderWidth };
		});
	}

	getPxNumber = (str: string | number) => typeof str === "string" ? Number(str.slice(0, str.length - 2)) : str;

	addPxStr = (str1: string, str2: string) => `${this.getPxNumber(str1) + this.getPxNumber(str2)}`

	getItemStyle = () => {
		const { direction, children } = this.props;
		const { showItems, width, height, borderWidth } = this.state;
		const baseStyle: React.CSSProperties = {
			pointerEvents: "all",
			width,
			overflow: showItems ? "visible" : "hidden",
			maxHeight: showItems ? `${React.Children.count(children) * this.getPxNumber(height)}px` : 0
		};
		switch (direction) {
			case "bottom": {
				return {
					top: height,
					...baseStyle
				};
			}
			case "left": {
				return {
					top: 0,
					right: width,
					...baseStyle
				};
			}
			case "right": {
				return {
					top: 0,
					left: width,
					...baseStyle
				};
			}
			default: {
				break;
			}
		}
	}

	render() {
		const { style, direction, title, children, className, ...attributes } = this.props;
		const { showItems, width, height, borderWidth } = this.state;
		theme = this.context.theme;

		const baseStyle: React.CSSProperties = {
			height: style.height,
			width: style.width,
			color: theme.baseMediumHigh,
			background: theme.altHigh,
			fontSize: 14
		};
		const baseHoverStyle: React.CSSProperties = {
			color: theme.baseHigh,
			background: theme.accentDarker1
		};

		return (
			<ElementState
				{...attributes}
				ref="container"
				className={`${styles.c} ${className}`}
				style={{
					...style,
					...baseStyle,
					pointerEvents: showItems ? "none" : "all"
				}}
				hoverStyle={showItems ? void(0) : baseHoverStyle}
			>
				<div onClick={this.toggleShowItems} >
					<p>{title}</p>
					<div
						ref="itmesContainer"
						className={styles.cItem}
						style={this.getItemStyle()}
					>
						{React.Children.map(children, (child, index) => (
							<ElementState
								key={`${index}`}
								className={styles.cItemItems}
								style={{
									...baseStyle,
									border: `3px solid ${theme.altHigh}`
								}}
								hoverStyle={{
									...baseStyle,
									...baseHoverStyle,
									background: theme.accent,
									border: `3px solid ${theme.accentDarker1}`
								}}
							>
								<div>
									{child}
								</div>
							</ElementState>
						))}
					</div>
				</div>
			</ElementState >
		);
	}
}
