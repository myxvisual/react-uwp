import React, { useState, useRef, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { codes } from 'keycode';
import AddBlurEvent from './utils/AddBlurEvent';
import shallowEqual from './utils/shallowEqual';
import SlideInOut from './Animate.SlideInOut';
import IconButton from './IconButton';
import SplitViewCommand from './SplitViewCommand';

export { SplitViewCommand };

export interface NavigationComplexNode {
  default?: React.ReactNode;
  expanded?: React.ReactNode;
}
export type NavigationNode = SplitViewCommand | React.ReactNode;
export interface DataProps {
  background?: string;
  initWidth?: number;
  expandedWidth?: number;
  defaultExpanded?: boolean;
  topIcon?: React.ReactElement<any>;
  isControlled?: boolean;
  navigationTopNodes?: Array<NavigationNode | NavigationComplexNode>;
  navigationBottomNodes?: Array<NavigationNode | NavigationComplexNode>;
  displayMode?: "overlay" | "compact" | "minimal";
  pageTitle?: string;
  paneStyle?: React.CSSProperties;
  isTenFt?: boolean;
  autoResize?: boolean;
  focusNavigationNodeIndex?: number;
}
export interface NavigationViewProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

const NavigationView: React.FC<NavigationViewProps> = ({
  isTenFt = false,
  autoResize = true,
  initWidth = 48,
  expandedWidth = 320,
  displayMode = "compact",
  style,
  topIcon,
  navigationTopNodes,
  navigationBottomNodes,
  children,
  paneStyle,
  defaultExpanded,
  pageTitle,
  background,
  isControlled,
  focusNavigationNodeIndex,
  className,
  ...attributes
}, context: { theme: ReactUWP.ThemeType }) => {
  const [expanded, setExpanded] = useState(defaultExpanded ?? false);
  const [focusNodeIndex, setFocusNodeIndex] = useState<number | undefined>(focusNavigationNodeIndex);
  const [currDisplayMode, setCurrDisplayMode] = useState<"overlay" | "compact" | "minimal">(displayMode);
  const [currInitWidth, setCurrInitWidth] = useState(initWidth);

  const addBlurEvent = useRef(new AddBlurEvent());
  const paneElm = useRef<HTMLDivElement>(null);
  const { theme } = context;

  // 同步props到state
  useEffect(() => {
    setExpanded(defaultExpanded ?? false);
  }, [defaultExpanded]);
  useEffect(() => {
    setCurrDisplayMode(displayMode);
  }, [displayMode]);
  useEffect(() => {
    setCurrInitWidth(initWidth);
  }, [initWidth]);
  useEffect(() => {
    setFocusNodeIndex(focusNavigationNodeIndex);
  }, [focusNavigationNodeIndex]);

  // 自动调整大小逻辑
  const autoResize = useCallback(() => {
    if (window.innerWidth < 1280) {
      if (currDisplayMode !== "compact") {
        setCurrDisplayMode("compact");
        setCurrInitWidth(0);
      }
    } else {
      if (currDisplayMode === "compact") {
        setCurrDisplayMode("minimal");
        setCurrInitWidth(48);
      }
    }
  }, [currDisplayMode]);

  // 挂载/卸载时的事件监听
  useEffect(() => {
    if (autoResize) {
      autoResize();
      window.addEventListener("resize", autoResize);
    }
    return () => {
      if (autoResize) {
        window.removeEventListener("resize", autoResize);
      }
      addBlurEvent.current.cleanEvent();
    };
  }, [autoResize]);

  // blur事件处理
  useEffect(() => {
    if (!isControlled) {
      addBlurEvent.current.setConfig({
        addListener: expanded,
        clickExcludeElm: paneElm.current,
        blurCallback: () => {
          setExpanded(false);
        },
        blurKeyCodes: [codes.esc]
      });
    }
  }, [expanded, isControlled]);

  const toggleExpanded = (value?: boolean) => {
    setExpanded(prev => value ?? !prev);
  };

  const getNewNodeProps = (currNode: any, index: number, haveExpandedNode?: boolean) => {
    const { onClick } = currNode.props;
    const isSplitViewCommand = currNode && currNode.type === SplitViewCommand;

    const props: any = {
      key: `${index} ${expanded}`,
      visited: focusNodeIndex === undefined ? undefined : focusNodeIndex === index,
      onClick: (e: any) => {
        setFocusNodeIndex(index);
        setExpanded(haveExpandedNode ? true : expanded);
        onClick?.(e);
      }
    };
    if (isSplitViewCommand) {
      props.showLabel = expanded;
    }
    return props;
  };

  const styles = getStyles(theme, {
    expandedWidth,
    style,
    paneStyle,
    background,
    navigationTopNodes,
    navigationBottomNodes,
    currInitWidth,
    expanded,
    currDisplayMode
  });
  const classes = theme.prepareStyles({
    className: "navigation-view",
    styles
  });
  const isCompact = currDisplayMode === "compact";
  let nodeIndex = -1;

  return (
    <div
      {...(isCompact ? undefined : attributes)}
      style={classes.root.style}
      className={theme.classNames(classes.root.className, className)}
    >
      <div style={classes.paneParent.style} className={classes.paneParent.className} ref={paneElm}>
        <div style={classes.pane.style} className={classes.pane.className}>
          <div style={classes.paneTop.style} className={classes.paneTop.className}>
            <div style={classes.topIcon.style} className={classes.topIcon.className}>
              {React.cloneElement(topIcon || (
                <IconButton
                  style={classes.iconButton.style}
                  hoverStyle={{ background: theme.baseLow }}
                  activeStyle={{ background: theme.baseMediumLow }}
                >
                  GlobalNavButton
                </IconButton>
              ), isControlled ? undefined : {
                onClick: (e: any) => {
                  toggleExpanded();
                  topIcon?.props.onClick?.(e);
                }
              })}
              <p style={classes.pageTitle.style} className={classes.pageTitle.className}>
                {pageTitle}
              </p>
            </div>
            <div style={classes.paneTopIcons.style} className={classes.paneTopIcons.className}>
              {navigationTopNodes?.map((node: any, index) => {
                let currNode = node;
                const haveExpandedNode = "expanded" in node;
                if (node.default) currNode = node.default;
                if (haveExpandedNode && expanded) currNode = node.expanded;
                nodeIndex++;
                return (
                  <SlideInOut
                    appearAnimate={false}
                    mode="in"
                    direction="right"
                    key={index}
                    style={{ height: 48 }}
                  >
                    {React.cloneElement(currNode, getNewNodeProps(currNode, nodeIndex, haveExpandedNode))}
                  </SlideInOut>
                );
              })}
            </div>
          </div>
          <div style={classes.paneBottomIcons.style} className={classes.paneBottomIcons.className}>
            {navigationBottomNodes?.map((node: any, index) => {
              let currNode = node;
              const haveExpandedNode = "expanded" in node;
              if (node.default) currNode = node.default;
              if (haveExpandedNode && expanded) currNode = node.expanded;
              nodeIndex++;
              return (
                <SlideInOut
                  appearAnimate={false}
                  mode="in"
                  direction="right"
                  key={index}
                  style={{ height: 48 }}
                >
                  {React.cloneElement(currNode, getNewNodeProps(currNode, nodeIndex, haveExpandedNode))}
                </SlideInOut>
              );
            })}
          </div>
        </div>
      </div>
      <div
        style={{
          width: "100%",
          height: "100%",
          overflow: "hidden"
        }}
      >
        {children}
      </div>
    </div>
  );
};

// ------------------------------
// Style generation function (bottom of file)
// ------------------------------
const getStyles = (theme: ReactUWP.ThemeType, props: {
  expandedWidth: number;
  style?: React.CSSProperties;
  paneStyle?: React.CSSProperties;
  background?: string;
  navigationTopNodes?: Array<any>;
  navigationBottomNodes?: Array<any>;
  currInitWidth: number;
  expanded: boolean;
  currDisplayMode: "overlay" | "compact" | "minimal";
}) => {
  const {
    expandedWidth,
    style,
    paneStyle,
    background,
    navigationTopNodes,
    navigationBottomNodes,
    currInitWidth,
    expanded,
    currDisplayMode
  } = props;
  const isOverLay = currDisplayMode === "overlay";
  const isMinimal = currDisplayMode === "minimal";
  const isCompact = currDisplayMode === "compact";
  const { prefixStyle } = theme;
  let minHeight = isMinimal ? 0 : 48;
  if (navigationTopNodes) minHeight += 48 * navigationTopNodes.length;
  if (navigationBottomNodes) minHeight += 48 * navigationBottomNodes.length;
  const transition = "width .25s ease-in-out";

  return {
    root: prefixStyle({
      display: isCompact ? "flex" : "inline-block",
      fontSize: 16,
      color: theme.baseHigh,
      height: isCompact ? "100%" : undefined,
      position: "relative",
      ...style
    }),
    topIcon: prefixStyle({
      ...theme.acrylicTexture40.style,
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start",
      width: isMinimal ? "100%" : expandedWidth,
      flex: "0 0 auto",
      zIndex: 1
    }),
    pageTitle: prefixStyle({
      paddingLeft: 2,
      opacity: (expanded || isMinimal) ? 1 : 0,
      width: isMinimal ? expandedWidth : "100%",
      wordWrap: "normal",
      whiteSpace: "nowrap",
      overflow: isMinimal ? undefined : "hidden",
      textOverflow: "ellipsis"
    }),
    paneParent: prefixStyle({
      ...(isMinimal ? theme.acrylicTexture40.style : {}),
      display: "inline-block",
      verticalAlign: "top",
      width: isMinimal ? "100%" : (isOverLay ? currInitWidth : (expanded ? expandedWidth : currInitWidth)),
      flex: "0 0 auto",
      height: isMinimal ? currInitWidth : "100%",
      zIndex: isOverLay || isMinimal ? 1 : undefined,
      position: isOverLay ? "absolute" : undefined,
      top: isOverLay ? 0 : undefined,
      transition
    }),
    pane: prefixStyle({
      ...theme.acrylicTexture40.style,
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      justifyContent: "space-between",
      overflow: isMinimal ? undefined : "hidden",
      width: expanded ? expandedWidth : (isMinimal ? 0 : currInitWidth),
      ...(isMinimal ? {
        position: "absolute",
        top: 0,
        left: 0,
      } as React.CSSProperties : undefined),
      height: "100%",
      transition,
      ...prefixStyle(paneStyle)
    }),
    paneTop: prefixStyle({
      display: "flex",
      flexDirection: "column",
      width: "100%",
      flex: "0 0 auto"
    }),
    paneTopIcons: prefixStyle({
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      width: (isMinimal && !expanded) ? 0 : expandedWidth,
      flex: "0 0 auto",
      zIndex: 1
    }),
    paneBottomIcons: prefixStyle({
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      width: (isMinimal && !expanded) ? 0 : expandedWidth,
      flex: "0 0 auto",
      zIndex: 1
    }),
    iconButton: {
      cursor: "pointer",
      fontSize: 16,
      width: 48,
      height: 48,
      background: "none"
    } as React.CSSProperties
  };
};

NavigationView.contextTypes = {
  theme: PropTypes.object
};

export default NavigationView;
