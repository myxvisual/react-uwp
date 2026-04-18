import { useTheme } from './hooks/useTheme';
import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import IconButton from './IconButton';
import Swipe from './Swipe';
import Dots from './FlipView.Dots';

export interface DataProps {
  initialFocusIndex?: number;
  stopSwipe?: boolean;
  autoSwipe?: boolean;
  speed?: number;
  easy?: number;
  direction?: "vertical" | "horizontal";
  showNavigation?: boolean;
  controlledNavigation?: boolean;
  showControl?: boolean;
  supportPcDrag?: boolean;
  navigationIconSize?: number;
}
export interface FlipViewProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

const FlipView: React.FC<FlipViewProps> = ({
  direction = "horizontal",
  autoSwipe = true,
  navigationIconSize = 24,
  showNavigation = true,
  controlledNavigation = true,
  showControl = true,
  supportPcDrag = false,
  stopSwipe = false,
  initialFocusIndex,
  speed,
  easy,
  className,
  children,
  style,
  ...attributes
}) => {
  const theme = useTheme();
  const [focusSwipeIndex, setFocusSwipeIndex] = useState(0);
  const [currCanAutoSwipe, setCurrCanAutoSwipe] = useState(autoSwipe);
  const [currShowNavigation, setCurrShowNavigation] = useState(showNavigation);
  const mounted = useRef(false);
  const swipeRef = useRef<Swipe>(null);
  const dotsRef = useRef<Dots>(null);
  const rootElmRef = useRef<HTMLDivElement>(null);

  // 挂载标记
  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);

  const swipeForward = () => swipeRef.current?.swipeForward();
  const swipeBackWord = () => swipeRef.current?.swipeBackWord();

  const handleChangeSwipe = (index: number) => {
    const count = React.Children.count(children);
    if (mounted.current) {
      const newIndex = index % count;
      setFocusSwipeIndex(newIndex);
      dotsRef.current?.setFocusIndex(newIndex);
    }
  };

  const toggleCanAutoSwipe = (value?: boolean) => {
    setCurrCanAutoSwipe(prev => value ?? !prev);
  };

  const handleSwipeToIndex = (index: number) => {
    setFocusSwipeIndex(index);
    swipeRef.current?.swipeToIndex(index);
  };

  const handleMouseEnter = () => {
    if (!controlledNavigation && !currShowNavigation) {
      setCurrShowNavigation(true);
    }
  };

  const handleMouseLeave = () => {
    if (!controlledNavigation && currShowNavigation) {
      setCurrShowNavigation(false);
    }
  };

  const count = React.Children.count(children);
  const isHorizontal = direction === "horizontal";
  const _showNavigation = controlledNavigation ? showNavigation : currShowNavigation;

  const styles = getStyles(theme, { navigationIconSize, direction, style });
  const classes = theme.prepareStyles({ className: "flip-view", styles });

  return (
    <div
      ref={rootElmRef}
      className={theme.classNames(classes.root.className, className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={classes.root.style}
      {...attributes}
    >
      {count > 1 && _showNavigation && (
        <IconButton
          onClick={swipeBackWord}
          style={styles.iconLeft}
          hoverStyle={{ background: theme.baseLow }}
          activeStyle={{ background: theme.accent, color: "#fff" }}
        >
          {isHorizontal ? "ChevronLeft3Legacy" : "ScrollChevronUpLegacy"}
        </IconButton>
      )}
      <Swipe
        ref={swipeRef}
        onChangeSwipe={handleChangeSwipe}
        initialFocusIndex={initialFocusIndex}
        stopSwipe={stopSwipe}
        autoSwipe={currCanAutoSwipe}
        speed={speed}
        easy={easy}
        direction={direction}
        navigationIconSize={navigationIconSize}
        supportPcDrag={supportPcDrag}
      >
        {children}
      </Swipe>
      {count > 1 && _showNavigation && (
        <IconButton
          onClick={swipeForward}
          style={styles.iconRight}
          hoverStyle={{ background: theme.baseLow }}
          activeStyle={{ background: theme.accent, color: "#fff" }}
        >
          {isHorizontal ? "ChevronRight3Legacy" : "ScrollChevronDownLegacy"}
        </IconButton>
      )}
      <Dots
        ref={dotsRef}
        count={count}
        showControl={showControl}
        controlStyle={styles.control}
        controlContentStyle={styles.controlContent}
        iconStyle={styles.icon}
        handleSwipeToIndex={handleSwipeToIndex}
        defaultFocusSwipeIndex={focusSwipeIndex}
        toggleCanAutoSwipe={toggleCanAutoSwipe}
        currCanAutoSwipe={currCanAutoSwipe}
      />
    </div>
  );
};

// ------------------------------
// Style generation function (bottom of file)
// ------------------------------
const getStyles = (theme: ReactUWP.ThemeType, props: {
  navigationIconSize: number;
  direction: "vertical" | "horizontal";
  style?: React.CSSProperties;
}) => {
  const { navigationIconSize, direction, style } = props;
  const { prefixStyle } = theme;
  const isHorizontal = direction === "horizontal";

  const baseIconStyle: React.CSSProperties = {
    position: "absolute",
    background: theme.listLow,
    zIndex: 20,
    fontSize: navigationIconSize / 2,
    width: navigationIconSize * (isHorizontal ? 1 : 2),
    lineHeight: `${navigationIconSize * (isHorizontal ? 2 : 1)}px`,
    height: navigationIconSize * (isHorizontal ? 2 : 1)
  };

  return {
    root: prefixStyle({
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      zIndex: 0,
      width: "100%",
      background: theme.chromeLow,
      height: "auto",
      minHeight: baseIconStyle.height,
      ...style
    }),
    iconLeft: {
      ...baseIconStyle,
      top: isHorizontal ? `calc(50% - ${navigationIconSize}px)` : 0,
      left: isHorizontal ? 0 : `calc(50% - ${navigationIconSize}px)`
    },
    iconRight: {
      ...baseIconStyle,
      bottom: isHorizontal ? `calc(50% - ${navigationIconSize}px)` : 0,
      right: isHorizontal ? 0 : `calc(50% - ${navigationIconSize}px)`
    },
    control: {
      display: "flex",
      justifyContent: "center",
      position: "absolute",
      pointerEvents: "none",
      ...(isHorizontal ? {
        flexDirection: "row",
        width: "100%",
        bottom: 4,
        left: 0
      } as React.CSSProperties : {
        flexDirection: "column",
        height: "100%",
        top: 0,
        right: 4
      } as React.CSSProperties)
    },
    controlContent: prefixStyle({
      display: "flex",
      flexDirection: isHorizontal ? "row" : "column",
      alignItems: "center",
      pointerEvents: "all"
    }),
    icon: {
      fontSize: 6,
      margin: 2,
      cursor: "pointer"
    }
  };
};


export default FlipView;
