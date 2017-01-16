import * as React from "react";

import prefixAll from "../../common/prefixAll";
const defaultProps: SwipeProps = __DEV__ ? require("./devDefaultProps").default : {};

interface DataProps {
	initialFocusIndex?: number;
	canSwipe?: boolean;
	autoSwipe?: boolean;
	speed?: number;
	easey?: number;
	directionIsRight?: boolean;
}
interface SwipeProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}
interface SwipeState {
	stopSwip?: boolean;
	focusIndex?: number;
	updateComponent?: boolean;
}
const styles = getStyles();
export default class Swipe extends React.Component<SwipeProps, SwipeState> {
	static defaultProps = { ...defaultProps, className: "" };

	state: SwipeState = {
		focusIndex: this.props.initialFocusIndex || 0,
		updateComponent: false,
		stopSwip: false
	};

	private timeoutId: any;
	private currentTarget: HTMLDivElement;
	private width: number;
	private startPosition: number;
	private endPosition: number;
	private clientX: number;
	private originClassName: string;

	componentDidMount() {
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

		const length = this.getItemsLength();
		// this.clientX = isToucheEvent ? e.changedTouches[0] : e;
		if (isToucheEvent) {
			this.clientX = e.changedTouches[0].clientX;
		} else {
			this.clientX = e.clientX;
		}
		const currentTarget = e.currentTarget as HTMLDivElement;
		currentTarget.style.webkitTransition = "all 0.06125s 0s linear";
		this.currentTarget = currentTarget;
		this.width = currentTarget.getClientRects()[0].width;
		const { left } = currentTarget.style;
		const startPositions = left.match(/(\-?\d+\.*\d*)(.+)$/);
		switch (startPositions[2]) {
			case "rem": {
				this.startPosition = (+startPositions[1]) * 16;
				break;
			}
			case "%": {
				this.startPosition = (+startPositions[1] / 100) * this.width / length;
				break;
			}
			default: {
				this.startPosition = (+startPositions[1]);
			}
		}
		window.addEventListener("touchmove", this.mouseOrTouchMoveHandler);
		window.addEventListener("mousemove", this.mouseOrTouchMoveHandler);
		window.addEventListener("touchend", this.mouseOrTouchUpHandler);
		window.addEventListener("mouseup", this.mouseOrTouchUpHandler);
	}

	mouseOrTouchMoveHandler: {
		(e: any): void;
	} = (e) => {
		const isToucheEvent = this.checkIsToucheEvent(e);
		let clientX: number;
		if (isToucheEvent) {
			clientX = e.changedTouches[0].clientX;
		} else {
			clientX = e.clientX;
		}
		this.endPosition = this.startPosition - this.clientX + clientX;
		this.currentTarget.style.left = `${this.endPosition / 16}rem`;
	}

	mouseOrTouchUpHandler = (e: any) => {
		this.currentTarget.style.webkitTransition = "all 0.5s 0s cubic-bezier(.8, -.5, .2, 1.4)";
		const length = this.getItemsLength();
		this.state.stopSwip = false;
		let easey = this.props.easey;
		if (easey < 0) easey = 0;
		if (easey > 1) easey = 1;
		const isNext = this.startPosition > this.endPosition;
		let focusIndex = (this.width / 2 - this.endPosition) / this.width * length - 0.5;
		if (typeof focusIndex === "number" && `${focusIndex}` === "NaN") {
			return;
		}
		focusIndex = isNext ? Math.ceil(focusIndex - 1 + easey) : Math.floor(focusIndex + 1 - easey);
		focusIndex = focusIndex < 0 ? length - Math.abs(focusIndex) % length : focusIndex % length;
		if (focusIndex === this.state.focusIndex) {
			this.currentTarget.style.left = `${length * 50 - 50 - focusIndex * 100}%`;
		} else {
			this.setState({
				focusIndex,
				stopSwip: false
			});
		}
		this.setNextSlider();
		window.removeEventListener("touchmove", this.mouseOrTouchMoveHandler);
		window.removeEventListener("mousemove", this.mouseOrTouchMoveHandler);
		window.removeEventListener("touchend", this.mouseOrTouchUpHandler);
		window.removeEventListener("mouseup", this.mouseOrTouchUpHandler);
	}

	render() {
		const { children, initialFocusIndex, canSwipe, autoSwipe, speed, easey, directionIsRight, style, ...attributes } = this.props;
		const length = this.getItemsLength();
		const { focusIndex, stopSwip } = this.state;
		return (
			<div {...attributes} ref="container" style={{ ...styles.container, ...style }}>
				<div
					onMouseDown={
						canSwipe ? this.mouseOrTouchDownHandler : void(0)
					}
					onTouchStart= {
						canSwipe ? this.mouseOrTouchDownHandler : void(0)
					}
					style={{
						...styles.content,
						width: `${length * 100}%`,
						left: `${length * 50 - 50 - focusIndex * 100}%`,
					}}
				>
					{React.Children.map(children, (child, index) => {
						return (
							<div style={styles.item} key={`${index}`}>
								{child}
							</div>
						);
					})}
				</div>
			</div>
		);
	}
}

function getStyles(): {
	container?: React.CSSProperties;
	content?: React.CSSProperties;
	item?: React.CSSProperties;
} {
	const content = {
		flex: "0 0 auto",
		cursor: "pointer",
		display: "flex",
		flexDirection: "row",
		flexWrap: "nowrap",
		alignItems: "center",
		justifyContent: "center",
		position: "relative",
		height: "100%",
		overflow: "hidden",
	} as React.CSSProperties;
	return {
		container: prefixAll({
			display: "flex",
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "center",
			position: "relative",
			overflow: "hidden",
			width: "100%",
			height: "auto",
			transition: "all 0.5s 0s cubic-bezier(.8, -.5, .2, 1.4)",
		}),
		content: { ...prefixAll(content), ...content },
		item: prefixAll({
			position: "relative",
			pointerEvents: "none",
			width: "100%",
			height: "100%",
			display: "flex",
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "center",
			userSelect: "none",
			userDrag: "none",
			WebkitUserDrag: "none",
		})
	};
}
