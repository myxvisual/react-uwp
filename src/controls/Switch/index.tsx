import * as React from "react";

import { ThemeType } from "../../styles/ThemeType";

const defaultProps: SwitchProps = __DEV__ ? require("./devDefaultProps").default : {};

export interface DataProps {
	open?: boolean;
	callback?: Function;
	padding?: number;
}
export interface SwitchProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {
}
export interface SwitchState {
	isOpen?: boolean;
}

export default class Switch extends React.Component<SwitchProps, SwitchState> {
	static defaultProps: SwitchProps = {
		...defaultProps,
		width: 42,
		height: 18,
		padding: 6,
		callback: () => {},
		onClick: () => {},
	};

	state: SwitchState = {
		isOpen: this.props.open
	};
	static contextTypes = { theme: React.PropTypes.object };
	context: { theme: ThemeType };

	componentWillReceiveProps(nextProps: SwitchProps) {
		this.setState({ isOpen: nextProps.open });
	}

	toggleSwitch = (isOpen?: boolean) => {
		if (typeof isOpen !== "boolean") {
			isOpen = !this.state.isOpen;
		}
		const { callback } = this.props;
		this.setState({ isOpen });
		callback(isOpen);
	}

	getState = () => this.state.isOpen;

	render() {
		// tslint:disable-next-line:no-unused-variable
		const { style, open, callback, padding, ...attributes } = this.props;
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
	const { width, height, padding } = context.props;
	const { theme } = context.context;
	const { isOpen } = context.state;
	const itemSize = Number(height) / 1.5;
	return {
		container: {
			position: "relative",
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
			transform: `translateX(${isOpen ? Number(width) - Number(height) + padding : padding}px)`,
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
