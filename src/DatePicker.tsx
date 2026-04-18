import { useTheme } from './hooks/useTheme';
import React, { useState, useRef, useEffect } from 'react';
import { codes } from 'keycode';
import AddBlurEvent from './utils/AddBlurEvent';
import Separator from './Separator';
import IconButton from './IconButton';
import PseudoClasses from './PseudoClasses';
import ListView from './ListView';
import scrollToYEasing from './utils/browser/scrollToYEasing';
import { monthList, getLastDayOfMonth } from './utils/date.utils';
import RevealEffect from './RevealEffect';

export interface DataProps {
  defaultDate?: Date;
  onChangeDate?: (date?: Date) => void;
  maxYear?: number;
  minYear?: number;
  inputItemHeight?: number;
  pickerItemHeight?: number;
  background?: string;
}
export interface DatePickerProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

const DatePicker: React.FC<DatePickerProps> = ({
  inputItemHeight = 28,
  pickerItemHeight = 44,
  onChangeDate,
  defaultDate = new Date(),
  maxYear = new Date().getFullYear() + 50,
  minYear = new Date().getFullYear() - 50,
  background,
  style,
  className,
  ...attributes
}) => {
  const theme = useTheme();
  const [showPicker, setShowPicker] = useState(false);
  const [currDate, setCurrDate] = useState(defaultDate);
  const prevDate = useRef(defaultDate);
  const addBlurEvent = useRef(new AddBlurEvent()).current;
  const rootElm = useRef<HTMLDivElement>(null);
  const monthListView = useRef<ListView>(null);
  const dateListView = useRef<ListView>(null);
  const yearListView = useRef<ListView>(null);

  // 受控处理defaultDate
  useEffect(() => {
    if (defaultDate.getTime() !== currDate.getTime()) {
      setCurrDate(defaultDate);
    }
  }, [defaultDate]);

  // 滚动定位和点击外部关闭事件
  useEffect(() => {
    if (showPicker && monthListView.current?.rootElm && dateListView.current?.rootElm && yearListView.current?.rootElm) {
      const monthIndex = currDate.getMonth();
      const dateIndex = currDate.getDate() - 1;
      const yearIndex = currDate.getFullYear() - minYear;
      scrollToYEasing(monthListView.current.rootElm, monthIndex * pickerItemHeight, 0.1);
      scrollToYEasing(dateListView.current.rootElm, dateIndex * pickerItemHeight, 0.1);
      scrollToYEasing(yearListView.current.rootElm, yearIndex * pickerItemHeight, 0.1);
    }

    addBlurEvent.setConfig({
      addListener: showPicker,
      clickExcludeElm: rootElm.current!,
      blurCallback: () => setShowPicker(false),
      blurKeyCodes: [codes.esc]
    });
    return () => addBlurEvent.cleanEvent();
  }, [showPicker, currDate, pickerItemHeight, minYear]);

  const toggleShowPicker = (show?: boolean) => {
    setShowPicker(prev => {
      const newShow = show ?? !prev;
      if (newShow) {
        prevDate.current = currDate;
      }
      return newShow;
    });
  };

  const setDate = (date?: number, month?: number, year?: number) => {
    setCurrDate(prev => {
      const newDate = date ?? prev.getDate();
      const newMonth = month ?? prev.getMonth();
      const newYear = year ?? prev.getFullYear();
      return new Date(newYear, newMonth, newDate);
    });
  };

  // 生成日期数据
  const currYear = currDate.getFullYear();
  const currMonth = currDate.getMonth();
  const currDateNumb = currDate.getDate();
  const monthArray = monthList;
  const dateArray = Array(getLastDayOfMonth(currDate).getDate()).fill(0).map((_, index) => index + 1);
  const yearArray = Array(maxYear - minYear).fill(0).map((_, index) => minYear + index);

  const styles = getStyles(theme, { style, inputItemHeight, pickerItemHeight, showPicker });
  const classes = theme.prepareStyles({ className: "date-picker", styles });

  return (
    <PseudoClasses
      {...(attributes as any)}
      style={classes.root.style}
    >
      <div
        {...attributes}
        style={classes.root.style}
        className={theme.classNames(classes.root.className, className)}
        ref={rootElm}
      >
        <div style={classes.pickerModal.style} className={classes.pickerModal.className}>
          <div style={classes.listViews.style} className={classes.listViews.className}>
            <ListView
              ref={monthListView}
              style={styles.listView}
              listItemStyle={styles.listItem}
              defaultFocusListIndex={currMonth}
              listSource={monthArray}
              onChooseItem={month => setDate(undefined, month, undefined)}
            />
            <ListView
              ref={dateListView}
              style={styles.listView}
              listItemStyle={styles.listItem}
              defaultFocusListIndex={currDateNumb - 1}
              listSource={dateArray}
              onChooseItem={dayIndex => setDate(dayIndex + 1, undefined, undefined)}
            />
            <ListView
              ref={yearListView}
              style={styles.listView}
              listItemStyle={styles.listItem}
              defaultFocusListIndex={currYear - minYear}
              listSource={yearArray}
              onChooseItem={yearIndex => setDate(undefined, undefined, minYear + yearIndex)}
            />
          </div>
          <div style={classes.iconButtonGroup.style} className={classes.iconButtonGroup.className}>
            <IconButton
              style={styles.iconButton}
              size={pickerItemHeight}
              onClick={() => {
                onChangeDate?.(currDate);
                setShowPicker(false);
              }}
            >
              AcceptLegacy
              <RevealEffect />
            </IconButton>
            <IconButton
              style={styles.iconButton}
              size={pickerItemHeight}
              onClick={() => {
                setCurrDate(prevDate.current);
                setShowPicker(false);
              }}
            >
              ClearLegacy
              <RevealEffect />
            </IconButton>
          </div>
        </div>
        <span
          style={classes.button.style}
          className={classes.button.className}
          onClick={() => toggleShowPicker()}
        >
          {monthList[currMonth]}
        </span>
        <Separator direction="column" style={{ margin: 0 }} />
        <span
          style={classes.button.style}
          className={classes.button.className}
          onClick={() => toggleShowPicker()}
        >
          {currDateNumb}
        </span>
        <Separator direction="column" style={{ margin: 0 }} />
        <span
          style={classes.button.style}
          className={classes.button.className}
          onClick={() => toggleShowPicker()}
        >
          {currYear}
        </span>
        <RevealEffect />
      </div>
    </PseudoClasses>
  );
};

