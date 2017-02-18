import * as React from "react";

import { ThemeType } from "../../styles/ThemeType";

const defaultProps: CalendarDatePickerProps = __DEV__ ? require("./devDefaultProps").default : {};

export interface DataProps {}

interface CalendarDatePickerProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

interface CalendarDatePickerState {}

export default class CalendarDatePicker extends React.Component<CalendarDatePickerProps, CalendarDatePickerState> {
	static defaultProps: CalendarDatePickerProps = {
		...defaultProps
	};

	state: CalendarDatePickerState = {};

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
				CalendarDatePicker
			</div>
		);
	}
}

function getStyles(calendarDatePicker: CalendarDatePicker): {
	root?: React.CSSProperties;
} {
	const { context, props: { style } } = calendarDatePicker;
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
