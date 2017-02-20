import * as React from "react";
import * as ReactTransitionGroup from "react-addons-transition-group";
import ScaleInOutChild from "./ScaleInOutChild";
interface DataProps {
	[key: string]: any;
}
export interface ScaleInOutProps extends DataProps {
	minScale?: number;
	maxScale?: number;
	speed?: number;
	enterDelay?: number;
	leaveDelay?: number;
	mode?: "In" | "Out" | "Both";
}
interface ScaleInOutState {}

export default class ScaleInOut extends React.Component<ScaleInOutProps, ScaleInOutState> {
	static defaultProps: ScaleInOutProps = {
		minScale: 0,
		maxScale: 1,
		speed: 500,
		enterDelay: 0,
		leaveDelay: 0,
		mode: "Both",
		children: <div>ScaleInOut</div>,
	};

	render() {
		const {
			minScale,
			maxScale,
			speed,
			enterDelay,
			leaveDelay,
			style, // tslint:disable-line:no-unused-variable
			children,
			childAttribute,
			mode,
			...others,
		} = this.props;
		const styles = getStyles(this);

		return (
			<ReactTransitionGroup
				{...others as any}
				style={styles.root}
				component="div"
			>
				{React.Children.map(children, (child: any, index) => (
					<ScaleInOutChild
						key={child.key}
						minScale={minScale}
						maxScale={maxScale}
						enterDelay={enterDelay}
						leaveDelay={leaveDelay}
						mode={mode}
						speed={speed}
						{...childAttribute}
					>
						{child}
					</ScaleInOutChild>
				))}
			</ReactTransitionGroup>
		);
	}
}

function getStyles(ScaleInOut: ScaleInOut): {
	root?: React.CSSProperties;
} {
	const {
		props: { style, speed }
	} = ScaleInOut;

	return {
		root: {
			position: "relative",
			overflow: "hidden",
			transition: `transform ${speed}ms 0s ease-in-out`,
			...style,
		},
	};
}
