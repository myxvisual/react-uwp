import * as React from "react";
import { findDOMNode } from "react-dom";

const defaultProps: SwipeProps = __DEV__ ? require("./devDefaultProps").default : {};

export interface DataProps {
	initialFocusIndex?: number;
	canSwipe?: boolean;
	autoSwipe?: boolean;
	speed?: number;
	easey?: number;
	delay?: number;
	directionIsRight?: boolean;
	bezier?: string;
	iconSize?: number;
	showIcon?: boolean;
	animate?: "slide" | "opacity" | "scale";
}

export interface SwipeProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

interface SwipeState {
	stopSwip?: boolean;
	focusIndex?: number;
	childrenLength?: number;
	isSingleChildren?: boolean;
	haveAnimate?: boolean;
	swiping?: boolean;
}

export default class Swipe extends React.Component<SwipeProps, SwipeState> {
	static defaultProps: SwipeProps = {
		...defaultProps,
		autoSwipe: false,
		className: "",
		animate: "slide",
		bezier: "cubic-bezier(.8, -.5, .2, 1.4)",
		initialFocusIndex: 0,
		canSwipe: true,
		speed: 1000,
		delay: 5000,
		easey: 0.85,
		directionIsRight: true,
	};

	static contextTypes = { theme: React.PropTypes.object };

	isSingleChildren = React.Children.count(this.props.children) === 1;

	state: SwipeState = {
		isSingleChildren: this.isSingleChildren,
		focusIndex: this.isSingleChildren ? this.props.initialFocusIndex : this.props.initialFocusIndex + 1,
		stopSwip: false,
		childrenLength: 0,
		haveAnimate: true,
		swiping: false
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
		if (this.props.autoSwipe && !isSingleChildren) {
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

	setNextSlider: {
		(): void;
		funStartTime?: number;
	} = () => {
		const { delay } = this.props;
		if (this.state.stopSwip || !this.props.autoSwipe) {
			setTimeout(() => {
				this.setNextSlider();
			}, delay);
			return;
		};
		if (this.setNextSlider.funStartTime && Date.now() - this.setNextSlider.funStartTime < delay) return;
		this.timeoutId = setTimeout(() => {
			if (!this.state.stopSwip) {
				this.swipeForward();
			}
			this.setNextSlider();
		}, delay);
		this.setNextSlider.funStartTime = Date.now();
	}

	checkIsToucheEvent = (e: React.SyntheticEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => "changedTouches" in e;

	mouseEnterHandler = (e: React.SyntheticEvent<HTMLDivElement>) => {
		this.state.stopSwip = true;
	}

	mouseLeaveHandler = (e: React.SyntheticEvent<HTMLDivElement>) => {
		this.state.stopSwip = false;
	}

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
		this.refs.content.style.webkitTransform = `translateX(${this.refs.container.getBoundingClientRect().width * (-focusIndex) - this.startClientX + this.endClientX}px)`;
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
		const { bezier, speed } = this.props;
		const transition = `all ${speed}ms 0s ${bezier}`;
		this.refs.content.style.webkitTransition = transition;
		this.state.stopSwip = false;
		let { easey } = this.props;
		if (easey < 0) easey = 0;
		if (easey > 1) easey = 1;
		const movePosition = this.endClientX - this.startClientX;
		const isNext = movePosition < 0;
		let focusIndex = this.state.focusIndex + movePosition / this.refs.container.getBoundingClientRect().width;
		focusIndex = isNext ? Math.ceil(focusIndex + easey / 2) : Math.floor(focusIndex - easey / 2);
		focusIndex = this.setRightFocusIndex(focusIndex);
		if (focusIndex === this.state.focusIndex) {
			this.refs.content.style.webkitTransform = `translateX(${this.refs.container.getBoundingClientRect().width * (-focusIndex / childrenLength) - this.startClientX + this.endClientX}px)`;
		} else {
			if (isNext) { this.swipeForward(); } else { this.swipeBackWord(); }
		}
		this.setNextSlider();
	}

	render() {
		// tslint:disable-next-line:no-unused-variable
		const { children, initialFocusIndex, showIcon, animate, canSwipe, autoSwipe, speed, delay, easey, directionIsRight, style, bezier, iconSize, ...attributes } = this.props;
		const { focusIndex, stopSwip, childrenLength, isSingleChildren } = this.state;
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
						canSwipe ? this.mouseOrTouchDownHandler : void(0)
					}
					onTouchStart={
						canSwipe ? this.mouseOrTouchDownHandler : void(0)
					}
					onMouseEnter={this.mouseEnterHandler}
					onMouseLeave={this.mouseLeaveHandler}
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
	const { bezier, speed } = swipe.props;
	const transition = `all ${speed}ms 0s ${bezier}`;
	const { focusIndex, childrenLength, isSingleChildren, haveAnimate } = swipe.state;

	return {
		container: {
			display: "flex",
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "center",
			position: "relative",
			overflow: "hidden",
			width: "100%",
			height: "auto",
		},
		content: {
			flex: "0 0 auto",
			display: "flex",
			flexDirection: "row",
			flexWrap: "nowrap",
			alignItems: "center",
			justifyContent: "center",
			position: "relative",
			height: "100%",
			width: `${childrenLength * 100}%`,
			WebkitTransform: `translate3D(${-focusIndex * 100 / childrenLength}%, 0px, 0px)`,
			left: `${((isSingleChildren ? 0 : 2 + childrenLength) / 2 - 0.5) * 100}%`,
			transition: haveAnimate ? transition : void(0),
			WebkitTransition: haveAnimate ? transition : void(0),
		},
		item: {
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
		}
	};
}
