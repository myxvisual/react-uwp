import * as React from "react";
import { findDOMNode } from "react-dom";

const defaultProps: SwipeProps = __DEV__ ? require("./devDefaultProps").default : {};

export interface DataProps {
	initialFocusIndex?: number;
	canSwipe?: boolean;
	autoSwipe?: boolean;
	speed?: number;
	easy?: number;
	delay?: number;
	direction?: "vertical" | "horizontal";
	transitionTimingFunction?: string;
	iconSize?: number;
	showIcon?: boolean;
	animate?: "slide" | "opacity";
}

export interface SwipeProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

interface SwipeState {
	stopSwipe?: boolean;
	focusIndex?: number;
	childrenLength?: number;
	isHorizontal?: boolean;
	isSingleChildren?: boolean;
	haveAnimate?: boolean;
	swiping?: boolean;
}

export default class Swipe extends React.Component<SwipeProps, SwipeState> {
	static defaultProps: SwipeProps = {
		...defaultProps,
		direction: "horizontal",
		autoSwipe: false,
		className: "",
		animate: "slide",
		transitionTimingFunction: "cubic-bezier(0.5, 0, 0.5, 1)",
		initialFocusIndex: 0,
		canSwipe: true,
		speed: 1000,
		delay: 5000,
		easy: 0.85,
	};

	static contextTypes = { theme: React.PropTypes.object };

	isSingleChildren = React.Children.count(this.props.children) === 1;

	state: SwipeState = {
		isSingleChildren: this.isSingleChildren,
		focusIndex: this.isSingleChildren ? this.props.initialFocusIndex : this.props.initialFocusIndex + 1,
		stopSwipe: false,
		childrenLength: 0,
		haveAnimate: false,
		swiping: false
	};

