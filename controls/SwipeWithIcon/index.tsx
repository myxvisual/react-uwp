import * as React from "react";


import Swipe from "../Swipe";
import IconButton from "../IconButton";
import { ThemeType } from "../../style/ThemeType";

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
		const { prepareStyles } = theme;

		const styles = getStyles(this);
		return (
			<div ref="container" style={prepareStyles({ ...styles.container, ...attributes.style })}>
				<IconButton
					onClick={this.swipeBackWord}
					style={{ ...styles.iconLeft, ...iconStyle }}
					hoverStyle={iconHoverStyle || { background: theme.altHigh }}
				>
					&#xE012;
				</IconButton>
				<Swipe ref="swipe" {...this.props} autoSwipe={false} style={prepareStyles(attributes.style)} />
				<IconButton
					onClick={this.swipeForward}
					style={{ ...styles.iconRight, ...iconStyle }}
					hoverStyle={iconHoverStyle || { background: theme.altHigh }}
				>
					&#xE013;
				</IconButton>
			</div>
		);
	}
}

function getStyles(contex: SwipeWithIcon): {
	container?: React.CSSProperties;
	iconLeft?: React.CSSProperties;
	iconRight?: React.CSSProperties;
} {
	const { iconSize } = contex.props;
	const { theme } = contex.context;

	return {
		container: theme.prepareStyles({
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
			position: "absolute",
			background: theme.baseLow,
			zIndex: 20,
			width: iconSize,
			height: iconSize,
			left: 20,
			top: `calc(50% - ${iconSize / 2}px)`,
		},
		iconRight: {
			position: "absolute",
			background: theme.baseLow,
			width: iconSize,
			height: iconSize,
			zIndex: 20,
			right: 20,
			top: `calc(50% - ${iconSize / 2}px)`,
		},
	};
}