// ------------------------------
// Style generation function (bottom of file)
// ------------------------------
const getStyles = (theme: ReactUWP.ThemeType, props: {
  style?: React.CSSProperties;
  inputItemHeight: number;
  pickerItemHeight: number;
  showPicker: boolean;
}) => {
  const { style, inputItemHeight, pickerItemHeight, showPicker } = props;
  const { prefixStyle } = theme;

  return {
    root: prefixStyle({
      width: 320,
      flex: "0 0 auto",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      verticalAlign: "middle",
      color: theme.baseMediumHigh,
      border: `${theme.borderWidth}px solid ${theme.baseMediumLow}`,
      height: inputItemHeight,
      lineHeight: `${inputItemHeight}px`,
      position: "relative",
      transition: "all .25s ease-in-out",
      "&:hover": {
        border: `${theme.borderWidth}px solid ${theme.baseMediumLow}`
      },
      ...style
    }),
    pickerModal: prefixStyle({
      ...theme.acrylicTexture60.style,
      overflow: "hidden",
      flex: "0 0 auto",
      display: "flex",
      flexDirection: "column",
      position: "absolute",
      top: 0,
      left: -theme.borderWidth,
      width: `calc(100% + ${theme.borderWidth * 2}px)`,
      opacity: showPicker ? 1 : 0,
      transform: `scaleY(${showPicker ? 1 : 0}) translateY(-50%)`,
      transformOrigin: "top",
      pointerEvents: showPicker ? "all" : "none",
      zIndex: theme.zIndex.flyout,
      transition: "all .25s ease-in-out"
    }),
    listViews: prefixStyle({
      border: `1px solid ${theme.listLow}`,
      flex: "0 0 auto",
      width: "100%",
      height: pickerItemHeight * 7,
      display: "flex",
      flexDirection: "row"
    }),
    listView: prefixStyle({
      userSelect: "none",
      border: "none",
      borderLeft: `1px solid ${theme.listLow}`,
      width: "100%",
      height: pickerItemHeight * 7,
      padding: `${pickerItemHeight * 3}px 0`,
      overflowY: "inherit",
      overflowX: "hidden",
      flex: "1 1 auto"
    }),
    listItem: {
      padding: "0 8px",
      height: pickerItemHeight,
      lineHeight: `${pickerItemHeight}px`,
      flex: "0 0 auto",
      fontSize: pickerItemHeight / 3
    },
    button: {
      flex: "1 1 auto",
      display: "inline-block",
      cursor: "default",
      verticalAlign: "top",
      height: inputItemHeight - 4,
      lineHeight: `${inputItemHeight - 4}px`,
      padding: `0 ${inputItemHeight - 4}px`
    },
    iconButtonGroup: {
      boxShadow: `inset 0 0 0 1px ${theme.baseLow}`,
      zIndex: theme.zIndex.flyout + 1
    },
    iconButton: {
      position: "relative",
      verticalAlign: "top",
      width: "50%",
      height: pickerItemHeight
    }
  };
};


export default DatePicker;
