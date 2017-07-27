import * as React from "react";
import * as PropTypes from "prop-types";

import  * as dateUtils from "../common/date.utils";
import DayPicker from "./DayPicker";
import Icon from "../Icon";
import MonthPicker from "./MonthPicker";
import YearPicker from "./YearPicker";

import FadeInOut from "./FadeInOut";
import ScaleInOut from "./ScaleInOut";

export interface DataProps {
  /**
   * CalendarView defaultDate.
   */
  defaultDate?: Date;
  /**
   * init show mode.
   */
  pickerMode?: "year" | "month" | "day";
  /**
   * onChange date callback.
   */
  onChangeDate?: (date?: Date) => void;
  /**
   * if true, just select one highLight date item.
   */
  selectSingleDay?: boolean;
  /**
   * Set custom background.
   */
  background?: string;
}

export interface CalendarViewProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export interface CalendarViewState {
  viewDate?: Date;
  direction?: "bottom" | "top";
  chooseISODates?: string[];
  currPickerMode?: "year" | "month" | "day";
}

const emptyFunc = () => {};
export class CalendarView extends React.Component<CalendarViewProps, CalendarViewState> {
  static defaultProps: CalendarViewProps = {
    defaultDate: new Date(),
    pickerMode: "day",
    onChangeDate: emptyFunc,
    selectSingleDay: true
  };

  state: CalendarViewState = {
    viewDate: new Date(),
    direction: "bottom",
    chooseISODates: [],
    currPickerMode: this.props.pickerMode
  };

  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  nextAction = () => {
    const { viewDate, currPickerMode } = this.state;
    switch (currPickerMode) {
      case "day": {
        this.setState({
          viewDate: dateUtils.addMonths(viewDate, 1),
          direction: "bottom"
        });
        break;
      }
      case "month": {
        this.setState({
          viewDate: dateUtils.addYears(viewDate, 1),
          direction: "bottom"
        });
        break;
      }
      case "year": {
        this.setState({
          viewDate: dateUtils.addYears(viewDate, 10),
          direction: "bottom"
        });
        break;
      }
      default: {
        break;
      }
    }
  }

  prevAction = () => {
    const { viewDate, currPickerMode } = this.state;
    switch (currPickerMode) {
      case "day": {
        this.setState({
          viewDate: dateUtils.addMonths(viewDate, -1),
          direction: "top"
        });
        break;
      }
      case "month": {
        this.setState({
          viewDate: dateUtils.addYears(viewDate, -1),
          direction: "top"
        });
        break;
      }
      case "year": {
        this.setState({
          viewDate: dateUtils.addYears(viewDate, -10),
          direction: "top"
        });
        break;
      }
      default: {
        break;
      }
    }
  }

  handleChooseDay = (date: Date) => {
    let { chooseISODates, viewDate } = this.state;
    const { selectSingleDay } = this.props;
    const dateISOString = date.toISOString();
    const index = chooseISODates.indexOf(dateISOString);
    index > -1 ? chooseISODates.splice(index, 1) : (chooseISODates = selectSingleDay ? [dateISOString] : [...chooseISODates, dateISOString]);
    if (viewDate.getMonth() === date.getMonth()) {
      this.setState({ chooseISODates });
    } else {
      this.setState({ chooseISODates, viewDate: date });
    }
    this.props.onChangeDate(date);
  }

  onChooseMonth = (month: number) => {
    const { viewDate } = this.state;
    const newDate = new Date(viewDate.getFullYear(), month, viewDate.getDate());
    this.setState({
      viewDate: new Date(viewDate.getFullYear(), month, viewDate.getDate()),
      currPickerMode: "day"
    });
    this.props.onChangeDate(newDate);
  }

  onChooseYear = (year: number) => {
    const { viewDate } = this.state;
    const newDate = new Date(year, viewDate.getMonth(), viewDate.getDate());
    this.setState({
      viewDate: newDate,
      currPickerMode: "month"
    });
    this.props.onChangeDate(newDate);
  }

