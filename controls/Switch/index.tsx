import * as React from "react";

import ElementState from "../../components/ElementState";
import { ThemeType } from "../../style/ThemeType";

let theme: ThemeType;
const defaultProps: SwitchProps = __DEV__ ? require("./devDefaultProps").default : {};

export interface DataProps {
	background?: any;
	isOpen?: boolean;
	callback?: Function;
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
		width: 42,
		height: 18,
		background: "#3a3a48",
		callback: () => {},
	};

	state: SwitchState = {
		isOpen: this.props.isOpen
	};
	static contextTypes = { theme: React.PropTypes.object };

	componentWillReceiveProps(nextProps: SwitchProps) {
		this.setState({ isOpen: nextProps.isOpen });
	}

	toggleSwitch = () => {
		const { callback } = this.props;
		const isOpen = !this.state.isOpen;
		this.setState({ isOpen });
		callback(isOpen);
	}

	getState = () => this.state.isOpen;

	render() {
		const { style, id, className, background, callback, width, height, ...attributes } = this.props;
		const { isOpen } = this.state;
		const styles = getStyles(this);

		return (
			<div
				style={{
					...styles.container,
					...style,
				}}
				{...attributes}
				onClick={this.toggleSwitch}
			>
				<div
					style={{
						...styles.button,
						...styles.button,
					}}
				/>
			</div>
		);
	}
}

function getStyles(context: Switch): {
	container: React.CSSProperties;
	button: React.CSSProperties;
} {
	const { width, height } = context.props;
	theme = context.context.theme;
	const { isOpen } = context.state;
	const itemSize = Number(height) / 1.5;
	return {
		container: {
			display: "flex",
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "center",
			boxSizing: "content-box",
			width,
			height,
			background: isOpen ? theme.accent : theme.altHigh,
			border: `2px solid ${isOpen ? theme.accent : theme.baseMediumHigh}`,
			borderRadius: height,
			transition: "all .25s 0s ease-in-out",
		},
		button: {
			...(isOpen ? { WebkitTransform: `translateX(${Number(width) - Number(height) + 6}px)` } : { WebkitTransform: `translateX(${6}px)` }),
			flex: "0 0 auto",
			position: "absolute",
			left: 0,
			width: itemSize,
			height: itemSize,
			borderRadius: itemSize,
			background: isOpen ? "#fff" : theme.baseMediumHigh,
			transition: "all .25s 0s ease-in-out",
		}
	};
}
