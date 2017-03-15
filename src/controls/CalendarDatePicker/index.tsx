import * as React from "react";

import { ThemeType } from "../../styles/ThemeType";
import Input from "../Input";
import Icon from "../Icon";

const defaultProps: CalendarDatePickerProps = __DEV__ ? require("./devDefaultProps").default : {};

export interface DataProps {}

export interface CalendarDatePickerProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}


export interface CalendarDatePickerState {}

export default class CalendarDatePicker extends React.Component<CalendarDatePickerProps, CalendarDatePickerState> {
	static defaultProps: CalendarDatePickerProps = {
		...defaultProps,
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
				style={styles.root}
			>
				<Input
					{...attributes}
					style={{ padding: "0 10px", }}
					placeholder="mm/dd/yyyy"
					rightNode={<Icon>Calendar</Icon>}
				/>
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
			...style,
		}),
	};
}
