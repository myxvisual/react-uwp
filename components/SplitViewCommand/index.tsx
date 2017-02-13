import * as React from "react";

import Icon from "../Icon";
import { ThemeType } from "../../styles/ThemeType";

const defaultProps: SplitViewCommandProps = __DEV__ ? require("./devDefaultProps").default : {};

export interface DataProps {
	labelNode?: any;
	icon?: string;
	visited?: boolean;
	iconStyle?: React.CSSProperties;
}

interface SplitViewCommandProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

interface SplitViewCommandState {}

export default class SplitViewCommand extends React.Component<SplitViewCommandProps, SplitViewCommandState> {
	static defaultProps: SplitViewCommandProps = {
		...defaultProps,
	};

	state: SplitViewCommandState = {};

	displayName: "SplitViewCommand";

	static contextTypes = { theme: React.PropTypes.object };
	context: { theme: ThemeType };

	shouldComponentUpdate(nextProps: SplitViewCommandProps, nextState: SplitViewCommandState) {
		return nextProps !== this.props || nextState !== this.state;
	}

	render() {
		// tslint:disable-next-line:no-unused-variable
		const { label, labelNode, icon, visited, onMouseEnter, onMouseLeave, ...attributes } = this.props;
		const { theme } = this.context;
		const styles = getStyles(this);

		return (
			<div
				{...attributes}
				style={{
					...styles.root,
					...theme.prepareStyles(attributes.style),
				}}
				onMouseEnter={e => {
					e.currentTarget.style.background = theme.baseLow
					;
					if (onMouseEnter) onMouseEnter(e);
				}}
				onMouseLeave={e => {
					e.currentTarget.style.background = theme.altHigh;
					if (onMouseLeave) onMouseLeave(e);
				}}
			>
				{visited ? <div style={styles.visitedBorder} /> : null}
				<Icon hoverStyle={{ color: theme.accent }} style={styles.icon}>
					{icon}
				</Icon>
				<div style={{ color: visited ? theme.accent : theme.baseHigh }}>{label || labelNode}</div>
			</div>
		);
	}
}

function getStyles(splitViewCommand: SplitViewCommand): {
	root?: React.CSSProperties;
	icon?: React.CSSProperties;
	visitedBorder?: React.CSSProperties;
} {
	const { context, props: { style, iconStyle, visited } } = splitViewCommand;
	const { theme } = context;
	const { prepareStyles } = theme;

	return {
		root: prepareStyles({
			fontSize: 14,
			color: theme.baseMediumHigh,
			background: theme.altHigh,
			width: "100%",
			display: "flex",
			flexDirection: "row",
			alignItems: "center",
			position: "relative",
			transition: "all .25s 0s ease-in-out",
			...style,
		}),
		visitedBorder: {
			width: 0,
			borderLeft: `4px solid ${theme.accent}`,
			height: "50%",
			left: 0,
			top: "25%",
			position: "absolute",
		},
		icon: prepareStyles({
			flex: "0 0 auto",
			width: 48,
			height: 48,
			color: visited ? theme.accent : theme.baseHigh,
			fontSize: 16,
			...iconStyle,
		})
	};
}
