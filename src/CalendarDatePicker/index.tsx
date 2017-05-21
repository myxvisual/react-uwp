import * as React from "react";
import * as PropTypes from "prop-types";

import Icon from "../Icon";
import Input from "../Input";
import ThemeType from "../styles/ThemeType";

export interface DataProps {}

export interface CalendarDatePickerProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export class CalendarDatePicker extends React.Component<CalendarDatePickerProps, void> {

  static contextTypes = { theme: PropTypes.object };
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
          style={{ padding: "0 10px" }}
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
    root: prepareStyles(style)
  };
}

export default CalendarDatePicker;
