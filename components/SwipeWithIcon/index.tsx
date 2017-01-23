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
	directionIsRight?: boolean;
	iconSize?: number;
	iconStyle?: React.CSSProperties;
	iconHoverStyle?: React.CSSProperties;
}
export interface SwipeWithIconProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}
interface SwipeWithIconState {}
export default class SwipeWithIcon extends React.Component<SwipeWithIconProps, SwipeWithIconState> {
	static defaultProps = {
		...defaultProps,
		className: "",
		iconSize: 40,
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
		const { children, initialFocusIndex, canSwipe, autoSwipe, speed, easey, directionIsRight, iconStyle, iconHoverStyle, iconSize, ...attributes } = this.props;
		const { theme } = this.context;

		const styles = getStyles(this);
		return (
			<div
				ref="container"
				style={{
					...styles.container,
					...theme.prepareStyles(attributes.style)
				}}
			>
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
					&#xE012;
				</IconButton>
				<Swipe
					ref="swipe"
					{...this.props}
					style={attributes.style}
				/>
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
					&#xE013;
				</IconButton>
			</div>
		);
	}
}

function getStyles(instance: SwipeWithIcon): {
	container?: React.CSSProperties;
	iconLeft?: React.CSSProperties;
	iconRight?: React.CSSProperties;
} {
	const { iconSize } = instance.props;
	const { theme } = instance.context;
	const { prepareStyles } = theme;

	const baseIconStyle: React.CSSProperties = {
		position: "absolute",
		background: theme.altHigh,
		zIndex: 20,
		fontSize: iconSize / 2,
		width: iconSize,
		height: iconSize,
		top: `calc(50% - ${iconSize / 2}px)`,
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
			background: theme.accent,
			height: "auto",
			transition: "all 0.25s 0s cubic-bezier(.8, -.5, .2, 1.4)",
		}),
		iconLeft: {
			...baseIconStyle,
			left: 0,
		},
		iconRight: {
			...baseIconStyle,
			right: 0,
		},
	};
}
