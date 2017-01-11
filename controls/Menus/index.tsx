import * as React from "react";

import addArrayEvent from "../../common/addArrayEvent";
import removeArrayEvent from "../../common/removeArrayEvent";

import ElementState from "../../components/ElementState";
import { ThemeType } from "react-uwp/style/ThemeType";
import * as styles from "./index.scss";

let theme: ThemeType;
const defaultProps: MenusProps = __DEV__ ? require("./devDefaultProps").default : {};

export interface DataProps {
	direction?: "top" | "right" | "bottom" | "left";
	title?: string;
	canToggleShow?: boolean;
	showItems?: boolean;
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
	state: MenusState = { showItems: this.props.showItems };
	refs: { container: ElementState; itmesContainer: HTMLDivElement };
	itemsElm: HTMLDivElement[] = [];

	componentWillReceiveProps(nextProps: MenusProps) {
		this.setState({
			showItems: nextProps.showItems
		});
	}

	toggleShowItems = (e?: React.SyntheticEvent<HTMLDivElement> | boolean) => {
		const { direction, canToggleShow, children } = this.props;
		const setToState = typeof e === "boolean";
		let { showItems } = this.state;
		if (setToState) showItems = Boolean(e);
		const { width, height, borderWidth } = window.getComputedStyle(this.refs.container.getDOM());
		this.setState((prevState, prevProps) => {
			return { showItems: canToggleShow ? (!prevState.showItems) : true, width, height, borderWidth };
		});
	}

	unShowItems = () => this.toggleShowItems(false)

	getPxNumber = (str: string | number) => typeof str === "string" ? Number(str.slice(0, str.length - 2)) : str;

	addPxStr = (str1: string, str2: string) => `${this.getPxNumber(str1) + this.getPxNumber(str2)}`

	getItemStyle = () => {
		const { direction, children } = this.props;
		const { showItems, width, height, borderWidth } = this.state;
		const maxHeight = showItems ? `${React.Children.count(children) * this.getPxNumber(height)}px` : 0
		const baseStyle: React.CSSProperties = {
			pointerEvents: "all",
			width,
			overflow: showItems ? "visible" : "hidden",
			maxHeight: maxHeight
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
			case "top": {
				return {
					top: `-${maxHeight}`,
					left: 0,
					...baseStyle
				} as React.CSSProperties;
			}
			default: {
				break;
			}
		}
	}

	render() {
		const { style, direction, title, children, className, ...attributes } = this.props;
		delete attributes.showItems;
		const { showItems, width, height, borderWidth } = this.state;
		theme = this.context.theme;

		const baseStyle: React.CSSProperties = {
			height: style.height || height,
			width: style.width || width,
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
				hoverStyle={showItems ? void(0) : { ...baseHoverStyle }}
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
									...baseStyle
								}}
								hoverStyle={{
									...baseHoverStyle,
									background: theme.accent
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
