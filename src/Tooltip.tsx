import { useTheme } from './hooks/useTheme';
import React, { useRef, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Throttle } from './utils/Throttle';

export interface DataProps {
  content?: string;
  contentNode?: React.ReactNode;
  verticalPosition?: "top" | "bottom" | "center";
  horizontalPosition?: "left" | "right" | "center";
  margin?: number;
  autoClose?: boolean;
  autoCloseTimeout?: number;
  closeDelay?: number;
  background?: string;
}
export interface TooltipProps extends DataProps, React.HTMLAttributes<HTMLSpanElement> {}

const Tooltip: React.FC<TooltipProps> = ({
  verticalPosition = "top",
  horizontalPosition = "center",
  margin = 4,
  autoClose = false,
  autoCloseTimeout = 750,
  closeDelay = 0,
  background,
  style,
  className,
  children,
  content,
  contentNode,
  ...attributes
}) => {
  const theme = useTheme();
  const rootElm = useRef<HTMLDivElement>(null);
  const tooltipElm = useRef<HTMLSpanElement>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const autoCloseTimer = useRef<NodeJS.Timeout | null>(null);
  const closeDelayTimer = useRef<NodeJS.Timeout | null>(null);
  const showThrottle = useRef(new Throttle()).current;
  const hideThrottle = useRef(new Throttle()).current;

  const toggleShow = () => {
    if (!showThrottle.shouldFunctionRun()) return;
    if (autoCloseTimer.current) clearTimeout(autoCloseTimer.current);
    if (showTooltip) return;

    setShowTooltip(true);
    if (autoClose && autoCloseTimeout) {
      autoCloseTimer.current = setTimeout(toggleHide, autoCloseTimeout);
    }
  };

  const toggleHide = () => {
    if (!hideThrottle.shouldFunctionRun()) return;
    if (closeDelayTimer.current) clearTimeout(closeDelayTimer.current);
    if (!showTooltip) return;

    if (closeDelay) {
      closeDelayTimer.current = setTimeout(() => {
        setShowTooltip(false);
      }, closeDelay);
      return;
    }
    setShowTooltip(false);
  };

  const getBaseStyle = (show = false, positionStyle?: React.CSSProperties): React.CSSProperties => {
    return theme.prefixStyle({
      height: 28,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      padding: "4px 8px",
      transition: (show || positionStyle) ? "transform .25s 0s ease-in-out, opacity .25s 0s ease-in-out" : void 0,
      border: `1px solid ${theme.useFluentDesign ? theme.listLow : theme.baseLow}`,
      color: theme.baseMediumHigh,
      background: background || theme.chromeMedium,
      opacity: show ? 1 : 0,
      transform: `translateY(${show ? "0px" : "10px"})`,
      position: "absolute",
      fontSize: 14,
      pointerEvents: show ? "all" : "none",
      zIndex: theme.zIndex.tooltip,
      ...style,
      ...positionStyle
    });
  };

  const getTooltipStyle = useMemo(() => {
    if (!rootElm.current || !tooltipElm.current) return getBaseStyle();

    const { width: rootWidth, height: rootHeight } = rootElm.current.getBoundingClientRect();
    const { width: tipWidth, height: tipHeight } = tooltipElm.current.getBoundingClientRect();
    const positionStyle: React.CSSProperties = {};
    const isVerticalCenter = verticalPosition === "center";

    switch (horizontalPosition) {
      case "left":
        positionStyle.right = isVerticalCenter ? (rootWidth + margin) : 0;
        break;
      case "center":
        positionStyle.left = (rootWidth - tipWidth) / 2;
        break;
      case "right":
        positionStyle.left = isVerticalCenter ? (-rootWidth - margin) : 0;
        break;
    }

    switch (verticalPosition) {
      case "top":
        positionStyle.top = -tipHeight - margin;
        break;
      case "center":
        positionStyle.top = (rootHeight - tipHeight) / 2;
        break;
      case "bottom":
        positionStyle.top = rootHeight + margin;
        break;
    }

    return getBaseStyle(showTooltip, positionStyle);
  }, [showTooltip, verticalPosition, horizontalPosition, margin, background, style]);

  const cls = getCls(theme, tooltipStyle, className);

  return (
    <div
      style={cls.root.style}
      className={cls.root.className}
      ref={rootElm}
      onMouseEnter={toggleShow}
      onClick={toggleShow}
      onMouseLeave={toggleHide}
    >
      <span
        ref={tooltipElm}
        {...attributes}
        style={cls.tooltip.style}
        className={cls.tooltip.className}
      >
        {content || contentNode}
      </span>
      {children}
    </div>
  );
};

// ------------------------------
// Style generation function (bottom of file)
// ------------------------------
const getCls = (theme: ReactUWP.ThemeType, tooltipStyle: React.CSSProperties, className?: string) => {
  return {
    root: theme.prepareStyle({
      className: "tooltip-root",
      style: { position: "relative", display: "inline-block" }
    }),
    tooltip: theme.prepareStyle({
      className: "tooltip",
      style: tooltipStyle,
      extendsClassName: className
    })
  };
};


export default Tooltip;
