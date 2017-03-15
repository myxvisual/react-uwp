import * as React from "react";

import { ThemeType } from "../../styles/ThemeType";

const defaultProps: PivotProps = __DEV__ ? require("./devDefaultProps").default : {};

export interface DataProps {}

export interface PivotProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export interface PivotState {}

export default class Pivot extends React.Component<PivotProps, PivotState> {
	static defaultProps: PivotProps = {
		...defaultProps,
	};

	state: PivotState = {};

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
				Pivot
			</div>
		);
	}
}

function getStyles(pivot: Pivot): {
	root?: React.CSSProperties;
} {
	const {
		context: { theme },
		props: { style }
	} = pivot;
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
