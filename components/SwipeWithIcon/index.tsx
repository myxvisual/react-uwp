import * as React from "react";


import Swipe from "../Swipe";
import IconButton from "../IconButton";
import { ThemeType } from "../../styles/ThemeType";

const defaultProps: SwipeWithIconProps = __DEV__ ? require("./devDefaultProps").default : {};

export interface DataProps {
	initialFocusIndex?: number;
	canSwipe?: boolean;
	autoSwipe?: boolean;
	speed?: number;
	easey?: number;
	direction?: "vertical" | "horizontal";
	iconSize?: number;
	iconStyle?: React.CSSProperties;
	iconHoverStyle?: React.CSSProperties;
	showIcon?: boolean;
}
export interface SwipeWithIconProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}
interface SwipeWithIconState {}
export default class SwipeWithIcon extends React.Component<SwipeWithIconProps, SwipeWithIconState> {
	static defaultProps = {
		...defaultProps,
		direction: "horizontal",
		className: "",
		iconSize: 32,
		showIcon: true,
	};
	static contextTypes = { theme: React.PropTypes.object };
	context: { theme: ThemeType };
	refs: { swipe?: Swipe; container: HTMLDivElement };

	swipeForward = () => {
		this.refs.swipe.swipeForward();
	}

	swipeBackWord = () => {
		this.refs.swipe.swipeBackWord();
	}

	render() {
		// tslint:disable-next-line:no-unused-variable
		const { children, showIcon, initialFocusIndex, canSwipe, autoSwipe, speed, easey, direction, iconStyle, iconHoverStyle, iconSize, ...attributes } = this.props;
		const { theme } = this.context;
		const count = React.Children.count(children);
		const isHorizontal = direction === "horizontal";

		const styles = getStyles(this);
		return (
			<div
				ref="container"
				style={{
					...styles.container,
					...theme.prepareStyles(attributes.style)
				}}
			>
				{count > 1 && showIcon && (
					<IconButton
						onClick={this.swipeBackWord}
						style={{
							...styles.iconLeft,
							...theme.prepareStyles(iconStyle),
						}}
						hoverStyle={{
							background: theme.accent,
							...theme.prepareStyles(iconHoverStyle),
						}}
					>
						{isHorizontal ? "\uE012" : "\uE010"}
					</IconButton>
				)}
				<Swipe
					ref="swipe"
					{...this.props}
					style={attributes.style}
				/>
				{count > 1 && showIcon && (
					<IconButton
						onClick={this.swipeForward}
						style={{
							...styles.iconRight,
							...theme.prepareStyles(iconStyle),
						}}
						hoverStyle={{
							background: theme.accent,
							...theme.prepareStyles(iconHoverStyle),
						}}
					>
						{isHorizontal ? "\uE013" : "\uE011"}
					</IconButton>
				)}
			</div>
		);
	}
}

function getStyles(swipeWithIcon: SwipeWithIcon): {
	container?: React.CSSProperties;
	iconLeft?: React.CSSProperties;
	iconRight?: React.CSSProperties;
} {
	const { iconSize, direction } = swipeWithIcon.props;
	const { theme } = swipeWithIcon.context;
	const { prepareStyles } = theme;
	const isHorizontal = direction === "horizontal";

	const baseIconStyle: React.CSSProperties = {
		position: "absolute",
		background: theme.altMedium,
		zIndex: 20,
		fontSize: iconSize / 2,
		width: iconSize * (isHorizontal ? 1 : 2),
		height: iconSize * (isHorizontal ? 2 : 1),
	};

	return {
		container: prepareStyles({
			display: "flex",
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "center",
			position: "relative",
			zIndex: 0,
			width: "100%",
			background: theme.chromeLow,
			height: "auto",
			transition: "all 0.25s 0s cubic-bezier(.8, -.5, .2, 1.4)",
		}),
		iconLeft: {
			...baseIconStyle,
			top: isHorizontal ? `calc(50% - ${iconSize}px)` : 0,
			left: isHorizontal ? 0 : `calc(50% - ${iconSize}px)`,
		},
		iconRight: {
			...baseIconStyle,
			bottom: isHorizontal ? `calc(50% - ${iconSize}px)` : 0,
			right: isHorizontal ? 0 : `calc(50% - ${iconSize}px)`,
		},
	};
}
