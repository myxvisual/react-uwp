import * as React from "react";

interface DataProps {
	minScale?: number;
	maxScale?: number;
	speed?: number;
	enterDelay?: number;
	leaveDelay?: number;
	mode?: "In" | "Out" | "Both";
}
interface ScaleInOutChildProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}
export default class ScaleInOutChild extends React.Component<ScaleInOutChildProps, {}> {
	static defaultProps = {
		speed: 500,
		enterDelay: 0,
		leaveDelay: 0,
		minScale: 0,
		maxScale: 1,
		mode: "Both",
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
		const { speed, maxScale, enterDelay } = this.props;
		const { style } = this.rootElm;
		style.opacity = "1";
		style.transform = `scale(${maxScale})`;

		this.enterTimer = setTimeout(callback, speed + enterDelay) as any;
	}

	initializeAnimation = (callback = () => {}, revers = false) => {
		const { minScale, speed, leaveDelay } = this.props;
		const { style } = this.rootElm;
		style.transform = `scale(${minScale})`;
		style.webkitTransform = `scale(${minScale})`;
		style.opacity = "0";

		this.leaveTimer = setTimeout(callback, speed / 2 + leaveDelay) as any;
	}

	render() {
		const {
			children,
			enterDelay, // tslint:disable-line:no-unused-variable
			leaveDelay, // tslint:disable-line:no-unused-variable
			minScale, // tslint:disable-line:no-unused-variable
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
