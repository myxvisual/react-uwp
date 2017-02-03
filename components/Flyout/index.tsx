import * as React from "react";

import { ThemeType } from "../../styles/ThemeType";

const defaultProps: FlyoutProps = __DEV__ ? require("./devDefaultProps").default : {};

export interface DataProps {}

interface FlyoutProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

interface FlyoutState {}

export default class Flyout extends React.Component<FlyoutProps, FlyoutState> {
	static defaultProps: FlyoutProps = {
		...defaultProps,
		children: "Flyout"
	};

	state: FlyoutState = {};

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
			/>
		);
	}
}

function getStyles(flyout: Flyout): {
	container?: React.CSSProperties;
} {
	const { context } = flyout;
	const { theme } = context;
	// tslint:disable-next-line:no-unused-variable
	const { prepareStyles } = theme;

	return {
		container: {
			fontSize: 14,
			color: theme.baseMediumHigh,
			background: theme.altMediumHigh,
		},
	};
}
