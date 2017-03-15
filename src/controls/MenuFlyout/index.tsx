import * as React from "react";

import { ThemeType } from "../../styles/ThemeType";

const defaultProps: MenuFlyoutProps = __DEV__ ? require("./devDefaultProps").default : {};

export interface DataProps {}

export interface MenuFlyoutProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export interface MenuFlyoutState {}

export default class MenuFlyout extends React.Component<MenuFlyoutProps, MenuFlyoutState> {
	static defaultProps: MenuFlyoutProps = {
		...defaultProps,
	};

	state: MenuFlyoutState = {};

	static contextTypes = { theme: React.PropTypes.object };
	context: { theme: ThemeType };

	render() {
		const { ...attributes } = this.props;
		const { theme } = this.context;
		const styles = getStyles(this);

		return (
			<div
				{...attributes}
				style={styles.root}
			>
				MenuFlyout
			</div>
		);
	}
}

function getStyles(menuFlyout: MenuFlyout): {
	root?: React.CSSProperties;
} {
	const {
		context: { theme },
		props: { style }
	} = menuFlyout;
	const { prepareStyles } = theme;

	return {
		root: prepareStyles({
			fontSize: 14,
			color: theme.baseMediumHigh,
			background: theme.altMediumHigh,
			...style,
		}),
	};
}
