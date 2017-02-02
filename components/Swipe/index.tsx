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
	showIcon?: boolean;
}

export interface SwipeProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

interface SwipeState {
	stopSwip?: boolean;
	focusIndex?: number;
	childrenLength?: number;
	isSingleChildren?: boolean;
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
		this.updateState(this.props);
	}

	componentWillReceiveProps(nextProps: SwipeProps) {
		this.updateState(nextProps);
	}

	componentWillUnmount() {
		clearTimeout(this.timeoutId);
	}

	updateState = (props: SwipeProps) => {
		const childrenLength = React.Children.count(props.children);
		const isSingleChildren = childrenLength === 1;
		this.setState({
			childrenLength,
			isSingleChildren
		});
		if (0 /*this.props.autoSwipe && !isSingleChildren*/) {
			this.setNextSlider();
		}
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
		const { childrenLength, focusIndex } = this.state;
		if (isToucheEvent) {
			this.endClientX = e.changedTouches[0].clientX;
		} else {
			this.endClientX = e.clientX;
		}
		this.refs.content.style.webkitTransform = `translateX(${this.refs.container.getBoundingClientRect().width * (childrenLength / 2 - 0.5 - focusIndex) - this.startClientX + this.endClientX}px)`;
	}

	mouseOrTouchUpHandler = (e: any) => {
		const isToucheEvent = this.checkIsToucheEvent(e);
		const { childrenLength } = this.state;
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
		let focusIndex = this.state.focusIndex + movePosition / this.refs.container.getBoundingClientRect().width;
		focusIndex = isNext ? Math.ceil(focusIndex + easey / 2) : Math.floor(focusIndex - easey / 2);
		focusIndex = this.setRightFocusIndex(focusIndex);
		if (focusIndex === this.state.focusIndex) {
			this.refs.content.style.webkitTransform = `translateX(${this.refs.container.getBoundingClientRect().width * (childrenLength / 2 - 0.5 - focusIndex)}px)`;
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
		const { children, initialFocusIndex, showIcon, canSwipe, autoSwipe, speed, easey, directionIsRight, style, transition, iconSize, ...attributes } = this.props;
		const { focusIndex, stopSwip, childrenLength, isSingleChildren } = this.state;
		const { theme } = this.context;
		const styles = getStyles(this);
		const childrens = React.Children.toArray(children);
		const childrensLeng = childrens.length;
		if (childrensLeng > 1) {
			childrens.push(childrens[0]);
			childrens.unshift(childrens[childrensLeng - 2]);
		}

		return (
			<div
				{...attributes}
				ref="container"
				style={{
					...styles.container,
					...theme.prepareStyles(style),
				}}
			>
				<div
					onClick={
						canSwipe ? this.mouseOrTouchDownHandler : void(0)
					}
					ref="content"
					style={styles.content}
				>
					{childrens.map((child, index) => (
						<div data-index={index} style={styles.item} key={`${index}`}>
							{child}
						</div>
					))}
				</div>
			</div>
		);
	}
}

function getStyles(swipe: Swipe): {
	container?: React.CSSProperties;
	content?: React.CSSProperties;
	item?: React.CSSProperties;
} {
	const { transition } = swipe.props;
	const { prepareStyles } = swipe.context.theme;
	const { focusIndex, childrenLength, isSingleChildren } = swipe.state;
	// const { width } = swipe.refs.container.getBoundingClientRect();

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
		content: prepareStyles({
			flex: "0 0 auto",
			display: "flex",
			flexDirection: "row",
			flexWrap: "nowrap",
			alignItems: "center",
			justifyContent: "center",
			position: "relative",
			height: "100%",
			width: `${childrenLength * 100}%`,
			transform: `translate3D(${-focusIndex * 100 / childrenLength}%, 0px, 0px)`,
			left: `${((isSingleChildren ? 0 : 2 + childrenLength) / 2 - 0.5) * 100}%`,
			transition,
		}),
		item: prepareStyles({
			position: "relative",
			width: `${100 / childrenLength}%`,
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
