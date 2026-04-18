import { useTheme } from './hooks/useTheme';
import React, { useState, useRef, useEffect } from 'react';
import { codes } from 'keycode';
import AddBlurEvent from './utils/AddBlurEvent';
import Icon from './Icon';
import TextBox from './TextBox';
import CalendarView from './CalendarView';

export interface DataProps {
  placeholder?: string;
  defaultDate?: Date;
  width?: string | number;
  height?: string | number;
  onChangeDate?: (date?: Date) => void;
  onClick?: (e: React.MouseEvent) => void;
}
export interface CalendarDatePickerProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

const CalendarDatePicker: React.FC<CalendarDatePickerProps> = ({
  defaultDate = new Date(),
  placeholder = "mm/dd/yyyy",
  width = 296,
  height = 32,
  onChangeDate,
  onClick,
  style,
  ...attributes
}) => {
  const theme = useTheme();
  const [currDate, setCurrDate] = useState(defaultDate);
  const [isInit, setIsInit] = useState(true);
  const [showCalendarView, setShowCalendarView] = useState(false);
  const addBlurEvent = useRef(new AddBlurEvent()).current;
  const rootElm = useRef<HTMLDivElement>(null);
  const textBox = useRef<TextBox>(null);

  // 点击外部关闭事件
  useEffect(() => {
    addBlurEvent.setConfig({
      addListener: showCalendarView,
      clickExcludeElm: rootElm.current!,
      blurCallback: () => setShowCalendarView(false),
      blurKeyCodes: [codes.esc]
    });
    return () => addBlurEvent.cleanEvent();
  }, [showCalendarView]);

  const toggleShowCalendarView = (e: React.MouseEvent) => {
    if (!textBox.current?.rootElm?.contains(e.target as Node)) return;
    onClick?.(e);
    setShowCalendarView(prev => !prev);
  };

  const handleChangeDate = (date: Date) => {
    setCurrDate(date);
    setIsInit(false);
    onChangeDate?.(date);
  };

  // 格式化日期
  const day = currDate.getDate().toString().padStart(2, '0');
  const month = (currDate.getMonth() + 1).toString().padStart(2, '0');
  const mmddyy = `${month}/${day}/${currDate.getFullYear()}`;

  const styles = getStyles(theme, { width, height, style, showCalendarView });
  const classes = theme.prepareStyles({ styles, className: "calendar-picker" });

  return (
    <div
      style={classes.root.style}
      className={classes.root.className}
      onClick={toggleShowCalendarView}
      ref={rootElm}
    >
      <TextBox
        {...attributes}
        ref={textBox}
        style={styles.input}
        placeholder={isInit ? placeholder : mmddyy}
        disabled
        rightNode={
          <Icon style={styles.icon}>
            Calendar
          </Icon>
        }
      />
      <CalendarView
        style={styles.calendarView}
        defaultDate={defaultDate}
        onChangeDate={handleChangeDate}
      />
    </div>
  );
};

// ------------------------------
// Style generation function (bottom of file)
// ------------------------------
const getStyles = (theme: ReactUWP.ThemeType, props: {
  width: string | number;
  height: string | number;
  style?: React.CSSProperties;
  showCalendarView: boolean;
}) => {
  const { width, height, style, showCalendarView } = props;
  const { prefixStyle } = theme;
  const heightStr = typeof height === "number" ? `${height}px` : height;

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
    calendarView: prefixStyle({
      position: "absolute",
      top: height,
      left: 0,
      transform: `translate3d(0, ${showCalendarView ? "4px" : `-${heightStr}`}, 0)`,
      zIndex: showCalendarView ? theme.zIndex.flyout : undefined,
      opacity: showCalendarView ? 1 : 0,
      pointerEvents: showCalendarView ? "all" : "none",
      transition: "all .25s ease"
    })
  };
};


export default CalendarDatePicker;
