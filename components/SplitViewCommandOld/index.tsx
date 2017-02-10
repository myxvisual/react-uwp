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
		labelNode: "Settings",
		icon: "\uE700",
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
		const fadeAccent1 = theme[theme.isDarkTheme ? "accentDarker1" : "accentLighter1"];
		const fadeAccent2 = theme[theme.isDarkTheme ? "accentDarker2" : "accentLighter2"];
		const styles = getStyles(this);

		return (
			<div
				{...attributes}
				style={{
					...styles.root,
					...theme.prepareStyles(attributes.style),
				}}
				onMouseEnter={e => {
					e.currentTarget.style.background = visited ? fadeAccent1 : fadeAccent2;
					if (onMouseEnter) onMouseEnter(e);
				}}
				onMouseLeave={e => {
					e.currentTarget.style.background = visited ? fadeAccent1 : theme.altHigh;
					if (onMouseLeave) onMouseLeave(e);
				}}
			>
				<Icon hoverStyle={{ color: theme.baseHigh }} style={styles.icon}>
					{icon}
				</Icon>
				<div>{label || labelNode}</div>
			</div>
		);
	}
}

function getStyles(splitViewCommand: SplitViewCommand): {
	root?: React.CSSProperties;
	icon?: React.CSSProperties;
} {
	const { context, props: { style, iconStyle, visited } } = splitViewCommand;
	const { theme } = context;
	const { prepareStyles } = theme;

	return {
		root: prepareStyles({
			fontSize: 14,
			color: theme.baseMediumHigh,
			background: visited ? theme[theme.isDarkTheme ? "accentDarker1" : "accentLighter1"] : theme.altHigh,
			width: "100%",
			display: "flex",
			flexDirection: "row",
			alignItems: "center",
			transition: "all .25s 0s ease-in-out",
			...style,
		}),
		icon: prepareStyles({
			flex: "0 0 auto",
			width: 48,
			height: 48,
			fontSize: 18,
			...iconStyle,
		})
	};
}
