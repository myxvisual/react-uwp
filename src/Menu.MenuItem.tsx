import React, { useState, useRef, useEffect } from 'react';
import { codes } from "keycode";
import AddBlurEvent from "../utils/AddBlurEvent";
import Icon from "../Icon";
import PseudoClasses from "../PseudoClasses";
import RevealEffect, { RevealEffectProps } from "../RevealEffect";
import { useTheme } from './hooks/useTheme';

export interface DataProps {
  icon?: string;
  label?: string;
  children?: MenuItem | MenuItem[] | React.ReactElement<any> | React.ReactElement<any> [];
  defaultExpanded?: boolean;
  itemWidth?: number;
  itemHeight?: number;
  hoverStyle?: React.CSSProperties;
  expandedMethod?: "active" | "hover";
  revealConfig?: RevealEffectProps;
}
export interface AnyAttributes {
  [key: string]: any;
}
export interface MenuItemProps extends DataProps, AnyAttributes {}

const MenuItem: React.FC<MenuItemProps> = ({
  itemWidth = 240,
  itemHeight = 44,
  expandedMethod = "hover",
  icon,
  label,
  children,
  defaultExpanded,
  className,
  hoverStyle,
  revealConfig,
  ...attributes
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const addBlurEvent = useRef(new AddBlurEvent());
  const rootElm = useRef<HTMLDivElement>(null);
  const theme = useTheme();

  // 同步defaultExpanded到state
  useEffect(() => {
    if (defaultExpanded !== undefined && defaultExpanded !== expanded) {
      setExpanded(defaultExpanded);
    }
  }, [defaultExpanded, expanded]);

  // blur事件处理
  useEffect(() => {
    addBlurEvent.current.setConfig({
      addListener: expanded,
      clickExcludeElm: rootElm.current,
      blurCallback: () => {
        setExpanded(false);
      },
      blurKeyCodes: [codes.esc]
    });
    return () => {
      addBlurEvent.current.cleanEvent();
    };
  }, [expanded]);

  const toggleExpanded = (value?: boolean) => {
    setExpanded(prev => value ?? !prev);
  };

  const isHoverToggled = expandedMethod === "hover";
  const iconProps = {
    size: itemHeight,
    style: { fontSize: itemHeight / 3 }
  };

  const inlineStyles = getStyles(theme, {
    hoverStyle,
    children,
    style: attributes.style,
    itemWidth,
    itemHeight,
    expanded
  });
  const styles = theme.prepareStyles({
    className: "menu",
    styles: inlineStyles
  });

  return (
    <PseudoClasses
      {...attributes}
      className={theme.classNames(styles.root.className, className)}
      style={styles.root.style}
      onMouseEnter={isHoverToggled ? () => toggleExpanded(true) : undefined}
      onMouseLeave={isHoverToggled ? () => toggleExpanded(false) : undefined}
    >
      <div ref={rootElm}>
        <Icon {...iconProps}>
          {icon}
        </Icon>
        <span style={styles.label.style} className={styles.label.className}>{label}</span>
        {children && (
          <Icon
            {...iconProps}
            style={{
              fontSize: itemHeight / 3,
              cursor: "pointer",
              pointerEvents: "all"
            }}
            onClick={isHoverToggled ? undefined : () => toggleExpanded()}
          >
            ScrollChevronRightLegacy
          </Icon>
        )}
        {children && (
          <div style={styles.child.style} className={styles.child.className}>
            {React.Children.map(children, (child: any, index) => {
              return child.type === MenuItem ? React.cloneElement(child, {
                itemWidth,
                itemHeight,
                hoverStyle,
                expandedMethod
              }) : child;
            })}
          </div>
        )}
        <RevealEffect effectRange="self" {...revealConfig} />
      </div>
    </PseudoClasses>
  );
};

// ------------------------------
// Style generation function (bottom of file)
// ------------------------------
const getStyles = (theme: ReactUWP.ThemeType, props: {
  hoverStyle?: React.CSSProperties;
  children?: any;
  style?: React.CSSProperties;
  itemWidth: number;
  itemHeight: number;
  expanded?: boolean;
}) => {
  const { hoverStyle, children, style, itemWidth, itemHeight, expanded } = props;
  const { prefixStyle } = theme;

  return {
    root: prefixStyle({
      position: "relative",
      border: `${theme.borderWidth}px solid transparent`,
      borderWidth: `${theme.borderWidth}px 0px`,
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      cursor: "default",
      height: itemHeight,
      fontSize: itemHeight / 3,
      lineHeight: `${itemHeight}px`,
      width: "100%",
      "&:hover": hoverStyle || {
        background: theme.listLow
      },
      ...style
    }),
    label: {
      width: itemWidth - itemHeight - (children ? itemHeight : 0),
      height: itemHeight,
      overflow: "hidden",
      whiteSpace: "nowrap",
      textOverflow: "ellipsis"
    },
    child: prefixStyle({
      ...theme.acrylicTexture60.style,
      transform: `translate3d(${expanded ? 0 : `-${itemHeight}px`}, 0, 0)`,
      opacity: expanded ? 1 : 0,
      pointerEvents: expanded ? "all" : "none",
      transition: "all .25s",
      position: "absolute",
      top: -1,
      left: "100%",
      width: "100%",
      border: `1px solid ${theme.listLow}`
    })
  };
};

export default MenuItem;
