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
		const { width, height } = window.getComputedStyle(this.refs.container.getDOM());
		switch (direction) {
			case "bottom": {
				setStyleToElement(this.refs.itmesContainer, showItems ? {
					top: height,
					width: width,
					"max-height": 0
				} : {
					top: height,
					width: width,
					"max-height": `${React.Children.count(children) * Number(height.slice(0, height.length - 2))}px`
				});
				break;
			}
			default: {
				break;
			}
		}
		this.setState((prevState, prevProps) => {
			return { showItems: setToState ? showItems : !prevState.showItems, width, height };
		});
	}

	render() {
		const { direction, title, children, className, ...attributes } = this.props;
		const { showItems, width, height } = this.state;
		theme = this.context.theme;

		const baseStyle: React.CSSProperties = {
			color: theme.baseMediumHigh,
			background: theme.altHigh
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
				style={{ ...attributes.style, ...baseStyle }}
				hoverStyle={baseHoverStyle}
			>
				<div onClick={this.toggleShowItems} >
					<p>{title}</p>
					<div ref="itmesContainer" className={styles.cItem}>
						{React.Children.map(children, (child, index) => (
							<ElementState
								key={`${index}`}
								className={styles.cItemItems}
								style={{
									...baseStyle, width, height,
									border: `3px solid transparent`
								}}
								hoverStyle={{
									...baseHoverStyle,
									background:
									theme.accent,
									border: `3px solid ${theme.accentLighter3}`
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
