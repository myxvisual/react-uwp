import * as React from "react";

import { ThemeType } from "../../styles/ThemeType";

const defaultProps: SliderProps = __DEV__ ? require("./devDefaultProps").default : {};

export interface DataProps {
	minValue?: number;
	maxValue?: number;
	initValue?: number;
	onChangeValue?: (value?: number) => void;
	barHeight?: number;
}

export interface SliderProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

interface SliderState {
	currValue?: number;
	valueRatio?: number;
}

export default class Slider extends React.Component<SliderProps, SliderState> {
	static defaultProps: SliderProps = {
		...defaultProps,
		minValue: 0,
		maxValue: 100,
		initValue: 50,
		onChangeValue: () => {},
		width: 400,
		height: 28,
		barHeight: 4,
		onMouseEnter: () => {},
		onMouseLeave: () => {},
		onMouseDown: () => {},
		onMouseUp: () => {},
	};

	state: SliderState = {
		currValue: this.props.initValue,
		valueRatio: this.props.initValue / (this.props.maxValue - this.props.minValue)
	};
	rootElm: HTMLDivElement;
	controllerElm: HTMLDivElement;
	barElm: HTMLDivElement;

	static contextTypes = { theme: React.PropTypes.object };
	context: { theme: ThemeType };

	handelMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
		const controller = e.currentTarget.children[1] as HTMLDivElement;
		Object.assign(controller.style, {
			background: this.context.theme.baseHigh
		} as CSSProperties);
		this.props.onMouseEnter(e);
	}

	handelMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
		Object.assign(this.controllerElm.style, {
			background: this.context.theme.accent
		} as CSSProperties);
		this.props.onMouseLeave(e);
	}

	handelOnClick = (e: React.MouseEvent<HTMLDivElement>) => {
		Object.assign(this.controllerElm.style, {
			background: this.context.theme.accent
		} as CSSProperties);
		this.props.onClick(e);
		this.setValueByEvent(e);
	}

	handelMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
		document.body.addEventListener("mousemove", this.setValueByEvent);
		Object.assign(this.controllerElm.style, {
			background: this.context.theme.accent
		} as CSSProperties);
		this.props.onMouseDown(e);
		this.setValueByEvent(e);
	}

	handelMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
		document.body.removeEventListener("mousemove", this.setValueByEvent);
		this.props.onMouseUp(e);
	}

	setValueByEvent = (e: any) => {
		const { maxValue, minValue } = this.props;
		const { left, width } = this.rootElm.getBoundingClientRect();
		const mouseLeft = e.clientX;
		const controllerWidth = this.controllerElm.getBoundingClientRect().width;
		let valueRatio = (mouseLeft - left) / (width - controllerWidth);
		valueRatio = valueRatio < 0 ? 0 : (valueRatio > 1 ? 1 : valueRatio);
		const currValue = minValue + (maxValue - minValue) * valueRatio;
		this.state.currValue = currValue;
		this.state.valueRatio = valueRatio;
		const barTransform = `translateX(${(valueRatio - 1) * 100}%)`;
		Object.assign(this.barElm.style, {
			transform: barTransform,
			webKitTransform: barTransform,
			msTransform: barTransform,
			mozTransform: barTransform,
		} as CSSProperties);
		const width2px: number = Number.parseFloat(this.props.width as any);
		const transform = `translateX(${valueRatio * width2px - 4}px)`;
		Object.assign(this.controllerElm.style, {
			transform,
			webKitTransform: transform,
			msTransform: transform,
			mozTransform: transform,
		} as CSSProperties);
		this.props.onChangeValue(currValue);
	}

	render() {
		const {
			minValue, // tslint:disable-line:no-unused-variable
			maxValue, // tslint:disable-line:no-unused-variable
			initValue, // tslint:disable-line:no-unused-variable
			onChangeValue, // tslint:disable-line:no-unused-variable
			barHeight, // tslint:disable-line:no-unused-variable
			...attributes
		} = this.props;
		const { currValue } = this.state;
		const { theme } = this.context;
		const styles = getStyles(this);

		return (
			<div
				{...attributes}
				ref={elm => this.rootElm = elm}
				style={styles.root}
				onMouseEnter={this.handelMouseEnter}
				onMouseLeave={this.handelMouseLeave}
				onMouseDown={this.handelMouseDown}
				onMouseUp={this.handelMouseUp}
			>
				<div style={styles.barContainer}>
					<div style={styles.bar} ref={elm => this.barElm = elm} />
				</div>
				<div style={styles.controller} ref={elm => this.controllerElm = elm} />
			</div>
		);
	}
}

function getStyles(slider: Slider): {
	root?: React.CSSProperties;
	barContainer?: React.CSSProperties;
	bar?: React.CSSProperties;
	controller?: React.CSSProperties;
} {
	const {
		context: { theme },
		props: { style, width, height, barHeight },
		state: { currValue, valueRatio }
	} = slider;
	const { prepareStyles } = theme;
	const width2px: number = Number.parseFloat(width as any);
	const height2px: number = Number.parseFloat(height as any);
	const barHeight2px: number = Number.parseFloat(barHeight as any);
	const transition = "all .25s 0s linear";

	return {
		root: prepareStyles({
			width,
			height: height2px,
			...style,
			position: "relative",
		}),
		barContainer: {
			background: theme.baseLow,
			position: "relative",
			width: "100%",
			overflow: "hidden",
			height: 4,
			left: 0,
			top: `calc(50% - ${barHeight2px}px)`,
		},
		bar: {
			background: theme.accent,
			position: "absolute",
			width: "100%",
			transform: `translateX(${(valueRatio - 1) * 100}%)`,
			height: "100%",
			left: 0,
			top: 0,
			transition,
		},
		controller: {
			position: "absolute",
			background: theme.accent,
			borderRadius: 4,
			left: 0,
			top: 0,
			width: 8,
			height: height2px,
			transform: `translateX(${valueRatio * width2px - 4}px)`,
			transition,
		},
	};
};
