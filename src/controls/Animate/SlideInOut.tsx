import * as React from "react";
import * as ReactTransitionGroup from "react-addons-transition-group";
import SlideInOutChild from "./SlideInOutChild";
interface DataProps {
	[key: string]: any;
}
export interface SlideInOutProps extends DataProps {
	direction?: "Left" | "Right" | "Top" | "Bottom";
	speed?: number;
	enterDelay?: number;
	style?: React.CSSProperties;
	leaveDelay?: number;
	children?: React.ReactElement<any>;
	childAttribute?: React.HTMLAttributes<HTMLDivElement>;
	mode?: "In" | "Out" | "Both";

	distance?: string | number;
}
interface SlideInOutState {}

export default class SlideInOut extends React.Component<SlideInOutProps, SlideInOutState> {
	static defaultProps: SlideInOutProps = {
		speed: 500,
		enterDelay: 0,
		leaveDelay: 0,
		direction: "Left",
		mode: "Both",
		distance: "100%",
		children: <div>SlideInOut</div>,
	};

	render() {
		const {
			direction,
			speed,
			enterDelay,
			leaveDelay,
			style, // tslint:disable-line:no-unused-variable
			children,
			childAttribute,
			mode,
			distance,
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
					<SlideInOutChild
						key={child.key}
						direction={direction}
						enterDelay={enterDelay}
						leaveDelay={leaveDelay}
						mode={mode}
						speed={speed}
						distance={distance}
						{...childAttribute}
					>
						{child}
					</SlideInOutChild>
				))}
			</ReactTransitionGroup>
		);
	}
}

function getStyles(SlideInOut: SlideInOut): {
	root?: React.CSSProperties;
} {
	const {
		props: { style, speed }
	} = SlideInOut;

	return {
		root: {
			position: "relative",
			overflow: "hidden",
			transition: `transform ${speed}ms 0s ease-in-out`,
			...style,
		},
	};
}
