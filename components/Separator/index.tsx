import * as React from "react";

import { ThemeType } from "../../styles/ThemeType";

const defaultProps: SeparatorProps = __DEV__ ? require("./devDefaultProps").default : {};

export interface DataProps {}

interface SeparatorProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

interface SeparatorState {}

export default class Separator extends React.Component<SeparatorProps, SeparatorState> {
	static defaultProps: SeparatorProps = {
		...defaultProps
	};

	state: SeparatorState = {};

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
				Separator
			</div>
		);
	}
}

function getStyles(separator: Separator): {
	container?: React.CSSProperties;
} {
	const { context } = separator;
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
