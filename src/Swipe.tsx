import { useTheme } from './hooks/useTheme';
import React, { useState, useRef, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import shallowEqual from './utils/shallowEqual';
import IS_NODE_ENV from './utils/nodeJS/IS_NODE_ENV';

export interface DataProps {
  initialFocusIndex?: number;
  stopSwipe?: boolean;
  autoSwipe?: boolean;
  speed?: number;
  easy?: number;
  delay?: number;
  direction?: "vertical" | "horizontal";
  transitionTimingFunction?: string;
  navigationIconSize?: number;
  showIcon?: boolean;
  animate?: "slide" | "opacity";
  supportPcDrag?: boolean;
  onChangeSwipe?: (index?: number) => void;
}
export interface SwipeProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

const Swipe: React.FC<SwipeProps> = ({
  direction = "horizontal",
  autoSwipe = true,
  animate = "slide",
  transitionTimingFunction = "ease-in-out",
  initialFocusIndex = 0,
  stopSwipe = false,
  speed = 1500,
  delay = 5000,
  easy = 0.85,
  supportPcDrag = false,
  onChangeSwipe,
  style,
  className,
  children,
  ...attributes
}) => {
  const theme = useTheme();
  const childrenArray = useMemo(() => React.Children.toArray(children), [children]);
  const childrenLength = childrenArray.length;
  const isSingleChildren = childrenLength === 1;
  const itemsLength = useMemo(() => childrenLength > 1 ? childrenLength + 2 : childrenLength, [childrenLength]);

  const [focusIndex, setFocusIndex] = useState(isSingleChildren ? initialFocusIndex : initialFocusIndex + 1);
  const [currStopSwipe, setCurrStopSwipe] = useState(stopSwipe);
  const [haveAnimate, setHaveAnimate] = useState(false);
  const [swiping, setSwiping] = useState(false);
  const isHorizontal = direction === "horizontal";

  const timeoutId = useRef<NodeJS.Timeout | null>(null);
  const swipeTimer = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const startClientX = useRef<number>(0);
  const startClientY = useRef<number>(0);
  const endClientX = useRef<number | undefined>(undefined);
  const endClientY = useRef<number | undefined>(undefined);
  const setNextSliderTime = useRef<number>(0);
  const originBodyStyle = useRef(IS_NODE_ENV ? undefined : { ...document.body.style });

  // 循环轮播逻辑
  const setNextSlider = () => {
    if (currStopSwipe || (setNextSliderTime.current && Date.now() - setNextSliderTime.current < delay)) return;
    timeoutId.current = setTimeout(() => {
      if (!currStopSwipe) swipeForward();
      setNextSlider();
    }, delay);
    setNextSliderTime.current = Date.now();
  };

  // 初始化和props更新
  useEffect(() => {
    if (timeoutId.current) clearTimeout(timeoutId.current);
    if (autoSwipe && !isSingleChildren) {
      timeoutId.current = setTimeout(() => {
        swipeForward();
        setNextSlider();
      }, delay);
      setNextSliderTime.current = Date.now();
    }

    return () => {
      if (timeoutId.current) clearTimeout(timeoutId.current);
      if (swipeTimer.current) clearTimeout(swipeTimer.current);
    };
  }, [autoSwipe, delay, childrenLength]);

  const setRightFocusIndex = (index: number): number => {
    return index < 0 ? itemsLength - Math.abs(index) % itemsLength : index % itemsLength;
  };

  const getFocusIndex = () => focusIndex;
  Swipe.getFocusIndex = getFocusIndex;

  const swipeToIndex = (index: number) => {
    if (timeoutId.current) clearTimeout(timeoutId.current);
    const newIndex = index + 1;
    setHaveAnimate(true);
    setFocusIndex(setRightFocusIndex(newIndex));
    setCurrStopSwipe(true);
  };
  Swipe.swipeToIndex = swipeToIndex;

  const swipeForward = () => {
    if (swiping) return;
    if (!isSingleChildren) onChangeSwipe?.(focusIndex);
    setSwiping(true);
    const isLast = focusIndex === itemsLength - 2;

    if (isLast) {
      setHaveAnimate(true);
      setFocusIndex(setRightFocusIndex(focusIndex + 1));
      swipeTimer.current = setTimeout(() => {
        setHaveAnimate(false);
        setFocusIndex(1);
        setSwiping(false);
      }, speed);
    } else {
      setHaveAnimate(true);
      setFocusIndex(setRightFocusIndex(focusIndex + 1));
      swipeTimer.current = setTimeout(() => {
        setSwiping(false);
      }, speed);
    }
  };

  const swipeBackWord = () => {
    if (swiping || !autoSwipe) return;
    if (!isSingleChildren) onChangeSwipe?.(focusIndex);
    setSwiping(true);
    const isFirst = focusIndex === 1;

    if (isFirst) {
      setHaveAnimate(true);
      setFocusIndex(setRightFocusIndex(focusIndex - 1));
      swipeTimer.current = setTimeout(() => {
        setHaveAnimate(false);
        setFocusIndex(itemsLength - 2);
        setSwiping(false);
      }, speed);
    } else {
      setHaveAnimate(true);
      setFocusIndex(setRightFocusIndex(focusIndex - 1));
      swipeTimer.current = setTimeout(() => {
        setSwiping(false);
      }, speed);
    }
  };

  const checkIsToucheEvent = (e: any) => e.type.includes("touch");

  const mouseOrTouchDownHandler = (e: any) => {
    if (!IS_NODE_ENV) {
      Object.assign(document.body.style, {
        userSelect: "none",
        msUserSelect: "none",
        webkitUserSelect: "none"
      });
    }
    endClientX.current = undefined;
    endClientY.current = undefined;
    setCurrStopSwipe(true);
    const isToucheEvent = checkIsToucheEvent(e);
    if (!isToucheEvent && !supportPcDrag) return;

    if (isToucheEvent) {
      window.addEventListener("touchmove", mouseOrTouchMoveHandler);
      window.addEventListener("touchend", mouseOrTouchUpHandler);
      if (isHorizontal) {
        startClientX.current = e.changedTouches[0].clientX;
      } else {
        startClientY.current = e.changedTouches[0].clientY;
      }
    } else {
      window.addEventListener("mousemove", mouseOrTouchMoveHandler);
      window.addEventListener("mouseup", mouseOrTouchUpHandler);
      if (isHorizontal) {
        startClientX.current = e.clientX;
      } else {
        startClientY.current = e.clientY;
      }
    }
    if (contentRef.current) {
      contentRef.current.style.webkitTransition = "all 0.06125s 0s linear";
    }
  };

  const mouseOrTouchMoveHandler = (e: any) => {
    if (!IS_NODE_ENV && originBodyStyle.current) {
      Object.assign(document.body.style, {
        userSelect: undefined,
        msUserSelect: undefined,
        webkitUserSelect: undefined,
        ...originBodyStyle.current
      });
    }
    const isToucheEvent = checkIsToucheEvent(e);
    if (isToucheEvent) {
      if (isHorizontal) {
        endClientX.current = e.changedTouches[0].clientX;
      } else {
        endClientY.current = e.changedTouches[0].clientY;
      }
    } else {
      if (isHorizontal) {
        endClientX.current = e.clientX;
      } else {
        endClientY.current = e.clientY;
      }
    }
    if (contentRef.current && containerRef.current) {
      const containerSize = containerRef.current.getBoundingClientRect()[isHorizontal ? "width" : "height"];
      const offset = isHorizontal 
        ? containerSize * (-focusIndex) - startClientX.current + (endClientX.current || 0)
        : containerSize * (-focusIndex) - startClientY.current + (endClientY.current || 0);
      contentRef.current.style.webkitTransform = `translate${isHorizontal ? "X" : "Y"}(${offset}px)`;
    }
  };

  const mouseOrTouchUpHandler = (e: any) => {
    if (!IS_NODE_ENV && originBodyStyle.current) {
      Object.assign(document.body.style, {
        userSelect: undefined,
        msUserSelect: undefined,
        webkitUserSelect: undefined,
        cursor: undefined,
        ...originBodyStyle.current
      });
    }
    const isToucheEvent = checkIsToucheEvent(e);
    if (isToucheEvent) {
      window.removeEventListener("touchmove", mouseOrTouchMoveHandler);
      window.removeEventListener("touchend", mouseOrTouchUpHandler);
    } else {
      window.removeEventListener("mousemove", mouseOrTouchMoveHandler);
      window.removeEventListener("mouseup", mouseOrTouchUpHandler);
    }

    if ((isHorizontal && endClientX.current === undefined) || (!isHorizontal && endClientY.current === undefined)) {
      return;
    }
    const transition = `all ${speed}ms 0s ${transitionTimingFunction}`;
    if (contentRef.current) {
      contentRef.current.style.webkitTransition = transition;
    }
    setCurrStopSwipe(false);
    let currEasy = Math.max(0, Math.min(1, easy));
    const movePosition = isHorizontal 
      ? (endClientX.current || 0) - startClientX.current 
      : (endClientY.current || 0) - startClientY.current;
    const isNext = movePosition < 0;
    const containerWidth = containerRef.current?.getBoundingClientRect().width || 0;
    let newIndex = focusIndex + movePosition / containerWidth;
    newIndex = isNext ? Math.ceil(newIndex + currEasy / 2) : Math.floor(newIndex - currEasy / 2);
    newIndex = setRightFocusIndex(newIndex);

    if (newIndex === focusIndex) {
      if (contentRef.current && containerRef.current) {
        const offset = containerWidth * (-newIndex / childrenLength) - startClientX.current + (endClientX.current || 0);
        contentRef.current.style.webkitTransform = `translateX(${offset}px)`;
      }
    } else {
      isNext ? swipeForward() : swipeBackWord();
    }
    if (autoSwipe && !isSingleChildren) {
      setNextSlider();
    }
  };

  // 处理轮播子项，前后各补一个实现无缝滚动
  const renderChildren = useMemo(() => {
    if (childrenLength <= 1) return childrenArray;
    const arr = [...childrenArray];
    arr.push(arr[0]);
    arr.unshift(arr[childrenLength - 1]);
    return arr;
  }, [childrenArray, childrenLength]);

  const styles = useMemo(() => getStyles(theme, {
    transitionTimingFunction,
    speed,
    style,
    direction,
    isSingleChildren,
    childrenLength,
    haveAnimate,
    focusIndex
  }), [theme, transitionTimingFunction, speed, style, direction, isSingleChildren, childrenLength, haveAnimate, focusIndex]);

  const cls = theme.prepareStyles({ className: "swipe", styles });
  const transition = `transform ${speed}ms 0s ${transitionTimingFunction}`;

  return (
    <div
      {...attributes}
      ref={containerRef}
      style={cls.root.style}
      className={theme.classNames(cls.root.className, className)}
    >
      <div
        onMouseDown={!stopSwipe && !isSingleChildren ? mouseOrTouchDownHandler : undefined}
        onTouchStart={!stopSwipe && !isSingleChildren ? mouseOrTouchDownHandler : undefined}
        ref={contentRef}
        style={theme.prefixStyle({
          ...cls.content.style,
          transform: `translate${isHorizontal ? "X" : "Y"}(${-focusIndex * 100 / childrenLength}%)`,
          transition: haveAnimate ? transition : undefined
        })}
        className={cls.content.className}
      >
        {renderChildren.map((child, index) => (
          <div data-index={index} {...cls.item} key={index}>
            {child}
          </div>
        ))}
      </div>
    </div>
  );
};

// ------------------------------
// Style generation function (bottom of file)
// ------------------------------
const getStyles = (theme: ReactUWP.ThemeType, props: {
  transitionTimingFunction: string;
  speed: number;
  style?: React.CSSProperties;
  direction: "vertical" | "horizontal";
  isSingleChildren: boolean;
  childrenLength: number;
  haveAnimate: boolean;
  focusIndex: number;
}) => {
  const { transitionTimingFunction, speed, style, direction, isSingleChildren, childrenLength, haveAnimate, focusIndex } = props;
  const { prefixStyle } = theme;
  const isHorizontal = direction === "horizontal";

  return {
    root: prefixStyle({
      position: "relative",
      display: "flex",
      flexDirection: isHorizontal ? "row" : "column",
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      height: "100%",
      overflow: "hidden",
      flex: "0 0 auto",
      ...style
    }),
    content: prefixStyle({
      position: "relative",
      flex: "0 0 auto",
      display: "flex",
      flexDirection: isHorizontal ? "row" : "column",
      flexWrap: "nowrap",
      alignItems: "center",
      justifyContent: "center",
      height: isHorizontal ? "100%" : `${childrenLength * 100}%`,
      width: isHorizontal ? `${childrenLength * 100}%` : "100%",
      left: (isHorizontal && !isSingleChildren) ? `${((isSingleChildren ? 0 : 2 + childrenLength) / 2 - 0.5) * 100}%` : undefined,
      top: isHorizontal ? undefined : `${((isSingleChildren ? 0 : 2 + childrenLength) / 2 - 0.5) * 100}%`
    }),
    item: prefixStyle({
      position: "relative",
      overflow: "hidden",
      width: isHorizontal ? `${100 / childrenLength}%` : "100%",
      height: isHorizontal ? "100%" : `${100 / childrenLength}%`,
      flex: "0 0 auto",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      userSelect: "none",
      userDrag: "none",
      WebkitUserDrag: "none"
    } as any)
  };
};


export default Swipe;
