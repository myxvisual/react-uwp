import * as React from "react";

import { ThemeType } from "../../styles/ThemeType";
const defaultProps: TooltipProps = __DEV__ ? require("./devDefaultProps").default : {};

export interface DataProps {
	verticalPosition?: "top" | "bottom" | "center";
	horizontalPosition?: "left" | "right" | "center";
	show?: boolean;
	itemHeigh?: number;
	margin?: number;
	autoClose?: boolean;
	timeout?: number;
}
interface TooltipProps extends DataProps, React.HTMLAttributes<HTMLSpanElement> {}
interface TooltipState {
	showTooltip?: boolean;
}

export default class Tooltip extends React.Component<TooltipProps, TooltipState> {
	static defaultProps: TooltipProps = {
		...defaultProps,
		verticalPosition: "bottom",
		horizontalPosition: "center",
		children: "Tooltip",
		margin: 4,
		autoClose: true,
		timeout: 2500,
	};

	state: TooltipState = {
		showTooltip: false
	};

	static contextTypes = { theme: React.PropTypes.object };

	context: { theme: ThemeType };

	refs: { container: HTMLDivElement };

	timer: any = null;

	componentDidMount() {
		const parentNode = this.refs.container.parentNode as HTMLDivElement;
		parentNode.style.position = "relative";
		parentNode.addEventListener("mouseenter", this.showTooltip);
		parentNode.addEventListener("click", this.showTooltip);
		parentNode.addEventListener("mouseleave", this.notShowTooltip);
	}

	componentWillUnmount() {
		this.refs.container.parentNode.removeEventListener("mouseenter", this.showTooltip);
		this.refs.container.parentNode.removeEventListener("click", this.showTooltip);
		this.refs.container.parentNode.removeEventListener("mouseleave", this.notShowTooltip);
		clearTimeout(this.timer);
	}

	showTooltip = (e: MouseEvent) => {
		const show = () => {
			this.setState({
				showTooltip: true
			});
		};
		if (this.props.autoClose) {
			show();
			this.timer = setTimeout(() => {
				this.setState({
					showTooltip: false
				});
			}, this.props.timeout);
		} else {
			show();
		}
	}

	notShowTooltip = (e: MouseEvent) => {
		this.setState({
			showTooltip: false
		});
	}

	getStyle = (): React.CSSProperties => {
		const { theme } = this.context;
		const { verticalPosition, horizontalPosition, style, margin } = this.props;
		const getStyles = (showTooltip = false, positionStyle = {}): React.CSSProperties => theme.prepareStyles({
			height: 28,
			padding: "4px 8px",
			transition: "all .25s 0s ease-in-out",
			border: `1px solid ${theme.baseLow}`,
			color: theme.baseMediumHigh,
			background: theme.chromeMedium,
			opacity: showTooltip ? 1 : 0,
			transform: `translateY(${showTooltip ? "0px" : "10px"})`,
			position: "absolute",
			fontSize: 14,
			...style,
			...positionStyle,
		});
		let parentNode: HTMLDivElement;
		try {
			parentNode = this.refs.container.parentNode as HTMLDivElement;
		} catch (e) {}
		if (!parentNode) return getStyles();
		parentNode.style.position = "relative";
		const { width, height } = parentNode.getBoundingClientRect();
		const containerWidth = this.refs.container.getBoundingClientRect().width;
		const containerHeight = this.refs.container.getBoundingClientRect().height;
		const { showTooltip } = this.state;
		const positionStyle: React.CSSProperties = {};
		if (width !== void(0) && height !== void(0)) {
			switch (horizontalPosition) {
				case "left": {
					positionStyle.left = -containerWidth - margin;
					break;
				}
				case "center": {
					positionStyle.left = (width - containerWidth) / 2;
					break;
				}
				case "right": {
					positionStyle.left = width + margin;
					break;
				}
				default: {
					break;
				}
			}
			switch (verticalPosition) {
				case "top": {
					positionStyle.top = -containerHeight - margin;
					break;
				}
				case "center": {
					positionStyle.top = (height - containerHeight) / 2;
					break;
				}
				case "bottom": {
					positionStyle.top = height + margin;
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
		const { verticalPosition, timeout, autoClose, margin, horizontalPosition, show, children, itemHeigh, ...attributes } = this.props;
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
