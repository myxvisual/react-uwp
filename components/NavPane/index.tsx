import * as React from "react";

import { ThemeType } from "../../styles/ThemeType";

const defaultProps: NavPaneProps = __DEV__ ? require("./devDefaultProps").default : {};

export interface DataProps {}

interface NavPaneProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

interface NavPaneState {}

export default class NavPane extends React.Component<NavPaneProps, NavPaneState> {
	static defaultProps: NavPaneProps = {
		...defaultProps
	};

	state: NavPaneState = {};

	static contextTypes = { theme: React.PropTypes.object };
	context: { theme: ThemeType };

	render() {
		const { ...attributes } = this.props;
		const { theme } = this.context;
		const styles = getStyles(this);

		return (
			<div
				{...attributes}
				style={{
					...styles.container,
					...theme.prepareStyles(attributes.style),
				}}
			>
				NavPane
			</div>
		);
	}
}

function getStyles(navPane: NavPane): {
	container?: React.CSSProperties;
} {
	const { context } = navPane;
	const { theme } = context;
	// tslint:disable-next-line:no-unused-variable
	const { prepareStyles } = theme;

	return {
		container: {
			fontSize: 14,
			color: theme.baseHigh,
			background: theme.chromeLow,
		},
	};
}
