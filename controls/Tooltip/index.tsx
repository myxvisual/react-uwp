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
		parentNode.style.position = "relative";
		const { width, height } = window.getComputedStyle(parentNode);
		this.setState({ width: parseInt(width), height: parseInt(height) });
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
		const { showTooltip, width, height } = this.state;
		const { theme } = this.context;
		const positionStyle: React.CSSProperties = {};
		switch (horizontalPosition) {
			case "left": {
				positionStyle.right = width ? width + 4 : 0;
				break;
			}
			case "center": {
				positionStyle.left = width ? (width - this.refs.container.clientWidth) / 2 : 0;
				break;
			}
			case "right": {
				positionStyle.left = width ? width + 4 : 0;
				break;
			}
			default: {
				break;
			}
		}
		switch (verticalPosition) {
			case "top": {
				positionStyle.bottom = height ? height + 4 : 0;
				break;
			}
			case "bottom": {
				positionStyle.top = height ? height + 4 : 0;
				break;
			}
			default: {
				break;
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
			position: "absolute",
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
