import * as React from "react";
import * as PropTypes from "prop-types";

import Icon from "../Icon";
import Input from "../Input";
import CalendarView from "../CalendarView";

export interface DataProps {
  /**
   * The HTMLAttributes `placeholder`.
   */
  placeholder?: string;
  /**
   * The Default Date.
   */
  defaultDate?: Date;
  /**
   * The Component style `width`.
   */
  width?: string | number;
  /**
   * The Component style `height`.
   */
  height?: string | number;
  /**
   * onChange date `callback`.
   */
  onChangeDate?: (date?: Date) => void;
}

export interface CalendarDatePickerProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export interface CalendarDatePickerState {
  currDate?: Date;
  isInit?: boolean;
  showCalendarView?: boolean;
}

const emptyFunc = () => {};

export class CalendarDatePicker extends React.Component<CalendarDatePickerProps, CalendarDatePickerState> {
  static defaultProps: CalendarDatePickerProps = {
    defaultDate: new Date(),
    placeholder: "mm/dd/yyyy",
    width: 296,
    height: 32
  };

  state: CalendarDatePickerState = {
    currDate: this.props.defaultDate,
    isInit: true
  };

  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  toggleShowCalendarView = (showCalendarView?: any) => {
    if (typeof showCalendarView === "boolean") {
      if (showCalendarView !== this.state.showCalendarView) {
        this.setState({ showCalendarView });
      }
    } else {
      this.setState((prevState, prevProps) => ({
        showCalendarView: !prevState.showCalendarView
      }));
    }
  }

  handleChangeDate = (date: Date) => {
    this.state.currDate = date;
    this.state.isInit = false;
    if (this.props.onChangeDate) this.props.onChangeDate(date);

    this.toggleShowCalendarView();
  }

  render() {
    const {
      defaultDate,
      placeholder,
      onChangeDate,
      ...attributes
    } = this.props;
    const {
      currDate,
      isInit,
      showCalendarView
    } = this.state;
    const { theme } = this.context;
    const styles = getStyles(this);
    let day: string | number = currDate.getDate();
    let month: string | number = currDate.getMonth() + 1;
    if (day < 10) day = `0${day}`;
    if (month < 10) month = `0${month}`;
    const mmddyy = [month, day, currDate.getFullYear()].join("/");

    return (
      <div
        style={styles.root}
      >
        <Input
          {...attributes}
          style={styles.input}
          placeholder={isInit ? placeholder : mmddyy }
          disabled
          rightNode={
            <Icon style={styles.icon} onClick={this.toggleShowCalendarView}>
              Calendar
            </Icon>
          }
        />
        <CalendarView
          style={styles.calendarView}
          defaultDate={defaultDate}
          onChangeDate={this.handleChangeDate}
        />
      </div>
    );
  }
}

function getStyles(calendarDatePicker: CalendarDatePicker): {
  root?: React.CSSProperties;
  input?: React.CSSProperties;
  icon?: React.CSSProperties;
  calendarView?: React.CSSProperties;
} {
  const {
    context,
    props: {
      width,
      height,
      style
    },
    state: {
      showCalendarView
    }
  } = calendarDatePicker;
  const { theme } = context;
  const { prepareStyles } = theme;

  return {
    root: prepareStyles({
      display: "inline-block",
      position: "relative",
      ...style
    }),
    input: {
      padding: "0 10px",
      width,
      height
    },
    icon: {
      cursor: "pointer",
      color: theme.baseHigh
    },
    calendarView: {
      position: "absolute",
      top: height,
      left: 0,
      transform: `translate3D(0, -${(
        showCalendarView ? 0 : (
          typeof height === "number" ? `${height}px` : height
        )
      )}, 0)`,
      opacity: showCalendarView ? 1 : 0,
      pointerEvents: showCalendarView ? "all" : "none",
      transition: "all .25s ease"
    }
  };
}

export default CalendarDatePicker;
