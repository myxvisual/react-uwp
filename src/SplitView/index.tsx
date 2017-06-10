import * as React from "react";
import * as PropTypes from "prop-types";

import SplitViewPane, { SplitViewPaneProps } from "./SplitViewPane";

export { SplitViewPane, SplitViewPaneProps };

export interface DataProps {
  displayMode?: "compact" | "overlay";
  expandedWidth?: number;
  defaultExpanded?: boolean;
  panePosition?: "left" | "right";
  paneStyle?: React.CSSProperties;
}

export interface SplitViewProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}


export class SplitView extends React.Component<SplitViewProps, void> {
  static defaultProps: SplitViewProps = {
    expandedWidth: 320,
    displayMode: "compact",
    panePosition: "right"
  };

  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  render() {
    const {
      displayMode,
      expandedWidth,
      defaultExpanded,
      panePosition,
      children,
      paneStyle,
      ...attributes
    } = this.props;
    const { theme } = this.context;
    const styles = getStyles(this);
    const splitViewPanes: any[] = [];
    const childView: any[] = [];

    if (children) {
      React.Children.forEach(children, (child: any, index) => {
        if (child.type === SplitViewPane) {
          splitViewPanes.push(React.cloneElement(child, {
            style: { ...styles.pane, ...child.props.style },
            key: index.toString()
          }));
        } else {
          childView.push(child);
        }
      });
    }

    return (
      <div
        {...attributes}
        style={{
          ...styles.root,
          ...theme.prepareStyles(attributes.style)
        }}
      >
        {childView.length > 0 && childView}
        {splitViewPanes.length > 0 && splitViewPanes}
      </div>
    );
  }
}

function getStyles(splitView: SplitView): {
  root?: React.CSSProperties;
  pane?: React.CSSProperties;
} {
  const {
    context,
    props: {
      style,
      defaultExpanded,
      expandedWidth,
      displayMode,
      panePosition,
      paneStyle
    }
  } = splitView;
  const { theme } = context;
  const { prepareStyles } = theme;
  const isCompact = displayMode === "compact";
  const isOverlay = displayMode === "overlay";
  const panePositionIsRight = panePosition === "right";
  const transition = "all .25s ease-in-out";

  return {
    root: prepareStyles({
      color: theme.baseHigh,
      background: theme.useFluentDesign ? theme.acrylicTextures.acrylicTexture60.background : theme.chromeLow,
      display: "inline-block",
      position: "relative",
      margin: 0,
      padding: 0,
      transition,
      ...style,
      ...(isCompact ? {
        flex: "0 0 auto",
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
        width: "auto",
        height: "auto"
      } as React.CSSProperties : void 0),
      ...(isOverlay ? {
        width: "100%"
      } as React.CSSProperties : void 0),
      overflow: "hidden"
    }),
    pane: prepareStyles({
      background: theme.useFluentDesign ? theme.acrylicTextures.acrylicTexture40.background : theme.altHigh,
      transition,
      boxShadow: theme.useFluentDesign ? `rgba(0, 0, 0, 0.34) 0px 4px 24px` : void 0,
      ...(isCompact ? {
        height: "100%",
        width: expandedWidth,
        transform: `translate3d(${defaultExpanded ? 0 : expandedWidth}px, 0, 0)`
      } as React.CSSProperties : void 0),
      ...(isOverlay ? {
        position: "absolute",
        top: 0,
        right: panePositionIsRight ? 0 : void 0,
        left: panePositionIsRight ? void 0 : 0,
        height: "100%",
        width: expandedWidth,
        transform: `translate3d(${defaultExpanded ? 0 : expandedWidth}px, 0, 0)`
      } as React.CSSProperties : void 0),
      ...paneStyle
    })
  };
}

export default SplitView;
