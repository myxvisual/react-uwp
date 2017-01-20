import * as React from "react";

import { ThemeType } from "../../style/ThemeType";
const defaultProps: TooltipProps = __DEV__ ? require("./devDefaultProps").default : {};

export interface DataProps {
	verticalPosition?: "top" | "bottom" | "center";
	horizontalPosition?: "left" | "right" | "center";
	show?: boolean;
	itemHeigh?: number;
}
interface TooltipProps extends DataProps, React.HTMLAttributes<HTMLSpanElement> {}
interface TooltipState {
	showTooltip?: boolean;
	width?: number;
	height?: number;
	top?: number;
	left?: number;
}

export default class Tooltip extends React.Component<TooltipProps, TooltipState> {
	static defaultProps: TooltipProps = {
		...defaultProps,
		verticalPosition: "bottom",
		horizontalPosition: "center",
		children: "Tooltip",
		itemHeigh: 28,
	};
	state: TooltipState = {
		showTooltip: false
	};
	static contextTypes = { theme: React.PropTypes.object };
	context: { theme: ThemeType };
	refs: { container: HTMLDivElement };

	componentDidMount() {
		const parentNode = this.refs.container.parentNode as HTMLDivElement;
		const { top, left } = parentNode.getBoundingClientRect();
		const { width, height } = window.getComputedStyle(parentNode);
		this.setState({ width: parseInt(width), height: parseInt(height), top, left });
		parentNode.addEventListener("mouseenter", this.showTooltip);
		parentNode.addEventListener("mouseleave", this.notShowTooltip);
	}

	componentWillUnmount() {
		this.refs.container.parentNode.removeEventListener("mouseenter", this.showTooltip);
		this.refs.container.parentNode.removeEventListener("mouseleave", this.notShowTooltip);
	}

	showTooltip = (e: MouseEvent) => {
		this.setState({
			showTooltip: true
		});
	}

	notShowTooltip = (e: MouseEvent) => {
		this.setState({
			showTooltip: false
		});
	}

	getStyle = (): React.CSSProperties => {
		const { theme } = this.context;
		const { verticalPosition, horizontalPosition, style, itemHeigh } = this.props;
		const getStyles = (showTooltip = false, positionStyle = {}): React.CSSProperties => theme.prepareStyles({
			height: showTooltip ? (itemHeigh || 28) : 0,
			overflow: "hidden",
			padding: "4px 8px",
			transition: "border .25s 0s ease-in-out, height .25s 0s ease-in-out, color .25s 0s ease-in-out, background .25s 0s ease-in-out",
			border: `1px solid ${showTooltip ? theme.baseLow : "transparent"}`,
			color: showTooltip ? theme.baseMediumHigh : "transparent",
			background: showTooltip ? theme.chromeMedium : "transparent",
			fontSize: 14,
			...style,
			...positionStyle,
			position: "fixed",
		});
		let parentNode: HTMLDivElement;
		try {
			parentNode = this.refs.container.parentNode as HTMLDivElement;
		} catch (e) {}
		if (!parentNode) return getStyles();

		const { top, left } = parentNode.getBoundingClientRect() as any;
		let { width, height } = window.getComputedStyle(parentNode) as any;
		width = +width.slice(0, width.length - 2);
		height = +height.slice(0, height.length - 2);
		const { showTooltip } = this.state;
		const positionStyle: React.CSSProperties = {};
		if (width !== void(0) && height !== void(0) && top !== void(0) && left !== void(0)) {
			switch (horizontalPosition) {
				case "left": {
					positionStyle.left = left - this.refs.container.clientWidth - 4;
					break;
				}
				case "center": {
					const size = width - this.refs.container.clientWidth;
					positionStyle.left = left + (size > 0 ? size / 2 : + width / 2);
					break;
				}
				case "right": {
					positionStyle.left = left + width + 4;
					break;
				}
				default: {
					break;
				}
			}
			switch (verticalPosition) {
				case "top": {
					positionStyle.top = top - itemHeigh - 4;
					break;
				}
				case "center": {
					positionStyle.top = top - (itemHeigh - height) / 2;
					break;
				}
				case "bottom": {
					positionStyle.top = top + height + 4;
					break;
				}
				default: {
					break;
				}
			}
		};
		return getStyles(showTooltip, positionStyle);
	}

	render() {
		// tslint:disable-next-line:no-unused-variable
		const { verticalPosition, horizontalPosition, show, children, itemHeigh, ...attributes } = this.props;
		const { theme } = this.context;

		return (
			<span
				{...attributes}
				ref="container"
				style={this.getStyle()}
			>
				{children}
			</span>
		);
	}
}
