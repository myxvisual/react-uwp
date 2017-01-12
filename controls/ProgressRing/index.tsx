import * as React from "react";

import animation from "../../common/animation";
import prefixAll from "../../common/prefixAll";
import * as easing from "../../common/easing";
import { ThemeType } from "../../style/ThemeType";
import * as styles from "./index.scss";

let theme: ThemeType;
const defaultProps: ProgressRingProps = __DEV__ ? require("./devDefaultProps").default : {};

export interface DataProps {
	itemLength?: number;
	itmeStyle?: React.CSSProperties;
	size?: number;
	itemSize?: number;
	delay?: number;
}
interface ProgressRingProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}
interface ProgressRingState {}

export default class ProgressRing extends React.Component<ProgressRingProps, ProgressRingState> {
	static defaultProps: ProgressRingProps = {
		...defaultProps,
		className: "",
		itemLength: 6,
		size: 200,
		itemSize: 26,
		delay: 100
	};
	state: ProgressRingState = {};
	static contextTypes = { theme: React.PropTypes.object };
	itemElms: HTMLDivElement[] = [];

	componentDidMount() {
		this.runItemsAnimation();
	}

	runItemsAnimation = () => {
		const speed = 3000;
		this.itemElms.forEach((itemElm, index) => {
			animation(.4, 0, 1, easing.easeInOutCubic, (value) => {
				itemElm.style.transform = `rotateZ(${value * 360}deg)`;
				itemElm.style.opacity = `${value < 0.125 ? value : (
					value < 0.9 ? 1 - value ** 2 + 0.25 : 1 - value
				)}`;
			}, index * 250, true);
		});
	}

	render() {
		const {
			itemLength, itmeStyle, size,
			itemSize, delay,
			style, ...attributes
		} = this.props;
		const center = size / 2;
		theme = this.context.theme;

		return (
			<div
				{...attributes}
				style={{
					...style,
					width: size,
					height: size,
					// background: "dodgerblue",
					position: "relative"
				}}
			>
				<div>
					{Array(itemLength).fill(0).map((numb, index) => (
						<div
							key={`${index}`}
							ref={(item) => this.itemElms.push(item)}
							style={prefixAll({
								background: "#fff",
								...itmeStyle,
								position: "absolute",
								top: 0,
								left: size / 2,
								width: itemSize,
								height: itemSize,
								opacity: 0,
								transformOrigin: `0px ${size / 2}px`,
								borderRadius: itemSize,
							})}
						/>
					))}
				</div>
			</div>
		);
	}
}

// (y * 2) ** 2 = x ** 2 * 2
// x = Math.sqrt(y ** 2 * 2)
// y = Math.sqrt(x ** 2 * 2) / 2
