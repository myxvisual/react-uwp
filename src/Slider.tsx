import { useTheme } from './hooks/useTheme';
import React, { useState, useRef, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import IS_NODE_ENV from './utils/nodeJS/IS_NODE_ENV';

export interface DataProps {
  displayMode?: "vertical" | "horizon";
  minValue?: number;
  maxValue?: number;
  initValue?: number;
  numberToFixed?: number;
  unit?: string;
  showValueInfo?: boolean;
  transition?: string;
  onChangeValue?: (value?: number) => void;
  onChangedValue?: (value?: number) => void;
  onChangeValueRatio?: (valueRatio?: number) => void;
  onChangedValueRatio?: (value?: number) => void;
  barHeight?: number;
  barBackground?: string;
  barBackgroundImage?: string;
  customControllerStyle?: React.CSSProperties;
  controllerWidth?: number;
  useSimpleController?: boolean;
  throttleTimer?: number;
  width?: string | number;
  height?: string | number;
  label?: string;
}
export interface SliderProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

const Slider: React.FC<SliderProps> = ({
  displayMode = "horizon",
  minValue = 0,
  maxValue = 1,
  initValue = 0,
  onChangeValue,
  onChangedValue,
  onChangeValueRatio,
  onChangedValueRatio,
  height = 24,
  barHeight = 2,
  controllerWidth = 8,
  showValueInfo = false,
  numberToFixed = 0,
  unit = "",
  transition = "all 0.25s",
  throttleTimer = 120 / 1000,
  style,
  barBackground,
  barBackgroundImage,
  useSimpleController,
  customControllerStyle,
  ...attributes
}) => {
  const theme = useTheme();
  const [currValue, setCurrValue] = useState(initValue);
  const [hovered, setHovered] = useState(false);
  const [dragging, setDragging] = useState(false);
  const valueRatio = useMemo(() => currValue / (maxValue - minValue), [currValue, maxValue, minValue]);

  const throttleNow = useRef<number | null>(null);
  const throttleNowTimer = useRef<NodeJS.Timeout | null>(null);
  const onChangedValueTimer = useRef<NodeJS.Timeout | null>(null);
  const rootElm = useRef<HTMLDivElement>(null);
  const labelElm = useRef<HTMLSpanElement>(null);
  const controllerWrapperElm = useRef<HTMLDivElement>(null);
  const controllerElm = useRef<HTMLDivElement>(null);
  const barElm = useRef<HTMLDivElement>(null);
  const originBodyStyle = useRef(IS_NODE_ENV ? undefined : { ...document.body.style });

  // 受控处理
  useEffect(() => {
    if (initValue !== currValue) {
      setCurrValue(initValue);
    }
  }, [initValue]);

  // 生命周期事件绑定
  useEffect(() => {
    if (!rootElm.current) return;
    rootElm.current.addEventListener("touchstart", handleDraggingStart as any, false);
    rootElm.current.addEventListener("touchend", handleDragged as any, false);

    return () => {
      if (throttleNowTimer.current) clearTimeout(throttleNowTimer.current);
      if (onChangedValueTimer.current) clearTimeout(onChangedValueTimer.current);
      if (rootElm.current) {
        rootElm.current.removeEventListener("touchstart", handleDraggingStart as any, false);
        rootElm.current.removeEventListener("touchend", handleDragged as any, false);
      }
    };
  }, []);

  const handelMouseEnter = () => setHovered(true);
  const handelMouseLeave = () => setHovered(false);

  const handleDraggingStart = (e: any) => {
    e.preventDefault();
    if (!IS_NODE_ENV) {
      Object.assign(document.body.style, {
        userSelect: "none",
        msUserSelect: "none",
        webkitUserSelect: "none",
        cursor: "default"
      });
    }
    document.documentElement.addEventListener("mousemove", setValueByEvent);
    document.documentElement.addEventListener("touchmove", setValueByEvent);
    document.documentElement.addEventListener("mouseup", handleDragged);
    document.documentElement.addEventListener("touchend", handleDragged);
  };

  const handleDragged = (e: any) => {
    if (!IS_NODE_ENV) {
      Object.assign(document.body.style, {
        userSelect: undefined,
        msUserSelect: undefined,
        webkitUserSelect: undefined,
        cursor: undefined,
        ...originBodyStyle.current
      });
    }
    if (dragging) setDragging(false);
    document.documentElement.removeEventListener("mousemove", setValueByEvent);
    document.documentElement.removeEventListener("touchmove", setValueByEvent);
    document.documentElement.removeEventListener("mouseup", handleDragged);
    document.documentElement.removeEventListener("touchend", handleDragged);
  };

  const setValueByEvent = (e: any) => {
    const isTouchEvent = e.type.includes("touch");
    if (onChangedValueTimer.current) clearTimeout(onChangedValueTimer.current);
    const isDraggingEvent = e.type === "mousemove" || e.type === "touchmove";

    if (isDraggingEvent && !dragging) {
      e.preventDefault();
      setDragging(true);
    }

    if (isDraggingEvent) {
      const nowTime = performance ? performance.now() : Date.now();
      if (!throttleNow.current || (nowTime - throttleNow.current > throttleTimer)) {
        if (throttleNowTimer.current) clearTimeout(throttleNowTimer.current);
        throttleNow.current = nowTime;
      } else {
        throttleNowTimer.current = setTimeout(() => {
          setValueByEvent(e);
        }, throttleTimer);
        return;
      }
    }

    const isHorizonMode = displayMode === "horizon";
    const useCustomBackground = barBackground || barBackgroundImage;
    const { left, width, bottom, height: rootHeight } = rootElm.current!.getBoundingClientRect();
    const { clientX, clientY } = isTouchEvent ? e.changedTouches[0] : e;
    const controllerClientRect = controllerElm.current!.getBoundingClientRect();
    const ctrlWidth = controllerClientRect.width;
    const ctrlHeight = controllerClientRect.height;

    let newRatio = isHorizonMode 
      ? (clientX - left) / (width - ctrlWidth) 
      : -(clientY - bottom) / (rootHeight - ctrlHeight);
    newRatio = Math.max(0, Math.min(1, newRatio));
    const newValue = minValue + (maxValue - minValue) * newRatio;

    setCurrValue(newValue);

    // 手动更新DOM样式避免重渲染卡顿
    if (e.type !== "click" && e.type !== "touchstart") {
      if (!useCustomBackground && barElm.current) {
        const barTransform = `translate${isHorizonMode ? "X" : "Y"}(${(isHorizonMode ? (newRatio - 1) : (1 - newRatio)) * 100}%)`;
        Object.assign(barElm.current.style, {
          transform: barTransform,
          webKitTransform: barTransform,
          msTransform: barTransform,
          mozTransform: barTransform
        });
      }
      if (controllerWrapperElm.current) {
        const transform = `translate${isHorizonMode ? "X" : "Y"}(${(isHorizonMode ? newRatio : 1 - newRatio) * 100}%)`;
        Object.assign(controllerWrapperElm.current.style, {
          transform,
          webKitTransform: transform,
          msTransform: transform,
          mozTransform: transform
        });
      }
      if (labelElm.current && attributes.label) {
        labelElm.current.innerText = `${newValue.toFixed(numberToFixed)}${unit}`;
      }
    }

    onChangeValue?.(newValue);
    onChangeValueRatio?.(newRatio);

    onChangedValueTimer.current = setTimeout(() => {
      onChangedValue?.(newValue);
      onChangedValueRatio?.(newRatio);
    }, 0);
  };

  const styles = useMemo(() => getStyles(theme, {
    transition,
    maxValue,
    style,
    height,
    barHeight,
    controllerWidth,
    barBackground,
    barBackgroundImage,
    useSimpleController,
    customControllerStyle,
    showValueInfo,
    displayMode,
    currValue,
    dragging,
    hovered
  }), [theme, transition, maxValue, style, height, barHeight, controllerWidth, barBackground, barBackgroundImage, useSimpleController, customControllerStyle, showValueInfo, displayMode, currValue, dragging, hovered]);

  const cls = theme.prepareStyles({ className: "slider", styles });

  const normalRender = (
    <div
      ref={rootElm}
      style={cls.root.style}
      className={cls.root.className}
      onMouseEnter={handelMouseEnter}
      onMouseLeave={handelMouseLeave}
      onClick={setValueByEvent}
      onTouchStart={setValueByEvent}
      onMouseDown={handleDraggingStart}
      onMouseUp={handleDragged}
    >
      <div style={cls.barContainer.style} className={cls.barContainer.className}>
        <div style={cls.bar.style} className={cls.bar.className} ref={barElm} />
      </div>
      <div style={cls.controllerWrapper.style} className={cls.controllerWrapper.className} ref={controllerWrapperElm}>
        <div style={cls.controller.style} className={cls.controller.className} ref={controllerElm} />
      </div>
    </div>
  );

  return (
    <div {...attributes} style={cls.wrapper.style} className={cls.wrapper.className}>
      {showValueInfo ? (
        <div style={cls.infoWrapper.style} className={cls.infoWrapper.className}>
          {normalRender}
          <span
            ref={labelElm}
            style={cls.label.style}
            className={cls.label.className}
          >
            {`${currValue.toFixed(numberToFixed)}${unit}`}
          </span>
        </div>
      ) : normalRender}
    </div>
  );
};

// ------------------------------
// Style generation function (bottom of file)
// ------------------------------
const getStyles = (theme: ReactUWP.ThemeType, props: {
  transition: string;
  maxValue: number;
  style?: React.CSSProperties;
  height: string | number;
  barHeight: number;
  controllerWidth: number;
  barBackground?: string;
  barBackgroundImage?: string;
  useSimpleController?: boolean;
  customControllerStyle?: React.CSSProperties;
  showValueInfo: boolean;
  displayMode: "vertical" | "horizon";
  currValue: number;
  dragging: boolean;
  hovered: boolean;
}) => {
  const {
    transition,
    maxValue,
    style,
    height,
    barHeight,
    controllerWidth,
    barBackground,
    barBackgroundImage,
    useSimpleController,
    customControllerStyle,
    showValueInfo,
    displayMode,
    currValue,
    dragging,
    hovered
  } = props;
  const { prefixStyle } = theme;
  const isHorizonMode = displayMode === "horizon";
  const height2px = Number.parseFloat(height as any);
  const barHeight2px = Number.parseFloat(barHeight as any);
  const controllerWidth2px = Number.parseFloat(controllerWidth as any);
  const currTransition = dragging ? undefined : transition;
  const useCustomBackground = barBackground || barBackgroundImage;
  const valueRatio = currValue / maxValue;

  return {
    wrapper: prefixStyle({
      width: isHorizonMode ? 320 : height2px,
      height: isHorizonMode ? height2px : 320,
      display: "inline-block",
      verticalAlign: "middle",
      ...style
    }),
    root: prefixStyle({
      flex: showValueInfo ? "0 0 auto" : undefined,
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      width: isHorizonMode ? "100%" : height2px,
      height: isHorizonMode ? height2px : "100%",
      cursor: "default",
      position: "relative"
    }),
    barContainer: {
      background: theme.baseLow,
      position: "absolute",
      width: isHorizonMode ? "100%" : barHeight,
      height: isHorizonMode ? barHeight : "100%",
      overflow: "hidden",
      left: isHorizonMode ? 0 : `calc(50% - ${barHeight2px / 2}px)`,
      top: isHorizonMode ? `calc(50% - ${barHeight2px / 2}px)` : 0
    },
    infoWrapper: prefixStyle({
      display: "flex",
      flexDirection: displayMode === "horizon" ? "row" : "column",
      alignItems: "center"
    }),
    bar: prefixStyle({
      transition: currTransition,
      background: useCustomBackground ? barBackground : theme.listAccentLow,
      backgroundImage: barBackgroundImage,
      position: "absolute",
      width: "100%",
      height: "100%",
      left: 0,
      top: 0,
      transform: useCustomBackground ? undefined : `translate${isHorizonMode ? "X" : "Y"}(${(isHorizonMode ? (valueRatio - 1) : (1 - valueRatio)) * 100}%)`
    }),
    controllerWrapper: prefixStyle({
      position: "absolute",
      left: 0,
      top: 0,
      width: "100%",
      height: "100%",
      pointerEvents: "none",
      transition: currTransition,
      transform: `translate${isHorizonMode ? "X" : "Y"}(${(isHorizonMode ? valueRatio : 1 - valueRatio) * 100}%)`
    }),
    controller: prefixStyle({
      pointerEvents: "none",
      transition: currTransition,
      display: "inline-block",
      background: (useSimpleController || dragging || hovered) ? theme.baseHigh : theme.accent,
      borderRadius: controllerWidth2px / 2,
      width: isHorizonMode ? controllerWidth2px : height2px,
      height: isHorizonMode ? height2px : controllerWidth2px,
      float: "left",
      transform: `translate3d(${isHorizonMode ? -controllerWidth2px / 2 : 0}px, 0, 0)`,
      ...customControllerStyle
    }),
    label: {
      flex: showValueInfo ? "0 0 auto" : undefined,
      display: "inline-block",
      marginLeft: 12,
      fontSize: height2px / 1.5,
      lineHeight: `${height2px / 1.5}px`,
      color: theme.baseMediumHigh
    }
  };
};


export default Slider;
