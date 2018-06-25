import * as React from "react";
import * as PropTypes from "prop-types";

import  * as dateUtils from "../common/date.utils";
import SlideInOut from "./SlideInOut";

export interface DataProps {
  date?: Date;
  onChooseDay?: (date: Date) => void;
  direction?: "bottom" | "top";
  chooseISODates?: string[];
}

export interface DayPickerProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export default class DayPicker extends React.Component<DayPickerProps, {}> {
  static defaultProps: DayPickerProps = {
    date: new Date(),
    onChooseDay: () => {},
    chooseISODates: [],
    direction: "bottom"
  };

  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>, date: Date, isCurrMonth: boolean, isNow: boolean) => {
    if (isNow) return;
    const { theme } = this.context;
    const { chooseISODates } = this.props;
    const isChoose = chooseISODates.includes(date.toISOString());
    e.currentTarget.style.boxShadow = isChoose ? `inset 0 0 0 2px ${theme.accent}, inset 0 0 0px 4px ${theme.altHigh}` : `inset 0 0 0 2px ${theme.baseMedium}`;
    e.currentTarget.style.background = isChoose ? theme.accent : (isCurrMonth ? (
      theme.useFluentDesign ? theme.altLow : theme.altHigh
    ) : (
      theme.useFluentDesign ? theme.listLow : theme.chromeLow
    ));
  }

  handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>, date: Date, isCurrMonth: boolean, isNow: boolean) => {
    if (isNow) return;
    const { theme } = this.context;
    const { chooseISODates } = this.props;
    const isChoose = chooseISODates.includes(date.toISOString());
    e.currentTarget.style.boxShadow = isChoose ? `inset 0 0 0 2px ${theme.accent}, inset 0 0 0px 4px ${theme.altMedium}` : `inset 0 0 0 2px ${theme.baseLow}`;
    e.currentTarget.style.background = isChoose ? theme.accent : (isCurrMonth ? (
      theme.useFluentDesign ? theme.altLow : theme.altHigh
    ) : (
      theme.useFluentDesign ? theme.listLow : theme.chromeLow
    ));
  }

  getDaysArray = () => {
    const { date } = this.props;
    const currMonth = date.getMonth();
    const currYear = date.getFullYear();
    const daysArray: { day?: number; isCurrMonth?: boolean; date?: Date }[] = [];
    const prevMonthLast = dateUtils.getLastDayOfPrevMonth(date);
    const prevMonthLastDay = prevMonthLast.getDay();
    const prevMonthLastDate = prevMonthLast.getDate();
    const monthFirst = dateUtils.getFirstDayOfMonth(date);
    const monthFirstDate = monthFirst.getDate();
    const monthLastDate = dateUtils.getLastDayOfMonth(date).getDate();
    for (let i = 0; i < 42; i++) {
      daysArray[i] = {};
      let day: number;
      if (i < prevMonthLastDay) {
        day = prevMonthLastDate - prevMonthLastDay + i + 1;
        daysArray[i]["date"] = new Date(currYear, currMonth - 1, day);
        daysArray[i]["isCurrMonth"] = false;
      } else if (i < monthLastDate + prevMonthLastDay) {
        day = monthFirstDate - prevMonthLastDay + i;
        daysArray[i]["date"] = new Date(currYear, currMonth, day);
        daysArray[i]["isCurrMonth"] = true;
      } else {
        day = i - prevMonthLastDay - monthLastDate + 1;
        daysArray[i]["date"] = new Date(currYear, currMonth + 1, day);
        daysArray[i]["isCurrMonth"] = false;
      }
      daysArray[i]["day"] = day;
    }
    return daysArray;
  }

  render() {
    const { date, onChooseDay, direction, chooseISODates, ...attributes } = this.props;
    const { theme } = this.context;
    const inlineStyles = getStyles(this);
    const styles = theme.prepareStyles({
      className: "calendar-view-day",
      styles: inlineStyles
    });
    const days = this.getDaysArray();

    return (
      <div {...styles.container}>
        <div {...styles.weeklyHead}>
          {dateUtils.dayShortList.map((str, index) => (
            <button {...styles.weeklyHeadItem} key={`${index}`}>{str}</button>
          ))}
        </div>
        <SlideInOut
          {...(attributes as any)}
          style={inlineStyles.root}
          mode="both"
          speed={350}
          direction={direction}
          appearAnimate={false}
        >
          <div key={`${date.getFullYear()}, ${date.getMonth()} ${date.getDate()}`}>
            {days.map(({ day, isCurrMonth, date }, index) => {
              const dateISOString = date.toISOString();
              const isChoose = chooseISODates.includes(dateISOString);
              const nowDate = new Date();
              const isNow = date.getFullYear() === nowDate.getFullYear() &&
                date.getMonth() === nowDate.getMonth() &&
                date.getDate() === nowDate.getDate();
              return <button
                onMouseEnter={(e) => this.handleMouseEnter(e, date, isCurrMonth, isNow)}
                onMouseLeave={(e) => this.handleMouseLeave(e, date, isCurrMonth, isNow)}
                style={{
                  ...styles.dayItem.style,
                  boxShadow: isNow ? `inset 0 0 0 2px ${theme.accent}, inset 0 0 0px 4px ${theme.altHigh}` : (isChoose ? `inset 0 0 0 2px ${theme.accent}, inset 0 0 0px 4px ${theme.altMedium}` : `inset 0 0 0 2px ${theme.baseLow}`),
                  color: isCurrMonth ? theme.baseHigh : theme.baseLow,
                  background: (isNow || isChoose) ? theme.accent : (isCurrMonth ? (
                    theme.useFluentDesign ? theme.altLow : theme.altHigh
                  ) : (
                    theme.useFluentDesign ? theme.listLow : theme.chromeLow
                  ))
                } as React.CSSProperties}
                className={styles.dayItem.className}
                onClick={() => onChooseDay(date)}
                key={`${index}`}
              >
                {day}
              </button>;
            })}
          </div>
        </SlideInOut>
      </div>
    );
  }
}

function getStyles(dayPicker: DayPicker): {
  container?: React.CSSProperties;
  root?: React.CSSProperties;
  weeklyHead?: React.CSSProperties;
  weeklyHeadItem?: React.CSSProperties;
  dayItem?: React.CSSProperties;
} {
  const {
    context: { theme },
    props: { style }
  } = dayPicker;
  const { prefixStyle } = theme;

  return {
    container: prefixStyle({
      height: 292,
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      justifyContent: "space-between",
      flexGrow: 0
    }),
    root: prefixStyle({
      width: 296,
      height: 292 / 7 * 6 - 2,
      display: "flex",
      flexDirection: "row",
      flexWrap: "wrap",
      ...style
    }),
    weeklyHead: prefixStyle({
      display: "flex",
      flexDirection: "row"
    }),
    weeklyHeadItem: {
      background: "none",
      border: "none",
      outline: "none",
      color: theme.baseHigh,
      width: 292 / 7,
      height: 40
    },
    dayItem: {
      transition: "all .25s 0s ease-in-out",
      border: "none",
      background: "none",
      outline: "none",
      color: theme.baseHigh,
      width: 292 / 7,
      height: 292 / 7
    }
  };
}
