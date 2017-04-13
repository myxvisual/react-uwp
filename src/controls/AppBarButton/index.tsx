import * as React from "react";

import Icon from "../Icon";
import ElementState from "../ElementState";
import { ThemeType } from "../../styles/ThemeType";

const defaultProps: AppBarButtonButtonProps = __DEV__ ? require("./devDefaultProps").default : {};

export interface DataProps {
	icon?: string;
	hoverStyle?: React.CSSProperties;
	opened?: boolean;
	defaultLabelPosition?: "Right" | "Bottom" | "Collapsed";
}

export interface AppBarButtonButtonProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export interface AppBarButtonButtonState {}

export default class AppBarButtonButton extends React.Component<AppBarButtonButtonProps, AppBarButtonButtonState> {
	static defaultProps: AppBarButtonButtonProps = {
		...defaultProps,
	};

	state: AppBarButtonButtonState = {};

	static contextTypes = { theme: React.PropTypes.object };
	context: { theme: ThemeType };

	render() {
		// tslint:disable-next-line:no-unused-variable
		const { icon, hoverStyle, label, opened, defaultLabelPosition, ...attributes } = this.props;
		const { theme } = this.context;
		const styles = getStyles(this);

		return (
			<ElementState
				{...attributes as any}
				style={styles.root}
				hoverStyle={hoverStyle || {
					background: theme[theme.isDarkTheme ? "accentDarker1" : "accentLighter1"],
				}}
			>
				<div>
					<Icon style={styles.icon}>
						{icon}
					</Icon>
					{defaultLabelPosition !== "Collapsed" && <p style={styles.label}>
						{label}
					</p>}
				</div>
			</ElementState>
		);
	}
}

function getStyles(AppBarButtonButton: AppBarButtonButton): {
	root?: React.CSSProperties;
	icon?: React.CSSProperties;
	label?: React.CSSProperties;
} {
	// tslint:disable-next-line:no-unused-variable
	const { context, props: { opened, defaultLabelPosition, style } } = AppBarButtonButton;
	const { theme } = context;
	const { prepareStyles } = theme;
	const flexDirection: any = {
		"Bottom": "column",
		"Right": "row",
		"Left": "row-reverse"
	};
	const isRight = defaultLabelPosition === "Right";

	return {
		root: prepareStyles({
			fontSize: 14,
			color: theme.baseMediumHigh,
			display: "flex",
			flexDirection: flexDirection[defaultLabelPosition],
			alignItems: "center",
			justifyContent: "flex-start",
			flex: "0 0 auto",
			height: "100%",
			padding: "0 10px",
			maxWidth: isRight ? void 0 : 72,
			transition: "all .25s",
			cursor: "default",
			...style,
		}),
		label: {
			lineHeight: isRight ? void 0 : 1,
			height: isRight ? void 0 : 28,
			fontSize: 12,
			width: "100%",
			textAlign: "center",
			textOverflow: "ellipsis",
			overflow: "hidden",
		},
		icon: prepareStyles({
			width: 48,
			height: 48,
			fontSize: 18,
			...style,
		}),
	};
}
