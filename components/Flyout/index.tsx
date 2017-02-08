import * as React from "react";

import { ThemeType } from "../../styles/ThemeType";
const defaultProps: FlyoutProps = __DEV__ ? require("./devDefaultProps").default : {};

export interface DataProps {
	verticalPosition?: "top" | "bottom" | "center";
	horizontalPosition?: "left" | "right" | "center";
	show?: boolean;
	margin?: number;
	autoClose?: boolean;
	timeout?: number;
}
interface FlyoutProps extends DataProps, React.HTMLAttributes<HTMLSpanElement> {}
interface FlyoutState {
	showFlyout?: boolean;
}

export default class Flyout extends React.Component<FlyoutProps, FlyoutState> {
	static defaultProps: FlyoutProps = {
		...defaultProps,
		verticalPosition: "top",
		horizontalPosition: "center",
		children: "Flyout",
		margin: 4,
		autoClose: false,
		timeout: 2500,
		onMouseLeave: () => {},
		onMouseEnter: () => {}
	};

	state: FlyoutState = {
		showFlyout: this.props.show
	};

	static contextTypes = { theme: React.PropTypes.object };

	context: { theme: ThemeType };

	refs: { container: HTMLDivElement };

	componentDidMount() {
		const parentNode = this.refs.container.parentNode as HTMLDivElement;
		parentNode.style.position = "relative";
	}

	toggleShowFlyout = (showFlyout?: boolean) => {
		if (typeof showFlyout === "boolean") {
			if (showFlyout !== this.state.showFlyout) {
				this.setState({ showFlyout });
			}
		} else {
			this.setState({
				showFlyout: !this.state.showFlyout
			});
		}
	}

	getStyle = (): React.CSSProperties => {
		const { theme } = this.context;
		const { verticalPosition, horizontalPosition, style, margin } = this.props;
		const getStyles = (showFlyout = false, positionStyle = {}): React.CSSProperties => theme.prepareStyles({
			width: 280,
			height: 60,
			padding: "4px 8px",
			transition: "all .25s 0s ease-in-out",
			border: `1px solid ${theme.baseLow}`,
			color: theme.baseMediumHigh,
			background: theme.chromeMedium,
			opacity: showFlyout ? 1 : 0,
			transform: `translateY(${showFlyout ? "0px" : "10px"})`,
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
		const { width, height } = parentNode.getBoundingClientRect();
		const containerWidth = this.refs.container.getBoundingClientRect().width;
		const containerHeight = this.refs.container.getBoundingClientRect().height;
		const { showFlyout } = this.state;
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
		return getStyles(showFlyout, positionStyle);
	}

	render() {
		// tslint:disable-next-line:no-unused-variable
		const { verticalPosition, timeout, autoClose, margin, horizontalPosition, show, children, ...attributes } = this.props;
		const { theme } = this.context;

		return (
			<div
				{...attributes}
				onMouseEnter={(e) => {
					e.currentTarget.style.borderColor = theme.accent;
					attributes.onMouseEnter(e);
				}}
				onMouseLeave={(e) => {
					e.currentTarget.style.borderColor = theme.baseLow;
					attributes.onMouseLeave(e);
				}}
				ref="container"
				style={this.getStyle()}
			>
				{children}
			</div>
		);
	}
}
