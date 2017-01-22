import * as React from "react";
import { findDOMNode } from "react-dom";

import { ThemeType } from "../../styles/ThemeType";
const defaultProps: SwipeProps = __DEV__ ? require("./devDefaultProps").default : {};

export interface DataProps {
	initialFocusIndex?: number;
	canSwipe?: boolean;
	autoSwipe?: boolean;
	speed?: number;
	easey?: number;
	directionIsRight?: boolean;
	transition?: string;
	iconSize?: number;
}
export interface SwipeProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}
interface SwipeState {
	stopSwip?: boolean;
	focusIndex?: number;
	updateComponent?: boolean;
	childrenLength?: number;
	width?: number;
}
export default class Swipe extends React.Component<SwipeProps, SwipeState> {
	static defaultProps = {
		...defaultProps,
		autoSwipe: true,
		className: "",
		transition: "all 1s 0s cubic-bezier(.8, -.5, .2, 1.4)",
		initialFocusIndex: 0,
		canSwipe: true,
		speed: 5000,
		easey: 0.85,
		directionIsRight: true,
	};

	static contextTypes = { theme: React.PropTypes.object };
	context: { theme: ThemeType };

	state: SwipeState = {
		focusIndex: this.props.initialFocusIndex || 0,
		updateComponent: false,
		stopSwip: false,
		childrenLength: 0,
	};

	private timeoutId: any;
	refs: {
		container: HTMLDivElement;
		content: HTMLDivElement;
	};
	private containerDOM: HTMLDivElement;
	private startClientX: number;
	private endClientX: number;

	componentDidMount() {
		this.containerDOM = findDOMNode(this.refs.container) as HTMLDivElement;
		this.setState({
			width: this.containerDOM.getClientRects()[0].width,
			childrenLength: React.Children.count(this.props.children)
		});
		if (this.props.autoSwipe) {
			this.setNextSlider();
		}
	}

	componentWillUnmount() {
		clearTimeout(this.timeoutId);
	}

	getfocusIndex = () => this.state.focusIndex;

	focusIndex = (focusIndex: number) => {
		this.setState({
			focusIndex: this.setRightFocusIndex(focusIndex),
			stopSwip: false
		});
	}

	swipeForward = () => {
		this.setState({
			focusIndex: this.setRightFocusIndex(this.state.focusIndex + 1)
		});
	}

	swipeBackWord = () => {
		this.setState({
			focusIndex: this.setRightFocusIndex(this.state.focusIndex - 1)
		});
	}

	getItemsLength = () => React.Children.count(this.props.children);

	setRightFocusIndex = (focusIndex: number): number => {
		const length = this.getItemsLength();
		return focusIndex < 0 ? length - Math.abs(focusIndex) % length : focusIndex % length;
	}

	setNextSlider: {
		(): void;
		funStartTime?: number;
	} = () => {
		const { speed } = this.props;
		if (this.state.stopSwip || !this.props.autoSwipe) {
			setTimeout(() => {
				this.setNextSlider();
			}, speed);
			return;
		}
		if (this.setNextSlider.funStartTime && Date.now() - this.setNextSlider.funStartTime < speed) {
			return;
		}
		this.timeoutId = setTimeout(() => {
			if (!this.state.stopSwip) {
				this.setState({
					focusIndex: this.setRightFocusIndex(this.state.focusIndex + 1)
				});
			}
			this.setNextSlider();
		}, this.props.speed);
		this.setNextSlider.funStartTime = Date.now();
	}

