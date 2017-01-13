import * as React from "react";


import ElementState from "../../components/ElementState";
import { ThemeType } from "../../style/ThemeType";

let theme: ThemeType;
const defaultProps: SwitchProps = __DEV__ ? require("./devDefaultProps").default : {};

export interface DataProps {
	background?: any;
	isOpen?: boolean;
	cb?: Function;
}
interface SwitchProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {
}
interface SwitchState {
	isOpen?: boolean;
}

export default class Switch extends React.Component<SwitchProps, SwitchState> {
	static defaultProps: SwitchProps = {
		...defaultProps,
		style: {},
		id: null,
		className: "",
		width: "4rem",
		height: "2rem",
		background: "#3a3a48",
		cb: () => {},
	};

	state: SwitchState = {
		isOpen: this.props.isOpen
	};

	componentWillReceiveProps(nextProps: SwitchProps) {
		this.setState({ isOpen: nextProps.isOpen });
	}

	toggleSwitch = () => {
		const { cb } = this.props;
		const isOpen = !this.state.isOpen;
		this.setState({ isOpen });
		cb(isOpen);
	}

	getState = () => this.state.isOpen;

	getRightTranslateX = (width: any, height: any) => {
		const wString = width.toString();
		const hString = height.toString();
		const fontSize = document.documentElement.style.fontSize;
		const numberPattern = /(\d+\.?\d*)(.+)/;
		const fontSizeValue = numberPattern.test(fontSize) ? (fontSize.match(numberPattern) as any[])[1] as number : 16;

		const getValuePX = (values: any[]) => {
			switch (values[2]) {
				case "px": return values[1];
				case "rem": return values[1] * fontSizeValue;
				default: return values[1];
			}
		};
		const wPX = numberPattern.test(wString) ? getValuePX(wString.match(numberPattern) as any[]) : 0;
		const hPX = numberPattern.test(hString) ? getValuePX(hString.match(numberPattern) as any[]) : 0;
		return `${wPX - hPX}px`;
	}

	render() {
		const { style, id, className, background, width, height, ...attributes } = this.props;
		const { isOpen } = this.state;
		const styles = getStyles(this);

		return (
			<div
				style={{
					...styles.container,
					...style,
					width,
					height,
					background: isOpen ? background : "#fff",
					border: `2px solid #${isOpen ? "fff" : "e3e3e3"}`
				}}
				{...attributes}
				onClick={this.toggleSwitch}
			>
				<div
					style={{
						...styles.button,
						...(isOpen ? { WebkitTransform: `translateX(${this.getRightTranslateX(width, height)})` } : { WebkitTransform: "translateX(0)" }),
						width: height,
						height: height,
						borderRadius: `${height}`.replace(/(\d*\.*\d+)/, ($1: any) => `${Number($1) / 2}`)
					}}
				/>
			</div>
		);
	}
}

function getStyles(instance: Switch): {
	container: React.CSSProperties;
	button: React.CSSProperties;
} {
	const size = "2rem";
	return {
		container: {
			display: "flex",
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "center",
			boxSizing: "content-box",
			width: "4rem",
			height: size,
			borderRadius: size,
			transition: "all .25s 0s ease-in-out",
		},
		button: {
			width: size,
			height: size,
			borderRadius: size,
			background: "#fff",
			boxShadow: "0rem 0rem .75rem hsla(0, 0%, 0%, .25)",
			transition: "all .25s 0s ease-in-out",
		}
	};
}
