import * as React from "react";

import { ThemeType } from "../../styles/ThemeType";

const defaultProps: CalendarViewProps = __DEV__ ? require("./devDefaultProps").default : {};

export interface DataProps {}

interface CalendarViewProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

interface CalendarViewState {}

export default class CalendarView extends React.Component<CalendarViewProps, CalendarViewState> {
	static defaultProps: CalendarViewProps = {
		...defaultProps
	};

	state: CalendarViewState = {};

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
				CalendarView
			</div>
		);
	}
}

function getStyles(calendarView: CalendarView): {
	root?: React.CSSProperties;
} {
	const { context, props: { style } } = calendarView;
	const { theme } = context;
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
