import * as React from "react";

import prefixAll from "../../common/prefixAll";
import { ThemeType } from "../../style/ThemeType";
const defaultProps: TooltipProps = __DEV__ ? require("./devDefaultProps").default : {};

export interface DataProps {
	verticalPosition?: "top" | "bottom";
	horizontalPosition?: "left" | "right" | "center";
	show?: boolean;
	maxHeight?: number;
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
		children: "Tooltip"
	};
	state: TooltipState = {
		showTooltip: false
	};
	static contextTypes = { theme: React.PropTypes.object };
	context: { theme: ThemeType };
	refs: { container: HTMLDivElement };

	componentDidMount() {
		const parentNode = this.refs.container.parentNode as HTMLDivElement;
		const { top, left } = parentNode.getClientRects()[0];
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
		const { verticalPosition, horizontalPosition, style, maxHeight } = this.props;
		const { showTooltip, width, height, top, left } = this.state;
		const { theme } = this.context;
		const positionStyle: React.CSSProperties = {};
		if (width !== void(0) && height !== void(0) && top !== void(0) && left !== void(0)) {
			switch (horizontalPosition) {
				case "left": {
					positionStyle.left = left + width + 4;
					break;
				}
				case "center": {
					const size = width - this.refs.container.clientWidth;
					positionStyle.left = left - (size > 0 ? size / 2 : + width / 2);
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
					positionStyle.bottom = top + height + 4;
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
		}
		return prefixAll({
			maxHeight: showTooltip ? (maxHeight || 50) : 0,
			overflow: "hidden",
			padding: "4px 8px",
			transition: "all .25s 0s ease-in-out",
			border: `1px solid ${showTooltip ? theme.baseLow : "transparent"}`,
			color: showTooltip ? theme.baseMediumHigh : "transparent",
			background: showTooltip ? theme.chromeMedium : "transparent",
			fontSize: 14,
			...style,
			...positionStyle,
			position: "fixed",
		});
	}

	render() {
		// tslint:disable-next-line:no-unused-variable
		const { verticalPosition, horizontalPosition, show, children, maxHeight, ...attributes } = this.props;
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
