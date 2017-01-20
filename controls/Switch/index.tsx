import * as React from "react";

import { ThemeType } from "../../style/ThemeType";

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
		onClick: () => {},
	};

	state: SwitchState = {
		isOpen: this.props.isOpen
	};
	static contextTypes = { theme: React.PropTypes.object };
	context: { theme: ThemeType };

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
		// tslint:disable-next-line:no-unused-variable
		const { style, background, callback, ...attributes } = this.props;
		const { isOpen } = this.state;
		const { theme } = this.context;
		const styles = getStyles(this);

		return (
			<div
				style={theme.prepareStyles({
					...styles.container,
					...style,
				})}
				{...attributes}
				onClick={(e) => { this.toggleSwitch(); attributes.onClick(e); }}
			>
				<div
					style={theme.prepareStyles({
						...styles.button,
						...styles.button,
					})}
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
	const { theme } = context.context;
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
			...(isOpen ? { transform: `translateX(${Number(width) - Number(height) + 6}px)` } : { transform: `translateX(${6}px)` }),
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
