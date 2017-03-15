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
export interface FlyoutProps extends DataProps, React.HTMLAttributes<HTMLSpanElement> {}
export interface FlyoutState {
	showFlyout?: boolean;
}

class Flyout extends React.Component<FlyoutProps, FlyoutState> {
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
	refs: { flyoutElm: HTMLDivElement };

	static contextTypes = { theme: React.PropTypes.object };
	context: { theme: ThemeType };

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

	getStyle = (showFlyout = false, positionStyle = {}): React.CSSProperties => {
		const { context: { theme }, props: { style } } = this;
		return theme.prepareStyles({
			width: 280,
			height: 60,

			padding: "4px 8px",
			border: `1px solid ${theme.baseLow}`,
			color: theme.baseMediumHigh,
			background: theme.chromeMedium,
			transition: "all .25s 0s ease-in-out",
			pointerEvents: showFlyout ? "all" : "none",
			opacity: showFlyout ? 1 : 0,
			transform: `translateY(${showFlyout ? "0px" : "10px"})`,
			position: "absolute",
			zIndex: theme.zIndex.flyout,
			...positionStyle,
			...style,
		});
	}

	getFlyoutStyle = (): React.CSSProperties => {
		const { flyoutElm } = this.refs;
		if (!flyoutElm) return this.getStyle();
		let parentNode: any = flyoutElm.parentNode;

		const { theme } = this.context;
		const { verticalPosition, horizontalPosition, margin } = this.props;
		const { width, height } = parentNode.getBoundingClientRect();
		const containerWidth = flyoutElm.getBoundingClientRect().width;
		const containerHeight = flyoutElm.getBoundingClientRect().height;
		const { showFlyout } = this.state;
		const positionStyle: React.CSSProperties = {};
		if (width !== void(0) && height !== void(0)) {
			switch (horizontalPosition) {
				case "left": {
					positionStyle.right = 0;
					break;
				}
				case "center": {
					positionStyle.left = (width - containerWidth) / 2;
					break;
				}
				case "right": {
					positionStyle.left = 0;
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
		return this.getStyle(showFlyout, positionStyle);
	}

	handelMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
		e.currentTarget.style.borderColor = this.context.theme.accent;
		this.props.onMouseEnter(e);
	}

	handelMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
		e.currentTarget.style.borderColor = this.context.theme.baseLow;
		this.props.onMouseLeave(e);
	}

	render() {
		// tslint:disable-next-line:no-unused-variable
		const { verticalPosition, timeout, autoClose, margin, horizontalPosition, show, children, ...attributes } = this.props;
		const { theme } = this.context;

		return (
			<div
				{...attributes}
				onMouseEnter={this.handelMouseEnter}
				onMouseLeave={this.handelMouseLeave}
				ref="flyoutElm"
				style={this.getFlyoutStyle()}
			>
				{children}
			</div>
		);
	}
}

export default Flyout;
