import * as React from "react";

export interface DataProps {
	appearAnimate?: boolean;
	enterDelay?: number;
	leaveDelay?: number;
	maxScale?: number;
	minScale?: number;
	mode?: "In" | "Out" | "Both";
	speed?: number;
}
export interface ScaleInOutChildProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}
export default class ScaleInOutChild extends React.Component<ScaleInOutChildProps, {}> {
	static defaultProps = {
		appearAnimate: true,
		enterDelay: 0,
		leaveDelay: 0,
		maxScale: 1,
		minScale: 0,
		mode: "Both",
		speed: 500,
	};

	enterTimer: number;
	leaveTimer: number;
	rootElm: HTMLDivElement;

	componentWillAppear = this.props.appearAnimate ? (callback: () => void) => {
		if (this.props.mode !== "Out") {
			this.initializeAnimation(callback);
		} else { callback(); };
	} : void 0;

	componentDidAppear = this.props.appearAnimate ? () => {
		if (this.props.mode !== "Out") this.animate();
	} : void 0;

	componentWillEnter(callback: () => void) {
		if (this.props.mode !== "Out") {
			this.initializeAnimation(callback);
		} else { callback(); }
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
		const transform = `scale(${maxScale})`;
		Object.assign(style, {
			transform,
			webkitTransform: transform,
			opacity: "1"
		} as CSSStyleDeclaration);

		this.enterTimer = setTimeout(callback, speed + enterDelay) as any;
	}

	initializeAnimation = (callback = () => {}, revers = false) => {
		const { minScale, speed, leaveDelay } = this.props;
		const transform = `scale(${minScale})`;
		Object.assign(this.rootElm.style, {
			transform,
			webkitTransform: transform,
			opacity: "0"
		} as CSSStyleDeclaration);

		this.leaveTimer = setTimeout(callback, speed / 2 + leaveDelay) as any;
	}

	render() {
		const {
			appearAnimate, // tslint:disable-line:no-unused-variable
			children,
			enterDelay, // tslint:disable-line:no-unused-variable
			leaveDelay, // tslint:disable-line:no-unused-variable
			maxScale, // tslint:disable-line:no-unused-variable
			minScale, // tslint:disable-line:no-unused-variable
			speed,
			style,
			...attributes
		} = this.props;

		return (
			<div
				{...attributes}
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
