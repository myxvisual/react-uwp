import { useTheme } from './hooks/useTheme';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import * as dateUtils from './utils/date.utils';
import DayPicker from './CalendarView/DayPicker';
import Icon from './Icon';
import MonthPicker from './CalendarView/MonthPicker';
import YearPicker from './CalendarView/YearPicker';
import FadeInOut from './CalendarView/FadeInOut';
import ScaleInOut from './CalendarView/ScaleInOut';

export interface DataProps {
  defaultDate?: Date;
  pickerMode?: "year" | "month" | "day";
  onChangeDate?: (date?: Date) => void;
  selectSingleDay?: boolean;
  background?: string;
}
export interface CalendarViewProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

const CalendarView: React.FC<CalendarViewProps> = ({
  defaultDate = new Date(),
  pickerMode = "day",
  onChangeDate,
  selectSingleDay = true,
  background,
  style,
  className,
  ...attributes
}) => {
  const theme = useTheme();
  const [viewDate, setViewDate] = useState(new Date());
  const [direction, setDirection] = useState<'bottom' | 'top'>('bottom');
  const [chooseISODates, setChooseISODates] = useState<string[]>([]);
  const [currPickerMode, setCurrPickerMode] = useState<'year' | 'month' | 'day'>(pickerMode);

  const nextAction = () => {
    switch (currPickerMode) {
      case "day":
        setViewDate(prev => dateUtils.addMonths(prev, 1));
        setDirection("bottom");
        break;
      case "month":
        setViewDate(prev => dateUtils.addYears(prev, 1));
        setDirection("bottom");
        break;
      case "year":
        setViewDate(prev => dateUtils.addYears(prev, 10));
        setDirection("bottom");
        break;
    }
  };

  const prevAction = () => {
    switch (currPickerMode) {
      case "day":
        setViewDate(prev => dateUtils.addMonths(prev, -1));
        setDirection("top");
        break;
      case "month":
        setViewDate(prev => dateUtils.addYears(prev, -1));
        setDirection("top");
        break;
      case "year":
        setViewDate(prev => dateUtils.addYears(prev, -10));
        setDirection("top");
        break;
    }
  };

  const handleChooseDay = (date: Date) => {
    const dateISOString = date.toISOString();
    setChooseISODates(prev => {
      const index = prev.indexOf(dateISOString);
      if (index > -1) {
        const newArr = [...prev];
        newArr.splice(index, 1);
        return newArr;
      } else {
        return selectSingleDay ? [dateISOString] : [...prev, dateISOString];
      }
    });
    if (viewDate.getMonth() !== date.getMonth()) {
      setViewDate(date);
    }
    onChangeDate?.(date);
  };

  const onChooseMonth = (month: number) => {
    const newDate = new Date(viewDate.getFullYear(), month, viewDate.getDate());
    setViewDate(newDate);
    setCurrPickerMode("day");
    onChangeDate?.(newDate);
  };

  const onChooseYear = (year: number) => {
    const newDate = new Date(year, viewDate.getMonth(), viewDate.getDate());
    setViewDate(newDate);
    setCurrPickerMode("month");
    onChangeDate?.(newDate);
  };

  const getTitle = () => {
    switch (currPickerMode) {
      case "day":
        return `${dateUtils.monthList[viewDate.getMonth()]} ${viewDate.getFullYear()}`;
      case "month":
        return `${viewDate.getFullYear()} Year`;
      case "year":
        const year = viewDate.getFullYear();
        const minYearOfTen = Math.floor(year / 10) * 10;
        const maxYearOfTen = Math.ceil(year / 10) * 10;
        return `${minYearOfTen}-${maxYearOfTen}`;
      default:
        return "";
    }
  };

  const togglePickerMode = (e: React.MouseEvent<HTMLParagraphElement> | "Year" | "Month" | "Day") => {
    if (typeof e === "string") {
      setCurrPickerMode(e as any);
      return;
    }
    switch (currPickerMode) {
      case "day":
        setCurrPickerMode("month");
        break;
      case "month":
        setCurrPickerMode("year");
        break;
    }
  };

  const title = getTitle();
  const styles = getStyles(theme, { style, background });
  const classes = theme.prepareStyles({ className: "calendar-view", styles });

  return (
    <div
      {...attributes}
      style={classes.root.style}
      className={theme.classNames(classes.root.className, className)}
    >
      <div {...classes.title}>
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
            onClick={togglePickerMode}
            key={title}
          >
            {title}
          </p>
        </FadeInOut>
        <div style={theme.prefixStyle({ display: "flex", flexDirection: "row" })}>
          <Icon
            {...classes.titleIcon}
            onClick={prevAction}
            hoverStyle={{ color: theme.baseMedium }}
          >
            ChevronUp
          </Icon>
          <Icon
            {...classes.titleIcon}
            onClick={nextAction}
            hoverStyle={{ color: theme.baseMedium }}
          >
            ChevronDown
          </Icon>
        </div>
      </div>
      <ScaleInOut
        appearAnimate={false}
        {...classes.body}
        mode="both"
        minScale={0.4}
        speed={250}
      >
        {currPickerMode === "day" ? (
          <DayPicker
            date={viewDate}
            direction={direction}
            onChooseDay={handleChooseDay}
            chooseISODates={chooseISODates}
            key={currPickerMode}
          />
        ) : currPickerMode === "month" ? (
          <MonthPicker
            date={viewDate}
            direction={direction}
            key={currPickerMode}
            onChooseMonth={onChooseMonth}
          />
        ) : (
          <YearPicker
            date={viewDate}
            direction={direction}
            key={currPickerMode}
            onChooseYear={onChooseYear}
          />
        )}
      </ScaleInOut>
    </div>
  );
};

// ------------------------------
// Style generation function (bottom of file)
// ------------------------------
const getStyles = (theme: ReactUWP.ThemeType, props: {
  style?: React.CSSProperties;
  background?: string;
}) => {
  const { style, background } = props;
  const { prefixStyle } = theme;

  return {
    root: prefixStyle({
      ...theme.acrylicTexture80.style,
      display: "inline-block",
      verticalAlign: "middle",
      fontSize: 14,
      color: theme.baseHigh,
      width: 296,
      border: `${theme.borderWidth}px solid ${theme.baseLow}`,
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
};


export default CalendarView;
