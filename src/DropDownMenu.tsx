import { useTheme } from './hooks/useTheme';
import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { codes } from 'keycode';
import AddBlurEvent from './utils/AddBlurEvent';
import Icon from './Icon';
import RevealEffect, { RevealEffectProps } from './RevealEffect';

export interface DataProps {
  values?: string[];
  onChangeValue?: (value: string) => void;
  wrapperStyle?: React.CSSProperties;
  enableFullWidth?: boolean;
  itemStyle?: React.CSSProperties;
  itemSelectedStyle?: React.CSSProperties;
  itemHoverStyle?: React.CSSProperties;
  revealConfig?: RevealEffectProps;
  iconNode?: React.ReactNode;
  defaultValue?: string | string[];
}
export interface DropDownMenuProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

const defaultStyle: React.CSSProperties = {
  display: "inline-block",
  width: 296,
  height: 32
};

const DropDownMenu: React.FC<DropDownMenuProps> = ({
  iconNode = <Icon style={{ marginLeft: 8 }}>ChevronDown4Legacy</Icon>,
  values = [],
  defaultValue,
  onChangeValue,
  style,
  wrapperStyle,
  revealConfig,
  enableFullWidth,
  itemStyle,
  itemHoverStyle,
  itemSelectedStyle,
  className,
  ...attributes
}) => {
  const theme = useTheme();
  const [showList, setShowList] = useState(false);
  const [currValue, setCurrValue] = useState<string | string[] | undefined>(defaultValue || (values.length > 0 ? values[0] : undefined));
  const [currValues, setCurrValues] = useState<string[]>(values);
  const addBlurEvent = useRef(new AddBlurEvent()).current;
  const rootElm = useRef<HTMLDivElement>(null);
  const itemHeight = useRef<string | number>("32px");

  // 同步values变化
  useEffect(() => {
    setCurrValues(values);
  }, [values]);

  // 点击外部关闭和高度更新
  useEffect(() => {
    addBlurEvent.setConfig({
      addListener: showList,
      clickExcludeElm: rootElm.current!,
      blurCallback: () => setShowList(false),
      blurKeyCodes: [codes.esc]
    });
    updateItemHeight(!showList);
    return () => addBlurEvent.cleanEvent();
  }, [showList]);

  const updateItemHeight = (needUpdate = true) => {
    if (rootElm.current && needUpdate) {
      itemHeight.current = window.getComputedStyle(rootElm.current).height;
    }
  };

  const toggleShowList = (value: string) => {
    if (value !== currValue) {
      onChangeValue?.(value);
    }
    setCurrValue(value);
    setShowList(prev => !prev);
  };

  // 暴露实例方法
  const getValue = () => currValue;
  DropDownMenu.getValue = getValue;

  const newWrapperStyle = Object.assign({}, defaultStyle, style);
  const defaultItemSelectedStyle: React.CSSProperties = { background: theme.listAccentLow };
  const styles = getStyles(theme, {
    style,
    wrapperStyle,
    enableFullWidth,
    itemHoverStyle,
    itemStyle,
    showList,
    itemHeight: itemHeight.current
  });
  const classes = theme.prepareStyles({ className: "dropDownMenu", styles });

  return (
    <span style={classes.wrapper.style} className={classes.wrapper.className}>
      <div
        {...attributes}
        style={classes.root.style}
        className={theme.classNames(classes.root.className, className)}
        ref={rootElm}
      >
        {currValues.map((value, index) => {
          const isCurrent = currValue === value;
          return (
            <div
              className={isCurrent && showList ? classes.selectedItem.className : classes.item.className}
              style={{
                ...classes.item.style,
                ...(isCurrent && showList ? (itemSelectedStyle || defaultItemSelectedStyle) : undefined),
                height: showList ? (newWrapperStyle.height || itemHeight.current) : (isCurrent ? "100%" : 0),
                padding: showList || isCurrent ? styles.item.padding : 0
              } as React.CSSProperties}
              onClick={() => toggleShowList(value)}
              key={index}
            >
              <p style={classes.valueContent.style} className={classes.valueContent.className}>
                {value}
              </p>
              {!showList && isCurrent && iconNode}
              {showList && <RevealEffect {...revealConfig} effectRange={showList ? "self" : "all"} />}
            </div>
          );
        })}
      </div>
    </span>
  );
};

// ------------------------------
// Style generation function (bottom of file)
// ------------------------------
const getStyles = (theme: ReactUWP.ThemeType, props: {
  style?: React.CSSProperties;
  wrapperStyle?: React.CSSProperties;
  enableFullWidth?: boolean;
  itemHoverStyle?: React.CSSProperties;
  itemStyle?: React.CSSProperties;
  showList: boolean;
  itemHeight: string | number;
}) => {
  const { style, wrapperStyle, enableFullWidth, itemHoverStyle, itemStyle, showList, itemHeight } = props;
  const { prefixStyle } = theme;
  const newWrapperStyle = Object.assign({}, defaultStyle, style);
  const zIndex = style?.zIndex ? style.zIndex : (showList ? theme.zIndex.dropDownMenu : undefined);
  const defaultItemHoverStyle: React.CSSProperties = { background: theme.baseLow };

  const newItemStyle = {
    border: `${theme.borderWidth}px solid transparent`,
    position: "relative",
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    background: "none",
    padding: "0 8px",
    ...itemStyle,
    height: showList ? (newWrapperStyle.height || itemHeight) : 0,
    borderLeft: showList ? `0px solid transparent` : "none",
    borderRight: showList ? `0px solid transparent` : "none",
    borderTop: showList ? `${theme.borderWidth}px solid transparent` : "none",
    borderBottom: showList ? `${theme.borderWidth}px solid transparent` : "none"
  } as React.CSSProperties;

  return {
    wrapper: prefixStyle({
      flex: "0 0 auto",
      display: "block",
      width: enableFullWidth ? "100%" : newWrapperStyle.width,
      height: newWrapperStyle.height,
      ...wrapperStyle
    }),
    root: prefixStyle({
      position: "relative",
      verticalAlign: "middle",
      border: `${theme.borderWidth}px solid ${theme.baseLow}`,
      overflowX: "hidden",
      padding: showList ? "6px 0" : 0,
      transition: "all .25s 0s ease-in-out",
      ...theme.acrylicTexture60.style,
      ...newWrapperStyle,
      zIndex,
      width: enableFullWidth ? (style?.width ? newWrapperStyle.width : "100%") : newWrapperStyle.width,
      height: showList ? "auto" : newWrapperStyle.height
    }) as React.CSSProperties,
    item: prefixStyle({
      ...newItemStyle,
      "&:hover": itemHoverStyle || defaultItemHoverStyle
    }),
    selectedItem: prefixStyle(newItemStyle),
    valueContent: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      textAlign: "left",
      cursor: "default",
      height: "100%",
      width: "100%",
      overflow: "hidden",
      wordWrap: "normal",
      whiteSpace: "nowrap",
      textOverflow: "ellipsis"
    } as React.CSSProperties
  };
};


export default DropDownMenu;
