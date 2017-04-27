import * as React from "react";
import * as PropTypes from "prop-types";

import  * as dateUtils from "../common/date.utils";
import DayPicker from "./DayPicker";
import FadeInOut from "../Animate/FadeInOut";
import Icon from "../Icon";
import MonthPicker from "./MonthPicker";
import ScaleInOut from "../Animate/ScaleInOut";
import ThemeType from "../styles/ThemeType";
import YearPicker from "./YearPicker";

export interface DataProps {
  mode?: "Large" | "Small";
  pickerMode?: "Year" | "Month" | "Day";
  onChangeDate?: (date?: Date) => void;
}

export interface CalendarViewProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export interface CalendarViewState {
  dateNow?: Date;
  viewDate?: Date;
  direction?: "bottom" | "top";
  chooseISODates?: string[];
  currPickerMode?: "Year" | "Month" | "Day";
}

export default class CalendarView extends React.Component<CalendarViewProps, CalendarViewState> {
  static defaultProps: CalendarViewProps = {
    pickerMode: "Day",
    mode: "Small",
    onChangeDate: () => {}
  };

  state: CalendarViewState = {
    dateNow: new Date(),
    viewDate: new Date(),
    direction: "bottom",
    chooseISODates: [],
    currPickerMode: this.props.pickerMode
  };

  static contextTypes = { theme: PropTypes.object };
  context: { theme: ThemeType };

  nextAction = () => {
    const { viewDate, currPickerMode } = this.state;
    switch (currPickerMode) {
      case "Day": {
        this.setState({
          viewDate: dateUtils.addMonths(viewDate, 1),
          direction: "bottom"
        });
        break;
      }
      case "Month": {
        this.setState({
          viewDate: dateUtils.addYears(viewDate, 1),
          direction: "bottom"
        });
        break;
      }
      case "Year": {
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
      case "Day": {
        this.setState({
          viewDate: dateUtils.addMonths(viewDate, -1),
          direction: "top"
        });
        break;
      }
      case "Month": {
        this.setState({
          viewDate: dateUtils.addYears(viewDate, -1),
          direction: "top"
        });
        break;
      }
      case "Year": {
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

  chooseDay = (date: Date) => {
    let { chooseISODates } = this.state;
    const dateISOString = date.toISOString();
    const index = chooseISODates.indexOf(dateISOString);
    index > -1 ? chooseISODates.splice(index, 1) : (chooseISODates = [...chooseISODates, dateISOString]);
    this.setState({ chooseISODates });
    this.props.onChangeDate(date);
  }

  onChooseMonth = (month: number) => {
    const { viewDate } = this.state;
    const newDate = new Date(viewDate.getFullYear(), month, viewDate.getDate());
    this.setState({
      viewDate: new Date(viewDate.getFullYear(), month, viewDate.getDate()),
      currPickerMode: "Day"
    });
    this.props.onChangeDate(newDate);
  }

  onChooseYear = (year: number) => {
    const { viewDate } = this.state;
    const newDate = new Date(year, viewDate.getMonth(), viewDate.getDate());
    this.setState({
      viewDate: newDate,
      currPickerMode: "Month"
    });
    this.props.onChangeDate(newDate);
  }

  getTitle = () => {
    const { viewDate, currPickerMode } = this.state;
    switch (currPickerMode) {
      case "Day": {
        return `${dateUtils.monthList[viewDate.getMonth()]} ${viewDate.getFullYear()}`;
      }
      case "Month": {
        const year = viewDate.getFullYear();
        return `${year} Year`;
      }
      case "Year": {
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
      case "Day": {
        this.setState({ currPickerMode: "Month" });
        break;
      }
      case "Month": {
        this.setState({ currPickerMode: "Year" });
        break;
      }
      case "Year": {
        break;
      }
      default: {
        break;
      }
    }
  }

  render() {
    // tslint:disable-next-line:no-unused-variable
    const { pickerMode, mode, onChangeDate, ...attributes } = this.props;
    const { theme } = this.context;
    const styles = getStyles(this);
    const { dateNow, viewDate, direction, chooseISODates, currPickerMode } = this.state;
    const title = this.getTitle();

    return (
      <div
        {...attributes}
        style={styles.root}
      >
        <div style={styles.title}>
          <FadeInOut
            appearAnimate={true}
            speed={200}
            direction={direction}
            style={{
              overflow: "hidden"
            }}
            childAttributes={{
              style: theme.prepareStyles({
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-start"
              })
            }}
            key={`${currPickerMode} ${viewDate.toISOString().slice(0, 10)}`}
          >
            <p style={{ cursor: "pointer" }} onClick={this.togglePickerMode}>{title}</p>
          </FadeInOut>
          <div style={theme.prepareStyles({ display: "flex", flexDirection: "row" })}>
            <Icon
              style={styles.titleIcon}
              onClick={this.prevAction}
              hoverStyle={{ color: theme.baseMedium }}
            >
              ChevronUp
            </Icon>
            <Icon
              style={styles.titleIcon}
              onClick={this.nextAction}
              hoverStyle={{ color: theme.baseMedium }}
            >
              ChevronDown
            </Icon>
          </div>
        </div>
        <ScaleInOut
          appearAnimate={false}
          style={styles.body}
          mode="both"
          speed={350}
        >
          {currPickerMode === "Day" ? (
            <DayPicker
              date={viewDate}
              direction={direction}
              chooseDay={(date) => this.chooseDay(date)}
              chooseISODates={chooseISODates}
              key={currPickerMode}
            />
          ) : (currPickerMode === "Month" ? (
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
  const { context, props: { style } } = calendarView;
  const { theme } = context;
  const { prepareStyles } = theme;

  return {
    root: prepareStyles({
      fontSize: 14,
      color: theme.baseHigh,
      background: theme.altMediumHigh,
      width: 296,
      // height: 334,
      border: `2px solid ${theme.baseLow}`,
      ...style
    }),
    title: prepareStyles({
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
      paddingLeft: 8
    },
    body: prepareStyles({
      width: 296,
      height: 292
    })
  };
}
