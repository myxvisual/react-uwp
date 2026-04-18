import { useTheme } from './hooks/useTheme';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import { codes } from 'keycode';
import AddBlurEvent from './utils/AddBlurEvent';
import Separator from './Separator';
import IconButton from './IconButton';
import PseudoClasses from './PseudoClasses';
import ListView from './ListView';
import scrollToYEasing from './utils/browser/scrollToYEasing';
import RevealEffect from './RevealEffect';

export interface DataProps {
  defaultHour?: number;
  defaultMinute?: number;
  defaultShowPicker?: boolean;
  onChangeTime?: (hours?: number, minutes?: number) => void;
  inputItemHeight?: number;
  pickerItemHeight?: number;
  background?: string;
}
export interface TimePickerProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

const TimePicker: React.FC<TimePickerProps> = ({
  defaultShowPicker = false,
  inputItemHeight = 28,
  pickerItemHeight = 44,
  defaultHour = 12,
  defaultMinute = 30,
  onChangeTime,
  style,
  className,
  background,
  ...attributes
}) => {
  const theme = useTheme();
  const [showPicker, setShowPicker] = useState(defaultShowPicker);
  const [currHour, setCurrHour] = useState(defaultHour);
  const [currMinute, setCurrMinute] = useState(defaultMinute);
  const prevState = useRef({ currHour: defaultHour, currMinute: defaultMinute });
  const addBlurEvent = useRef(new AddBlurEvent()).current;
  const rootElm = useRef<HTMLDivElement>(null);
  const hourListView = useRef<ListView>(null);
  const minuteListView = useRef<ListView>(null);
  const timeTypeListView = useRef<ListView>(null);

  // 受控处理
  useEffect(() => {
    if (defaultHour !== currHour || defaultMinute !== currMinute || defaultShowPicker !== showPicker) {
      setCurrHour(defaultHour);
      setCurrMinute(defaultMinute);
      setShowPicker(defaultShowPicker);
    }
  }, [defaultHour, defaultMinute, defaultShowPicker]);

  // 滚动定位
  useEffect(() => {
    if (hourListView.current?.rootElm) {
      const hourIndex = hourArray.indexOf(currHour > 12 ? currHour - 12 : currHour);
      scrollToYEasing(hourListView.current.rootElm, hourIndex * pickerItemHeight, 0.1);
    }
    if (minuteListView.current?.rootElm) {
      const minuteIndex = minuteArray.indexOf(currMinute);
      scrollToYEasing(minuteListView.current.rootElm, minuteIndex * pickerItemHeight, 0.1);
    }
    if (timeTypeListView.current?.rootElm) {
      const timeTypeIndex = timeTypeArray.indexOf(currTimeType);
      scrollToYEasing(timeTypeListView.current.rootElm, timeTypeIndex * pickerItemHeight, 0.1);
    }
  }, [showPicker, currHour, currMinute]);

  // 点击外部关闭事件
  useEffect(() => {
    addBlurEvent.setConfig({
      addListener: showPicker,
      clickExcludeElm: rootElm.current!,
      blurCallback: () => setShowPicker(false),
      blurKeyCodes: [codes.esc]
    });
    return () => addBlurEvent.cleanEvent();
  }, [showPicker]);

  const toggleShowPicker = (show?: boolean) => {
    setShowPicker(prev => show ?? !prev);
  };

  const currTimeType = currHour < 13 ? "AM" : "PM";
  const hourArray = useMemo(() => Array(12).fill(0).map((_, index) => index + 1), []);
  const minuteArray = useMemo(() => Array(60).fill(0).map((_, index) => index + 1), []);
  const timeTypeArray = useMemo(() => ["AM", "PM"], []);

  const styles = useMemo(() => getStyles(theme, {
    style,
    inputItemHeight,
    pickerItemHeight,
    background,
    showPicker
  }), [theme, style, inputItemHeight, pickerItemHeight, background, showPicker]);

  const cls = theme.prepareStyles({ className: "date-picker", styles });

  return (
    <PseudoClasses
      {...(attributes as any)}
      style={cls.root.style}
    >
      <div
        {...attributes}
        style={cls.root.style}
        className={theme.classNames(cls.root.className, className)}
        ref={rootElm}
      >
        <div style={cls.pickerModal.style} className={cls.pickerModal.className}>
          <div style={cls.listViews.style} className={cls.listViews.className}>
            <ListView
              ref={hourListView}
              style={styles.listView}
              listItemStyle={styles.listItem}
              defaultFocusListIndex={hourArray.indexOf(currHour > 12 ? currHour - 12 : currHour)}
              listSource={hourArray}
              onChooseItem={hourIndex => {
                setCurrHour(prev => prev > 12 ? 13 + hourIndex : hourIndex + 1);
              }}
            />
            <ListView
              ref={minuteListView}
              style={styles.listView}
              listItemStyle={styles.listItem}
              defaultFocusListIndex={minuteArray.indexOf(currMinute)}
              listSource={minuteArray}
              onChooseItem={minuteIndex => {
                setCurrMinute(minuteIndex + 1);
              }}
            />
            <ListView
              ref={timeTypeListView}
              style={styles.listView}
              listItemStyle={styles.listItem}
              defaultFocusListIndex={timeTypeArray.indexOf(currTimeType)}
              listSource={timeTypeArray}
              onChooseItem={timeTypeIndex => {
                if (timeTypeIndex === 0 && currHour > 12) {
                  setCurrHour(prev => prev - 12);
                }
                if (timeTypeIndex === 1 && currHour < 25) {
                  setCurrHour(prev => prev + 12);
                }
              }}
            />
          </div>
          <div style={cls.iconButtonGroup.style} className={cls.iconButtonGroup.className}>
            <IconButton
              style={styles.iconButton}
              size={pickerItemHeight}
              onClick={() => {
                setShowPicker(false);
                prevState.current = { currHour, currMinute };
                onChangeTime?.(currHour, currMinute);
              }}
            >
              AcceptLegacy
              <RevealEffect />
            </IconButton>
            <IconButton
              style={styles.iconButton}
              size={pickerItemHeight}
              onClick={() => {
                setShowPicker(false);
                setCurrHour(prevState.current.currHour);
                setCurrMinute(prevState.current.currMinute);
              }}
            >
              ClearLegacy
              <RevealEffect />
            </IconButton>
          </div>
        </div>
        <span
          style={cls.button.style}
          className={cls.button.className}
          onClick={() => toggleShowPicker()}
        >
          {currHour > 12 ? currHour - 12 : currHour}
        </span>
        <Separator direction="column" style={{ margin: 0 }} />
        <span
          style={cls.button.style}
          className={cls.button.className}
          onClick={() => toggleShowPicker()}
        >
          {currMinute}
        </span>
        <Separator direction="column" style={{ margin: 0 }} />
        <span
          style={cls.button.style}
          className={cls.button.className}
          onClick={() => toggleShowPicker()}
        >
          {currTimeType}
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
  background?: string;
  showPicker: boolean;
}) => {
  const { style, inputItemHeight, pickerItemHeight, background, showPicker } = props;
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
      padding: `${pickerItemHeight * 3}px 0`,
      height: pickerItemHeight * 7,
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


export default TimePicker;