  getTitle = () => {
    const { viewDate, currPickerMode } = this.state;
    switch (currPickerMode) {
      case "day": {
        return `${dateUtils.monthList[viewDate.getMonth()]} ${viewDate.getFullYear()}`;
      }
      case "month": {
        const year = viewDate.getFullYear();
        return `${year} Year`;
      }
      case "year": {
        const year = viewDate.getFullYear();
        const minYearOfTen = Math.floor(year / 10) * 10;
        const maxYearOfTen = Math.ceil(year / 10) * 10;
        return `${minYearOfTen}-${maxYearOfTen}`;
      }
      default: {
        break;
      }
    }
  }

  togglePickerMode = (e: React.MouseEvent<HTMLParagraphElement> | "Year" | "Month" | "Day") => {
    if (typeof e === "string") {
      this.setState({ currPickerMode: e as any });
    }
    switch (this.state.currPickerMode) {
      case "day": {
        this.setState({ currPickerMode: "month" });
        break;
      }
      case "month": {
        this.setState({ currPickerMode: "year" });
        break;
      }
      case "year": {
        break;
      }
      default: {
        break;
      }
    }
  }

  render() {
    const {
      defaultDate,
      pickerMode,
      onChangeDate,
      selectSingleDay,
      background,
      className,
      ...attributes
    } = this.props;
    const { theme } = this.context;
    const inlineStyles = getStyles(this);
    const styles = theme.prepareStyles({
      className: "calendar-view",
      styles: inlineStyles
    });
    const { viewDate, direction, chooseISODates, currPickerMode } = this.state;
    const title = this.getTitle();

    return (
      <div
        {...attributes}
        style={styles.root.style}
        className={theme.classNames(styles.root.className, className)}
      >
        <div {...styles.title}>
          <FadeInOut
            appearAnimate={false}
            speed={250}
            direction={direction}
            style={{
              overflow: "hidden",
              height: 24
            }}
            childAttributes={{
              style: theme.prefixStyle({
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-start"
              })
            }}
          >
            <p
              style={{ cursor: "pointer", height: "100%" }}
              onClick={this.togglePickerMode}
              key={title}
            >
              {title}
            </p>
          </FadeInOut>
          <div style={theme.prefixStyle({ display: "flex", flexDirection: "row" })}>
            <Icon
              {...styles.titleIcon}
              onClick={this.prevAction}
              hoverStyle={{ color: theme.baseMedium }}
            >
              ChevronUp
            </Icon>
            <Icon
              {...styles.titleIcon}
              onClick={this.nextAction}
              hoverStyle={{ color: theme.baseMedium }}
            >
              ChevronDown
            </Icon>
          </div>
        </div>
        <ScaleInOut
          appearAnimate={false}
          {...styles.body}
          mode="both"
          minScale={0.4}
          speed={250}
        >
          {currPickerMode === "day" ? (
            <DayPicker
              date={viewDate}
              direction={direction}
              onChooseDay={this.handleChooseDay}
              chooseISODates={chooseISODates}
              key={currPickerMode}
            />
          ) : (currPickerMode === "month" ? (
            <MonthPicker
              date={viewDate}
              direction={direction}
              key={currPickerMode}
              onChooseMonth={this.onChooseMonth}
            />
          ) : (
            <YearPicker
              date={viewDate}
              direction={direction}
              key={currPickerMode}
              onChooseYear={this.onChooseYear}
            />
          ))}
        </ScaleInOut>
      </div>
    );
  }
}

function getStyles(calendarView: CalendarView): {
  root?: React.CSSProperties;
  title?: React.CSSProperties;
  titleIcon?: React.CSSProperties;
  body?: React.CSSProperties;
} {
  const { context, props: { style, background } } = calendarView;
  const { theme } = context;
  const { prefixStyle } = theme;

  return {
    root: prefixStyle({
      display: "inline-block",
      verticalAlign: "middle",
      fontSize: 14,
      color: theme.baseHigh,
      width: 296,
      background: background || (theme.useFluentDesign ? theme.acrylicTexture80.background : theme.altHigh),
      border: `2px solid ${theme.baseLow}`,
      ...style
    }),
    title: prefixStyle({
      fontSize: 14,
      height: 42,
      padding: "0 16px",
      fontWeight: "lighter",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between"
    }),
    titleIcon: {
      fontSize: 16,
      paddingLeft: 8,
      cursor: "pointer"
    },
    body: prefixStyle({
      width: 296,
      height: 292
    })
  };
}

export default CalendarView;
