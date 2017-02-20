import * as React from "react";

import { ThemeType } from "../../styles/ThemeType";
import vendors from "../../common/browser/vendors";
const vendorPrefixes: string[] = vendors.map(str => str ? `-${str}-` : str);

const defaultProps: ProgressRingProps = __DEV__ ? require("./devDefaultProps").default : {};

export interface DataProps {
	itemLength?: number;
	itemStyle?: React.CSSProperties;
	size?: number;
	speed?: number;
	itemSize?: number;
	delay?: number;
}
interface ProgressRingProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

const getInnerCSS = (progressRing: ProgressRing) => (
`.react-uwp-progress-ring {
}
${Array(progressRing.props.itemLength).fill(0).map((name, index) => (
	[".react-uwp-progress-ring-item-" + index + " {",
	vendorPrefixes.map(str => (`		${str}animation: CircleLoopFade ${progressRing.props.speed}ms ${index * progressRing.props.delay}ms linear infinite normal forwards;`)).join("\n"),
	"	}"].join("")
)).join("")}

${vendorPrefixes.map(str => `@${str}keyframes CircleLoopFade {
	0% {
		transform: rotateZ(0deg);
		opacity: 0.5;
	}
	25% {
		transform: rotateZ(180deg);
		opacity: 1;
	}
	50% {
		transform: rotateZ(270deg);
		opacity: 0;
	}
	75% {
		transform: rotateZ(300deg);
		opacity: 0;
	}
	100% {
		transform: rotateZ(360deg);
		opacity: 0.125;
	}
}`)}.join("")`);

export default class ProgressRing extends React.Component<ProgressRingProps, {}> {
	static defaultProps: ProgressRingProps = {
		...defaultProps,
		className: "",
		itemLength: 6,
		speed: 2500,
		size: 100,
		delay: 150,
	};
	static contextTypes = { theme: React.PropTypes.object };
	context: { theme: ThemeType };

	render() {
		const {
			itemLength, itemStyle, size,
			// tslint:disable-next-line:no-unused-variable
			itemSize, delay, speed,
			style, ...attributes
		} = this.props;
		const currentItemSize = itemSize || size / 10;
		const { theme } = this.context;

		return (
			<div
				{...attributes}
				className="react-uwp-progress-ring"
				style={theme.prepareStyles({
					...style,
					width: size,
					height: size,
					position: "relative",
				})}
			>
				<style type="text/css" dangerouslySetInnerHTML={{ __html: getInnerCSS(this) }} />
				<div>
					{Array(itemLength).fill(0).map((numb, index) => (
						<div
							key={`${index}`}
							className={`react-uwp-progress-ring-item-${index}`}
							style={theme.prepareStyles({
								background: theme.accent,
								...itemStyle,
								position: "absolute",
								top: 0,
								left: size / 2,
								width: currentItemSize,
								height: currentItemSize,
								opacity: 0,
								transformOrigin: `0px ${size / 2}px`,
								borderRadius: currentItemSize,
							})}
						/>
					))}
				</div>
			</div>
		);
	}
}
