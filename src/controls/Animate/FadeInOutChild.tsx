import * as React from "react";

interface DataProps {
	appearAnimate?: boolean;
	enterDelay?: number;
	leaveDelay?: number;
	maxValue?: number;
	minValue?: number;
	mode?: "In" | "Out" | "Both";
	speed?: number;
}
interface FadeInOutChildProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}
export default class FadeInOutChild extends React.Component<FadeInOutChildProps, {}> {
	static defaultProps = {
		appearAnimate: true,
		enterDelay: 0,
		leaveDelay: 0,
		maxValue: 1,
		minValue: 0,
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
			Object.assign(this.rootElm.parentElement.style, {
				overflow: "hidden"
			} as CSSStyleDeclaration);
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
		const { speed, maxValue, enterDelay } = this.props;
		const { style } = this.rootElm;
		style.opacity = `${maxValue}`;
		Object.assign(this.rootElm.parentElement.style, {
			overflow: "inherit"
		} as CSSStyleDeclaration);

		this.enterTimer = setTimeout(callback, speed + enterDelay) as any;
	}

	initializeAnimation = (callback = () => {}, revers = false) => {
		const { minValue, speed, leaveDelay } = this.props;
		const { style } = this.rootElm;
		style.opacity = `${minValue}`;

		this.leaveTimer = setTimeout(callback, speed / 2 + leaveDelay) as any;
	}

	render() {
		const {
			appearAnimate, // tslint:disable-line:no-unused-variable
			children,
			enterDelay, // tslint:disable-line:no-unused-variable
			leaveDelay, // tslint:disable-line:no-unused-variable
			maxValue, // tslint:disable-line:no-unused-variable
			minValue, // tslint:disable-line:no-unused-variable
			speed,
			style,
			...attributes
		} = this.props;

		return (
			<div
				{...attributes}
				ref={(rootElm) => this.rootElm = rootElm}
				style={{
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
