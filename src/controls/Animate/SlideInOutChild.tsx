import * as React from "react";

export interface DataProps {
	appearAnimate?: boolean;
	direction?: "Left" | "Right" | "Top" | "Bottom";
	distance?: string | number;
	enterDelay?: number;
	leaveDelay?: number;
	mode?: "In" | "Out" | "Both";
	speed?: number;
}
export interface SlideInChildProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}
export default class SlideInChild extends React.Component<SlideInChildProps, {}> {
	static defaultProps = {
		appearAnimate: true,
		direction: "Left",
		distance: "100%",
		enterDelay: 0,
		leaveDelay: 0,
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
		const { speed, enterDelay } = this.props;
		const transform = "translate(0, 0)";
		Object.assign(this.rootElm.style, {
			transform,
			webkitTransform: transform,
			opacity: "1"
		} as CSSStyleDeclaration);

		this.enterTimer = setTimeout(callback, speed + enterDelay) as any;
	}

	initializeAnimation = (callback = () => {}, revers = false) => {
		Object.assign(this.rootElm.parentElement.style, {
			overflow: "hidden"
		} as CSSStyleDeclaration);
		let { direction, speed, leaveDelay, distance } = this.props;
		distance = typeof distance === "string" ? distance : `${distance}px`;
		const x = direction === "Left" ? `${revers ? "-" : ""}${distance}` :
			direction === "Right" ? `${revers ? "" : "-"}${distance}` : "0";
		const y = direction === "Top" ? `${revers ? "" : "-"}${distance}` :
			direction === "Bottom" ? `${revers ? "-" : ""}${distance}` : "0";
		const transform = `translate(${x}, ${y})`;
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
			direction, // tslint:disable-line:no-unused-variable
			distance, // tslint:disable-line:no-unused-variable
			enterDelay, // tslint:disable-line:no-unused-variable
			leaveDelay, // tslint:disable-line:no-unused-variable
			mode, // tslint:disable-line:no-unused-variable
			speed,
			style,
			...attributes,
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