	private timeoutId: any;
	refs: {
		container: HTMLDivElement;
		content: HTMLDivElement;
	};
	private containerDOM: HTMLDivElement;
	private startClientX: number;
	private startClientY: number;
	private endClientX: number;
	private endClientY: number;

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
			isHorizontal: props.direction === "horizontal",
			childrenLength,
			isSingleChildren,
			stopSwipe: !props.autoSwipe
		});
		if (props.autoSwipe && !isSingleChildren) {
			this.timeoutId = setTimeout(() => {
				this.swipeForward();
				this.setNextSlider();
			}, props.delay);
			this.setNextSlider.funStartTime = Date.now();
		}
	}

	setNextSlider: {
		(): void;
		funStartTime?: number;
	} = () => {
		const { delay } = this.props;
		if (this.state.stopSwipe || (this.setNextSlider.funStartTime && Date.now() - this.setNextSlider.funStartTime < delay)) return;
		this.timeoutId = setTimeout(() => {
			if (!this.state.stopSwipe) this.swipeForward();
			this.setNextSlider();
		}, delay);
		this.setNextSlider.funStartTime = Date.now();
	}

	getFocusIndex = () => this.state.focusIndex;

	focusIndex = (focusIndex: number) => {
		this.setState({
			focusIndex: this.setRightFocusIndex(focusIndex),
			stopSwipe: false
		});
	}

	swipeForward = () => {
		if (this.state.swiping) return;
		this.state.swiping = true;
		const { focusIndex } = this.state;
		const isLast = focusIndex === this.getItemsLength() - 2;

		if (isLast) {
			this.setState({
				focusIndex: this.setRightFocusIndex(focusIndex + 1),
				haveAnimate: true
			}, () => {
				setTimeout(() => {
					this.setState({
						focusIndex: 1,
						haveAnimate: false
					});
					this.state.swiping = false;
				}, this.props.speed);
			});
		} else {
			this.setState({
				focusIndex: this.setRightFocusIndex(focusIndex + 1),
				haveAnimate: true
			});
			setTimeout(() => {
				this.state.swiping = false;
			}, this.props.speed);
		}
	}

	swipeBackWord = () => {
		if (this.state.swiping) return;
		this.state.swiping = true;
		const { focusIndex } = this.state;
		const isFirst = focusIndex === 1;

		if (isFirst) {
			this.setState({
				focusIndex: this.setRightFocusIndex(focusIndex - 1),
				haveAnimate: true
			}, () => {
				setTimeout(() => {
					this.setState({
						focusIndex: this.getItemsLength() - 2,
						haveAnimate: false
					});
					this.state.swiping = false;
				}, this.props.speed);
			});
		} else {
			this.setState({
				focusIndex: this.setRightFocusIndex(focusIndex - 1),
				haveAnimate: true
			});
			setTimeout(() => {
				this.state.swiping = false;
			}, this.props.speed);
		}
	}

	getItemsLength = () => {
		const { children } = this.props;
		const childrensLeng = React.Children.toArray(children).length;
		return childrensLeng > 1 ? childrensLeng + 2 : childrensLeng;
	}

	setRightFocusIndex = (focusIndex: number): number => {
		const length = this.getItemsLength();
		return focusIndex < 0 ? length - Math.abs(focusIndex) % length : focusIndex % length;
	}

	checkIsToucheEvent = (e: React.SyntheticEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => "changedTouches" in e;

	mouseOrTouchDownHandler = (e: any) => {
		const { isHorizontal } = this.state;
		this.setState({ stopSwipe: true });
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
			if (isHorizontal) {
				this.startClientX = e.changedTouches[0].clientX;
			} else {
				this.startClientY = e.changedTouches[0].clientY;
			}
		} else {
			if (isHorizontal) {
				this.startClientX = e.clientX;
			} else {
				this.startClientY = e.clientY;
			}
		}
		this.refs.content.style.webkitTransition = "all 0.06125s 0s linear";
	}

	mouseOrTouchMoveHandler: {
		(e: any): void;
	} = (e) => {
		const isToucheEvent = this.checkIsToucheEvent(e);
		const { childrenLength, focusIndex, isHorizontal } = this.state;
		if (isToucheEvent) {
			if (isHorizontal) {
				this.endClientX = e.changedTouches[0].clientX;
			} else {
				this.endClientY = e.changedTouches[0].clientY;
			}
		} else {
			if (isHorizontal) {
				this.endClientX = e.clientX;
			} else {
				this.endClientY = e.clientY;
			}
		}
		this.refs.content.style.webkitTransform = `translate${isHorizontal ? "X" : "Y"}(${this.refs.container.getBoundingClientRect()[isHorizontal ? "width" : "height"] * (-focusIndex) - this[isHorizontal ? "startClientX" : "startClientY"] + this[isHorizontal ? "endClientX" : "endClientY"]}px)`;
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
		const { transitionTimingFunction, speed } = this.props;
		const transition = `all ${speed}ms 0s ${transitionTimingFunction}`;
		this.refs.content.style.webkitTransition = transition;
		this.state.stopSwipe = false;
		let { easy } = this.props;
		if (easy < 0) easy = 0;
		if (easy > 1) easy = 1;
		const movePosition = this.endClientX - this.startClientX;
		const isNext = movePosition < 0;
		let focusIndex = this.state.focusIndex + movePosition / this.refs.container.getBoundingClientRect().width;
		focusIndex = isNext ? Math.ceil(focusIndex + easy / 2) : Math.floor(focusIndex - easy / 2);
		focusIndex = this.setRightFocusIndex(focusIndex);
		if (focusIndex === this.state.focusIndex) {
			this.refs.content.style.webkitTransform = `translateX(${this.refs.container.getBoundingClientRect().width * (-focusIndex / childrenLength) - this.startClientX + this.endClientX}px)`;
		} else {
			if (isNext) { this.swipeForward(); } else { this.swipeBackWord(); }
		}
		if (this.props.autoSwipe && !this.state.isSingleChildren && 0) {
			this.setNextSlider();
		}
	}

	render() {
		// tslint:disable-next-line:no-unused-variable
		const { children, initialFocusIndex, showIcon, animate, canSwipe, autoSwipe, speed, delay, easy, direction, style, transitionTimingFunction, iconSize, ...attributes } = this.props;
		const { focusIndex, stopSwipe, childrenLength, isSingleChildren } = this.state;
		const { theme } = this.context;
		const styles = getStyles(this);
		const childrens = React.Children.toArray(children);
		const childrensLeng = childrens.length;
		if (childrensLeng > 1) {
			childrens.push(childrens[0]);
			childrens.unshift(childrens[childrensLeng - 1]);
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
					onMouseDown={
						canSwipe ? this.mouseOrTouchDownHandler : void 0
					}
					onTouchStart={
						canSwipe ? this.mouseOrTouchDownHandler : void 0
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
	const { transitionTimingFunction, speed } = swipe.props;
	const transition = `transform ${speed}ms 0s ${transitionTimingFunction}`;
	const { focusIndex, childrenLength, isHorizontal, isSingleChildren, haveAnimate } = swipe.state;

	return {
		container: {
			display: "flex",
			flexDirection: isHorizontal ? "row" : "column",
			alignItems: "center",
			justifyContent: "center",
			position: "relative",
			width: "100%",
			height: "auto",
			overflow: "hidden",
			flex: "0 0 auto",
		},
		content: {
			overflow: "hidden",
			flex: "0 0 auto",
			display: "flex",
			flexDirection: isHorizontal ? "row" : "column",
			flexWrap: "nowrap",
			alignItems: "center",
			justifyContent: "center",
			position: "relative",
			height: isHorizontal ? "100%" : `${childrenLength * 100}%`,
			width: isHorizontal ? `${childrenLength * 100}%` : "100%",
			WebkitTransform: `translate${isHorizontal ? "X" : "Y"}(${-focusIndex * 100 / childrenLength}%)`,
			left: (isHorizontal && !isSingleChildren) ? `${((isSingleChildren ? 0 : 2 + childrenLength) / 2 - 0.5) * 100}%` : void 0,
			top: isHorizontal ? void 0 : `${((isSingleChildren ? 0 : 2 + childrenLength) / 2 - 0.5) * 100}%`,
			transition: haveAnimate ? transition : void 0,
			WebkitTransition: haveAnimate ? transition : void 0,
		},
		item: {
			position: "relative",
			overflow: "hidden",
			width: isHorizontal ? `${100 / childrenLength}%` : "100%",
			height: isHorizontal ? "100%" : `${100 / childrenLength}%`,
			flex: "0 0 auto",
			display: "flex",
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "center",
			userSelect: "none",
			userDrag: "none",
			WebkitUserDrag: "none",
		}
	};
}
