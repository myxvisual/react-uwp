import * as React from "react";
import * as PropTypes from "prop-types";
import { codes } from "keycode";

import AddBlurEvent from "../common/AddBlurEvent";
import Icon from "../Icon";
import TextBox from "../TextBox";
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
    height: 32,
    onClick: emptyFunc,
    onChangeDate: emptyFunc
  };

  state: CalendarDatePickerState = {
    currDate: this.props.defaultDate,
    isInit: true
  };

  addBlurEvent = new AddBlurEvent();
  rootElm: HTMLDivElement;
  textBox: TextBox;

  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  addBlurEventMethod = () => {
    this.addBlurEvent.setConfig({
      addListener: this.state.showCalendarView,
      clickExcludeElm: this.rootElm,
      blurCallback: () => {
        this.setState({
          showCalendarView: false
        });
      },
      blurKeyCodes: [codes.esc]
    });
  }

  componentDidMount() {
    this.addBlurEventMethod();
  }

  componentDidUpdate() {
    this.addBlurEventMethod();
  }

  componentWillUnmount() {
    this.addBlurEvent.cleanEvent();
  }

  toggleShowCalendarView = (showCalendarView?: any) => {
    if (!this.textBox.rootElm.contains(showCalendarView.target)) return;
    this.props.onClick(showCalendarView);
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
    this.props.onChangeDate(date);
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
    const inlineStyles = getStyles(this);
    const styles = theme.prepareStyles({
      styles: inlineStyles,
      className: "calendar-picker"
    });

    let day: string | number = currDate.getDate();
    let month: string | number = currDate.getMonth() + 1;
    if (day < 10) day = `0${day}`;
    if (month < 10) month = `0${month}`;
    const mmddyy = [month, day, currDate.getFullYear()].join("/");

    return (
      <div
        {...styles.root}
        onClick={this.toggleShowCalendarView}
        ref={rootElm => this.rootElm = rootElm}
      >
        <TextBox
          {...attributes}
          ref={textBox => this.textBox = textBox}
          style={inlineStyles.input}
          placeholder={isInit ? placeholder : mmddyy }
          disabled
          rightNode={
            <Icon style={inlineStyles.icon}>
              Calendar
            </Icon>
          }
        />
        <CalendarView
          style={inlineStyles.calendarView}
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
  const { prefixStyle } = theme;

  return {
    root: prefixStyle({
      display: "inline-block",
      verticalAlign: "middle",
      position: "relative",
      ...style
    }),
    input: {
      width,
      height
    },
    icon: {
      margin: "0 8px",
      cursor: "pointer",
      color: theme.baseHigh
    },
    calendarView: {
      position: "absolute",
      top: height,
      left: 0,
      transform: `translate3d(0, ${(
        showCalendarView ? "4px" : (
          typeof height === "number" ? `-${height}px` : `-${height}`
        )
      )}, 0)`,
      zIndex: showCalendarView ? theme.zIndex.flyout : void 0,
      opacity: showCalendarView ? 1 : 0,
      pointerEvents: showCalendarView ? "all" : "none",
      transition: "all .25s ease"
    }
  };
}

export default CalendarDatePicker;
