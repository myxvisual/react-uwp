import * as React from "react";

interface DataProps {
	direction?: "Left" | "Right" | "Top" | "Bottom";
	speed?: number;
	enterDelay?: number;
	mode?: "In" | "Out" | "Both";
	leaveDelay?: number;
	distance?: string | number;
}
interface SlideInChildProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}
export default class SlideInChild extends React.Component<SlideInChildProps, {}> {
	static defaultProps = {
		speed: 500,
		enterDelay: 0,
		leaveDelay: 0,
		direction: "Left",
		mode: "Both",
		distance: "100%",
	};

	enterTimer: number;
	leaveTimer: number;
	rootElm: HTMLDivElement;

	componentWillAppear(callback: () => void) {
		if (this.props.mode !== "Out") {
			this.initializeAnimation(callback);
		} else {
			callback();
		};
	}

	componentWillEnter(callback: () => void) {
		if (this.props.mode !== "Out") {
			this.initializeAnimation(callback);
		} else {
			callback();
		}
	}
	componentDidEnter() {
		if (this.props.mode !== "Out") this.animate();
	}

	componentWillLeave(callback: () => void) {
		if (this.props.mode !== "In") {
			this.initializeAnimation(callback, true);
		} else {
			this.rootElm.style.display = "none";
			callback();
		}
	}

	componentWillUnmount() {
		clearTimeout(this.enterTimer);
		clearTimeout(this.leaveTimer);
	}

	animate = (callback = () => {}) => {
		const { speed, enterDelay } = this.props;
		const { style } = this.rootElm;
		style.opacity = "1";
		style.transform = "translate(0, 0)";

		this.enterTimer = setTimeout(callback, speed + enterDelay) as any;
	}

	initializeAnimation = (callback = () => {}, revers = false) => {
		let { direction, speed, leaveDelay, distance } = this.props;
		const { style } = this.rootElm;
		distance = typeof distance === "string" ? distance : `${distance}px`;
		const x = direction === "Left" ? `${revers ? "-" : ""}${distance}` :
			direction === "Right" ? `${revers ? "" : "-"}${distance}` : "0";
		const y = direction === "Top" ? `${revers ? "" : "-"}${distance}` :
			direction === "Bottom" ? `${revers ? "-" : ""}${distance}` : "0";
		style.transform = `translate(${x}, ${y})`;
		style.webkitTransform = `translate(${x}, ${y})`;
		style.opacity = "0";

		this.leaveTimer = setTimeout(callback, speed / 2 + leaveDelay) as any;
	}

	render() {
		const {
			children,
			enterDelay, // tslint:disable-line:no-unused-variable
			leaveDelay, // tslint:disable-line:no-unused-variable
			direction, // tslint:disable-line:no-unused-variable
			speed,
			style,
		} = this.props;

		return (
			<div
				ref={(rootElm) => this.rootElm = rootElm}
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					width: "100%",
					height: "100%",
					transition: `all ${speed}ms 0s ease-in-out`,
					...style
				}}
			>
				{children}
			</div>
		);
	}
}
