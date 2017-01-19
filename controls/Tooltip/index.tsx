import * as React from "react";

import { ThemeType } from "../../style/ThemeType";
const defaultProps: TooltipProps = __DEV__ ? require("./devDefaultProps").default : {};

export interface DataProps {
	verticalPosition?: "left" | "right" | "center";
	horizontalPosition?: "left" | "right" | "center";
	show?: boolean;
}
interface TooltipProps extends DataProps, React.HTMLAttributes<HTMLSpanElement> {}
interface TooltipState {
	showTooltip?: boolean;
	width?: number;
	height?: number;
}

export default class Tooltip extends React.Component<TooltipProps, TooltipState> {
	static defaultProps: TooltipProps = {
		...defaultProps
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

	getStyle = (width: number, height: number) => {

	}

	render() {
		// tslint:disable-next-line:no-unused-variable
		const { verticalPosition, horizontalPosition, show, ...attributes } = this.props;
		const { theme } = this.context;
		const { showTooltip, width, height } = this.state;

		return (
			<span
				{...attributes}
				ref="container"
				style={{
					visibility: !showTooltip ? "visible" : "hidden",
					color: theme.baseMediumHigh,
					background: theme.altMediumHigh,
					fontSize: 14,
					...attributes.style,
					position: "absolute",
				}}
			>
				Tooltip
			</span>
		);
	}
}
