import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { codes } from 'keycode';
import AddBlurEvent from './utils/AddBlurEvent';
import SplitViewPane, { SplitViewPaneProps } from './SplitView.SplitViewPane';
export { SplitViewPane, SplitViewPaneProps };

export interface DataProps {
  displayMode?: "compact" | "overlay";
  expandedWidth?: number;
  defaultExpanded?: boolean;
  panePosition?: "left" | "right";
  paneStyle?: React.CSSProperties;
  onClosePane?: () => void;
  clickExcludeElms?: HTMLDivElement[];
}
export interface SplitViewProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

const SplitView: React.FC<SplitViewProps> = ({
  expandedWidth = 320,
  displayMode = "compact",
  panePosition = "right",
  onClosePane = () => {},
  defaultExpanded,
  paneStyle,
  children,
  className,
  clickExcludeElms,
  style,
  ...attributes
}, context: { theme: ReactUWP.ThemeType }) => {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const addBlurEvent = useRef(new AddBlurEvent());
  const rootElm = useRef<HTMLDivElement>(null);
  const { theme } = context;

  // 同步defaultExpanded props到state
  useEffect(() => {
    if (defaultExpanded !== undefined && defaultExpanded !== expanded) {
      setExpanded(defaultExpanded);
    }
  }, [defaultExpanded, expanded]);

  // blur事件处理
  useEffect(() => {
    const excludeElms = clickExcludeElms ? [...clickExcludeElms, rootElm.current!] : rootElm.current;
    addBlurEvent.current.setConfig({
      addListener: expanded,
      clickExcludeElm: excludeElms,
      blurCallback: () => {
        setExpanded(false);
        onClosePane();
      },
      blurKeyCodes: [codes.esc]
    });

    return () => {
      addBlurEvent.current.cleanEvent();
    };
  }, [expanded, clickExcludeElms, onClosePane]);

  const inlineStyles = getStyles(theme, {
    style,
    expandedWidth,
    displayMode,
    panePosition,
    paneStyle,
    expanded
  });
  const styles = theme.prepareStyles({
    className: "split-view",
    styles: inlineStyles
  });

  const splitViewPanes: React.ReactElement[] = [];
  const childView: React.ReactNode[] = [];

  React.Children.forEach(children, (child: any, index) => {
    if (child.type === SplitViewPane) {
      splitViewPanes.push(React.cloneElement(child, {
        style: { ...styles.pane.style, ...child.props.style },
        className: styles.pane.className,
        key: index.toString()
      }));
    } else {
      childView.push(child);
    }
  });

  return (
    <div
      {...attributes}
      style={styles.root.style}
      ref={rootElm}
      className={theme.classNames(styles.root.className, className)}
    >
      {childView}
      {splitViewPanes}
    </div>
  );
};

// ------------------------------
// Style generation function (bottom of file)
// ------------------------------
const getStyles = (theme: ReactUWP.ThemeType, props: {
  style?: React.CSSProperties;
  expandedWidth: number;
  displayMode: "compact" | "overlay";
  panePosition: "left" | "right";
  paneStyle?: React.CSSProperties;
  expanded?: boolean;
}) => {
  const { style, expandedWidth, displayMode, panePosition, paneStyle, expanded } = props;
  const { prefixStyle } = theme;
  const isCompact = displayMode === "compact";
  const isOverlay = displayMode === "overlay";
  const panePositionIsRight = panePosition === "right";
  const transition = "all .25s ease-in-out";

  return {
    root: prefixStyle({
      color: theme.baseHigh,
      ...theme.acrylicTexture60.style,
      display: "inline-block",
      position: "relative",
      margin: 0,
      padding: 0,
      transition,
      ...(isCompact ? {
        flex: "0 0 auto",
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
        width: "auto",
        height: "auto"
      } as React.CSSProperties : {}),
      ...(isOverlay ? {
        width: "100%"
      } as React.CSSProperties : {}),
      ...style,
      overflow: "hidden"
    }),
    pane: prefixStyle({
      ...theme.acrylicTexture40.style,
      transition,
      boxShadow: theme.useFluentDesign ? `rgba(0, 0, 0, 0.34) 0px 4px 24px` : undefined,
      ...(isCompact ? {
        height: "100%",
        width: expandedWidth,
        transform: `translate3d(${expanded ? 0 : expandedWidth}px, 0, 0)`
      } as React.CSSProperties : {}),
      ...(isOverlay ? {
        position: "absolute",
        top: 0,
        right: panePositionIsRight ? 0 : undefined,
        left: panePositionIsRight ? undefined : 0,
        height: "100%",
        width: expandedWidth,
        transform: `translate3d(${expanded ? 0 : expandedWidth}px, 0, 0)`
      } as React.CSSProperties : {}),
      ...paneStyle
    })
  };
};

SplitView.contextTypes = {
  theme: PropTypes.object
};

export default SplitView;