	checkIsToucheEvent = (e: React.SyntheticEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => "changedTouches" in e;

	mouseOrTouchDownHandler = (e: any) => {
		this.setState({ stopSwip: true });
		const isToucheEvent = this.checkIsToucheEvent(e);
		if (isToucheEvent) {
			window.addEventListener("touchmove", this.mouseOrTouchMoveHandler);
			window.addEventListener("touchend", this.mouseOrTouchUpHandler);
		} else {
			window.addEventListener("mousemove", this.mouseOrTouchMoveHandler);
			window.addEventListener("mouseup", this.mouseOrTouchUpHandler);
		}
		const { childrenLength } = this.state;
		if (isToucheEvent) {
			this.startClientX = e.changedTouches[0].clientX;
		} else {
			this.startClientX = e.clientX;
		}
		this.refs.content.style.webkitTransition = "all 0.06125s 0s linear";
	}

	mouseOrTouchMoveHandler: {
		(e: any): void;
	} = (e) => {
		const isToucheEvent = this.checkIsToucheEvent(e);
		const { width, childrenLength, focusIndex } = this.state;
		if (isToucheEvent) {
			this.endClientX = e.changedTouches[0].clientX;
		} else {
			this.endClientX = e.clientX;
		}
		this.refs.content.style.webkitTransform = `translateX(${width * (childrenLength / 2 - 0.5 - focusIndex) - this.startClientX + this.endClientX}px)`;
	}

	mouseOrTouchUpHandler = (e: any) => {
		const isToucheEvent = this.checkIsToucheEvent(e);
		const { childrenLength, width } = this.state;
		if (isToucheEvent) {
			window.removeEventListener("touchmove", this.mouseOrTouchMoveHandler);
			window.removeEventListener("touchend", this.mouseOrTouchUpHandler);
		} else {
			window.removeEventListener("mousemove", this.mouseOrTouchMoveHandler);
			window.removeEventListener("mouseup", this.mouseOrTouchUpHandler);
		}
		this.refs.content.style.webkitTransition = this.props.transition;
		this.state.stopSwip = false;
		let { easey } = this.props;
		if (easey < 0) easey = 0;
		if (easey > 1) easey = 1;
		const movePosition = this.endClientX - this.startClientX;
		const isNext = movePosition > 0;
		let focusIndex = this.state.focusIndex + movePosition / width;
		focusIndex = isNext ? Math.ceil(focusIndex + easey / 2) : Math.floor(focusIndex - easey / 2);
		focusIndex = this.setRightFocusIndex(focusIndex);
		if (focusIndex === this.state.focusIndex) {
			this.refs.content.style.webkitTransform = `translateX(${width * (childrenLength / 2 - 0.5 - focusIndex)}px)`;
		} else {
			this.setState({
				focusIndex,
				stopSwip: false
			});
		}
		this.setNextSlider();
	}

	render() {
		// tslint:disable-next-line:no-unused-variable
		const { children, initialFocusIndex, canSwipe, autoSwipe, speed, easey, directionIsRight, style, transition, iconSize, ...attributes } = this.props;
		const { focusIndex, stopSwip, width, childrenLength } = this.state;
		const { theme } = this.context;
		const styles = getStyles(this);

		return (
			<div {...attributes} ref="container" style={theme.prepareStyles({ ...styles.container, ...style })}>
				<div
					onMouseDown={
						canSwipe ? this.mouseOrTouchDownHandler : void(0)
					}
					onTouchStart= {
						canSwipe ? this.mouseOrTouchDownHandler : void(0)
					}
					ref="content"
					style={theme.prepareStyles({
						...styles.content,
						width: `${childrenLength * 100}%`,
						...theme.prepareStyles({ transform: `translateX(${width * (childrenLength / 2 - 0.5 - focusIndex)}px)` }),
					})}
				>
					{React.Children.map(children, (child, index) => {
						return (
							<div style={theme.prepareStyles(styles.item)} key={`${index}`}>
								{child}
							</div>
						);
					})}
				</div>
			</div>
		);
	}
}

function getStyles(context: Swipe): {
	container?: React.CSSProperties;
	content?: React.CSSProperties;
	item?: React.CSSProperties;
} {
	const { transition, children } = context.props;
	const { prepareStyles } = context.context.theme;
	const content = {
		flex: "0 0 auto",
		display: "flex",
		flexDirection: "row",
		flexWrap: "nowrap",
		alignItems: "center",
		justifyContent: "center",
		position: "relative",
		height: "100%",
		overflow: "hidden",
		left: 0,
		transition,
	} as React.CSSProperties;
	return {
		container: prepareStyles({
			display: "flex",
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "center",
			position: "relative",
			overflow: "hidden",
			width: "100%",
			height: "auto",
		}),
		content: { ...prepareStyles(content), ...content },
		item: prepareStyles({
			position: "relative",
			width: `${100 / React.Children.count(children)}%`,
			height: "100%",
			display: "flex",
			flex: "0 0 auto",
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "center",
			userSelect: "none",
			userDrag: "none",
			WebkitUserDrag: "none",
		})
	};
}
