import { useTheme } from './hooks/useTheme';
import React, { useState, useRef, useMemo, useEffect } from 'react';

export interface DataProps {
  scrollBarStyle?: React.CSSProperties;
  trackStyle?: React.CSSProperties;
  thumbStyle?: React.CSSProperties;
  iconStyle?: React.CSSProperties;
  showVerticalBar?: boolean;
  showHorizontalBar?: boolean;
  autoHide?: boolean;
  scrollSpeed?: number;
  iconNode?: any;
}
export interface ScrollBarProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

const ScrollBar: React.FC<ScrollBarProps> = ({
  children = <div style={{ background: "linear-gradient(0deg, red 0%, blue 100%)", width: 400, height: 800 }}>ScrollBar</div>,
  showHorizontalBar = false,
  showVerticalBar = true,
  scrollBarStyle = { width: 10, height: "100%", background: "#f1f1f1" },
  thumbStyle = { width: 80, background: "#969696" },
  iconStyle = { background: "#b1b1b1" },
  scrollSpeed = 250,
  style,
  ...attributes
}) => {
  const [mouseDowning, setMouseDowning] = useState(false);
  const loopIconMouseDownTimeOut = useRef<NodeJS.Timeout | null>(null);
  const translateX = useRef(0);
  const translateY = useRef(0);
  const viewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return () => {
      if (loopIconMouseDownTimeOut.current) clearTimeout(loopIconMouseDownTimeOut.current);
    };
  }, []);

  const scrollTopByStep = (toTop: boolean) => {
    if (!viewRef.current) return;
    const newTranslateY = translateY.current + (toTop ? 40 : -40);
    translateY.current = toTop ? Math.min(0, newTranslateY) : newTranslateY;
    viewRef.current.style.transform = `translate3d(0px, ${translateY.current}px, 0px)`;
  };

  const iconMouseDown = (toTop: boolean) => {
    loopIconMouseDownTimeOut.current = setTimeout(() => {
      scrollTopByStep(toTop);
      if (mouseDowning) iconMouseDown(toTop);
    }, scrollSpeed / 10);
  };

  const topIconClick = () => {
    scrollTopByStep(true);
    setMouseDowning(true);
  };

  const topIconMouseDown = () => {
    setMouseDowning(true);
    iconMouseDown(true);
  };

  const bottomIconClick = () => {
    scrollTopByStep(false);
    setMouseDowning(true);
  };

  const bottomIconMouseDown = () => {
    setMouseDowning(true);
    iconMouseDown(false);
  };

  const iconMouseUp = () => {
    if (loopIconMouseDownTimeOut.current) clearTimeout(loopIconMouseDownTimeOut.current);
    setMouseDowning(false);
  };

  const styles = useMemo(() => getStyles({ style, scrollBarStyle, trackStyle: attributes.trackStyle, thumbStyle, iconStyle, scrollSpeed }), [style, scrollBarStyle, attributes.trackStyle, thumbStyle, iconStyle, scrollSpeed]);

  return (
    <div
      {...attributes}
      style={styles.root}
    >
      <div style={styles.view} ref={viewRef}>
        {children}
      </div>
      {showHorizontalBar && (
        <div
          style={{
            ...styles.horizontal,
            height: styles.horizontal.width,
            width: styles.horizontal.height
          }}
        >
          <div style={{ ...styles.icon, top: 0, left: 0 }} />
          <div style={{ ...styles.thumb }} />
          <div style={{ ...styles.icon, top: 0, right: 0 }} />
        </div>
      )}
      {showVerticalBar && (
        <div style={styles.vertical}>
          <div
            onMouseDown={topIconMouseDown}
            onMouseUp={iconMouseUp}
            onClick={topIconClick}
            style={{ ...styles.icon, left: 0, top: 0 }}
          />
          <div style={{ ...styles.thumb, height: styles.thumb.width, width: styles.thumb.height }} />
          <div
            onClick={bottomIconClick}
            onMouseDown={bottomIconMouseDown}
            onMouseUp={iconMouseUp}
            style={{ ...styles.icon, left: 0, bottom: 0 }}
          />
        </div>
      )}
    </div>
  );
};

// ------------------------------
// Style generation function (bottom of file)
// ------------------------------
const getStyles = (props: {
  style?: React.CSSProperties;
  scrollBarStyle: React.CSSProperties;
  trackStyle?: React.CSSProperties;
  thumbStyle: React.CSSProperties;
  iconStyle: React.CSSProperties;
  scrollSpeed: number;
}) => {
  const { style, scrollBarStyle, trackStyle, thumbStyle, iconStyle, scrollSpeed } = props;

  return {
    root: {
      position: "relative",
      overflow: "hidden",
      width: "100%",
      height: "100%",
      ...style
    },
    view: {
      WebkitOverflowScrolling: "touch",
      width: "100%",
      height: "100%",
      transition: `all ${scrollSpeed}ms 0s linear`,
      transform: `translate3d(0px, 0px, 0px)`
    },
    horizontal: {
      ...scrollBarStyle,
      position: "absolute",
      bottom: 0,
      left: 0,
      ...trackStyle,
      paddingLeft: scrollBarStyle.width,
      paddingRight: scrollBarStyle.width
    },
    vertical: {
      ...scrollBarStyle,
      position: "absolute",
      top: 0,
      right: 0,
      ...trackStyle,
      paddingTop: scrollBarStyle.width,
      paddingBottom: scrollBarStyle.width
    },
    thumb: {
      position: "absolute",
      ...scrollBarStyle,
      ...thumbStyle
    },
    icon: {
      zIndex: 1,
      position: "absolute",
      transition: "all .25s 0s ease-in-out",
      ...iconStyle,
      width: scrollBarStyle.width,
      height: scrollBarStyle.width
    }
  };
};

export default ScrollBar;
