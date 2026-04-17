import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import RevealEffect, { RevealEffectProps } from './RevealEffect';
import IconButton from './IconButton';

export interface ExpandedItem {
  iconNode?: React.ReactElement<any>;
  title?: string;
  onClick?: (e?: React.MouseEvent<HTMLAnchorElement>) => void;
  href?: string;
  focusColor?: string;
}
export interface DataProps {
  isFloatRight?: boolean;
  initWidth?: number;
  expandedWidth?: number;
  topNode?: React.ReactElement<any> | React.ReactElement<any>[];
  bottomNode?: React.ReactElement<any> | React.ReactElement<any>[];
  expandedItems?: ExpandedItem[];
  focusItemIndex?: number;
  onFocusItem?: (itemIndex?: number) => void;
  revealConfig?: RevealEffectProps;
}
export interface FloatNavProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

const FloatNav: React.FC<FloatNavProps> = ({
  onFocusItem,
  expandedItems = [],
  initWidth = 48,
  isFloatRight = true,
  expandedWidth = 240,
  topNode,
  bottomNode,
  focusItemIndex,
  className,
  revealConfig,
  style,
  ...attributes
}, context: { theme: ReactUWP.ThemeType }) => {
  const [currFocusItemIndex, setCurrFocusItemIndex] = useState<number | undefined>(focusItemIndex);
  const [hoverItem, setHoverItem] = useState<number | null>(null);
  const [hoverIndexArray, setHoverIndexArray] = useState<boolean[]>([]);
  const { theme } = context;

  // 受控处理focusItemIndex
  useEffect(() => {
    setCurrFocusItemIndex(focusItemIndex);
  }, [focusItemIndex]);

  // 暴露实例方法
  const focusIndex = (index: number) => setCurrFocusItemIndex(index);
  const getFocusIndex = () => currFocusItemIndex;
  const getItems = () => expandedItems;
  FloatNav.focusIndex = focusIndex;
  FloatNav.getFocusIndex = getFocusIndex;
  FloatNav.getItems = getItems;

  const itemStyle = theme.prefixStyle({
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    background: theme.altHigh,
    transition: "all .25s 0s cubic-bezier(.04, .89, .44, 1.07)",
    fontSize: 12
  });

  const styles = getStyles(theme, { style, initWidth, isFloatRight });
  const classes = theme.prepareStyles({ className: "float-nav", styles });

  return (
    <div
      {...attributes}
      style={classes.root.style}
      className={theme.classNames(classes.root.className, className)}
    >
      <div
        {...attributes}
        style={classes.wrapper.style}
        className={classes.wrapper.className}
      >
        {React.Children.map(topNode, (child: React.ReactElement<any>, index) => (
          <div
            key={index}
            style={theme.prefixStyle({
              ...itemStyle,
              width: initWidth,
              height: initWidth
            })}
          >
            {React.cloneElement(child, { style: { ...child.props.style, width: initWidth, height: initWidth } })}
          </div>
        ))}
        {expandedItems.map((item, index) => {
          const { iconNode, focusColor, title, href, onClick } = item;
          const isFirst = currFocusItemIndex === index;
          const isHovered = hoverItem === index;
          const padding = initWidth / 2;
          const linkStyle = theme.prefixStyle({
            position: "relative",
            overflow: "hidden",
            borderTop: `${theme.borderWidth}px solid transparent`,
            borderBottom: `${theme.borderWidth}px solid transparent`,
            display: "flex",
            alignItems: "center",
            boxSizing: "border-box",
            transition: "all .25s",
            textDecoration: "none",
            height: initWidth
          });
          const linkStyleClasses = theme.prepareStyle({
            className: "float-nav-link",
            style: linkStyle
          });

          return (
            <a
              key={index}
              onMouseEnter={() => {
                const newHoverArray = [...hoverIndexArray];
                newHoverArray[index] = true;
                setHoverIndexArray(newHoverArray);
                setHoverItem(index);
              }}
              onMouseLeave={() => {
                const newHoverArray = [...hoverIndexArray];
                newHoverArray[index] = false;
                setHoverIndexArray(newHoverArray);
                setHoverItem(null);
              }}
              href={href}
              onClick={e => {
                onFocusItem?.(index);
                onClick?.(e);
              }}
              style={theme.prefixStyle({
                ...linkStyleClasses.style,
                margin: 0,
                border: "none",
                outline: "none",
                flexDirection: isFloatRight ? "row" : "row-reverse",
                justifyContent: isHovered ? "space-between" : "center",
                color: hoverIndexArray[index] ? "#fff" : theme.baseHigh,
                background: (isFirst || isHovered) ? (focusColor || theme.accent) : theme.altHigh,
                width: hoverIndexArray[index] ? expandedWidth : initWidth
              })}
              className={linkStyleClasses.className}
            >
              {isHovered && <span style={{ cursor: "default", color: "#fff", margin: `0 ${padding}px`, whiteSpace: "nowrap" }}>{title}</span>}
              {iconNode.type === IconButton ? (
                React.cloneElement(iconNode, {
                  style: { color: hoverIndexArray[index] || isFirst ? "#fff" : theme.baseHigh }
                })
              ) : iconNode}
            </a>
          );
        })}
        {React.Children.map(bottomNode, (child: React.ReactElement<any>, index) => (
          <div
            key={index}
            style={theme.prefixStyle({
              ...itemStyle,
              width: initWidth,
              height: initWidth
            })}
          >
            {React.cloneElement(child, {
              style: {
                ...child.props.style,
                width: initWidth,
                height: initWidth
              }
            })}
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
  style?: React.CSSProperties;
  initWidth: number;
  isFloatRight: boolean;
}) => {
  const { style, initWidth, isFloatRight } = props;
  const { prefixStyle } = theme;
  return {
    root: prefixStyle({
      width: initWidth,
      background: theme.altHigh,
      ...style
    }) as React.CSSProperties,
    wrapper: prefixStyle({
      width: initWidth,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: isFloatRight ? "flex-end" : "flex-start",
      ...style
    }),
    button: {
      background: theme.accent,
      color: "#fff"
    } as React.CSSProperties
  };
};

FloatNav.contextTypes = {
  theme: PropTypes.object
};

export default FloatNav;
