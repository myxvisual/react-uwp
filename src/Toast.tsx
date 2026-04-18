import { useTheme } from './hooks/useTheme';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { findDOMNode } from 'react-dom';
import Icon from './Icon';
import CustomAnimate, { slideRightInProps } from './Animate/CustomAnimate';

export interface DataProps {
  defaultShow?: boolean;
  logoNode?: React.ReactNode;
  title?: string;
  description?: string | string[];
  closeDelay?: number;
  onToggleShowToast?: (showToast?: boolean) => void;
  showCloseIcon?: boolean;
  key?: any;
}
export interface ToastProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

const Toast: React.FC<ToastProps> = ({
  defaultShow = false,
  onToggleShowToast,
  showCloseIcon = false,
  logoNode,
  title,
  description,
  closeDelay,
  style,
  className,
  children,
  ...attributes
}) => {
  const theme = useTheme();
  const [showToast, setShowToast] = useState(defaultShow);
  const hiddenTimer = useRef<NodeJS.Timeout | null>(null);
  const closeTimer = useRef<NodeJS.Timeout | null>(null);
  const customAnimate = useRef<CustomAnimate>(null);
  const customAnimateElm = useRef<HTMLDivElement>(null);

  // 受控处理
  useEffect(() => {
    if (defaultShow !== showToast) {
      setShowToast(defaultShow);
    }
  }, [defaultShow]);

  // 生命周期：挂载
  useEffect(() => {
    theme.addToast(Toast);
    if (customAnimate.current) {
      customAnimateElm.current = findDOMNode(customAnimate.current) as HTMLDivElement;
    }
    addCloseDelay();

    return () => {
      theme.removeToast(Toast);
      if (hiddenTimer.current) clearTimeout(hiddenTimer.current);
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  // 更新时处理
  useEffect(() => {
    theme.updateToast(Toast);
    if (customAnimate.current && !customAnimateElm.current) {
      customAnimateElm.current = findDOMNode(customAnimate.current) as HTMLDivElement;
    }

    if (customAnimateElm.current) {
      const elmStyle = customAnimateElm.current.style;
      if (showToast) {
        Object.assign(elmStyle, { height: "auto", margin: "10px 0" });
        if (hiddenTimer.current) clearTimeout(hiddenTimer.current);
      } else {
        hiddenTimer.current = setTimeout(() => {
          Object.assign(elmStyle, { height: "0px", margin: "0px" });
        }, 250);
      }
    }

    addCloseDelay();
  }, [showToast]);

  const addCloseDelay = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    if (closeDelay !== undefined && showToast) {
      closeTimer.current = setTimeout(() => {
        setShowToast(false);
        onToggleShowToast?.(false);
      }, closeDelay);
    }
  };

  const toggleShowToast = (show?: boolean) => {
    const newShow = show ?? !showToast;
    if (newShow !== showToast) {
      setShowToast(newShow);
      onToggleShowToast?.(newShow);
    }
  };

  const styles = useMemo(() => getStyles(theme, { style, showCloseIcon, showToast }), [theme, style, showCloseIcon, showToast]);
  const cls = theme.prepareStyles({ className: "toast", styles });

  const virtualRender = () => (
    <CustomAnimate
      {...slideRightInProps}
      leaveStyle={slideRightInProps}
      appearAnimate={false}
      wrapperStyle={styles.root}
      ref={customAnimate}
      key={attributes.key}
    >
      <div
        {...attributes}
        style={cls.wrapper.style}
        className={theme.classNames(cls.wrapper.className, className)}
      >
        <div {...cls.card}>
          {logoNode}
          <span {...cls.descContent}>
            <p {...cls.title}>{title}</p>
            {typeof description === "string" ? (
              <p {...cls.description}>{description}</p>
            ) : description?.map((desc, index) => (
              <p {...cls.description} key={index}>{desc}</p>
            ))}
          </span>
        </div>
        {showCloseIcon && (
          <Icon
            style={styles.closeIcon}
            hoverStyle={{ color: theme.baseHigh }}
            onClick={() => toggleShowToast(false)}
          >
            ClearLegacy
          </Icon>
        )}
        {children}
      </div>
    </CustomAnimate>
  );

  Toast.virtualRender = virtualRender;

  return null;
};

// ------------------------------
// Style generation function (bottom of file)
// ------------------------------
const getStyles = (theme: ReactUWP.ThemeType, props: {
  style?: React.CSSProperties;
  showCloseIcon: boolean;
  showToast: boolean;
}) => {
  const { style, showCloseIcon, showToast } = props;
  const { prefixStyle } = theme;

  return {
    root: {
      display: "inherit",
      overflow: "hidden",
      transition: "transform .75s, opacity .75s",
      margin: "10px 0",
      opacity: showToast ? 1 : .5,
      transform: `translate3d(${showToast ? 0 : "100%"}, 0, 0)`
    },
    wrapper: prefixStyle({
      width: 320,
      padding: 10,
      position: "relative",
      fontSize: 14,
      color: theme.baseMediumHigh,
      background: theme.chromeLow,
      border: `1px solid ${theme.listLow}`,
      pointerEvents: "all",
      flex: "0 0 auto",
      overflow: "hidden",
      height: "auto",
      ...style
    }),
    closeIcon: {
      fontSize: 12,
      position: "absolute",
      top: 10,
      right: 10,
      cursor: "pointer"
    },
    card: prefixStyle({
      display: "flex",
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "flex-start",
      fontSize: 18,
      lineHeight: 1.6
    }),
    descContent: {
      marginLeft: 10,
      marginRight: showCloseIcon ? 16 : 0,
      width: "100%"
    },
    title: {
      fontSize: 14,
      color: theme.baseHigh,
      lineHeight: 1.6
    },
    description: {
      fontSize: 12,
      color: theme.baseMedium,
      lineHeight: 1.4
    }
  };
};


export default Toast;
