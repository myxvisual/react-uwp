import * as React from "react";
import * as PropTypes from "prop-types";

import shallowEqual from "../common/shallowEqual";

import SlideInOut from "../Animate/SlideInOut";
import IconButton from "../IconButton";
import SplitViewCommand from "../SplitViewCommand";

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
  navigationTopNodes?: Array<NavigationNode | NavigationComplexNode>;
  navigationBottomNodes?: Array<NavigationNode | NavigationComplexNode>;
  displayMode?: "overlay" | "compact" | "inline";
  pageTitle?: string;
  position?: "left" | "right";
  paneStyle?: React.CSSProperties;
  contentStyle?: React.CSSProperties;
  isTenFt?: boolean;
  autoResize?: boolean;
  focusNavigationNodeIndex?: number;
}

export interface NavigationViewProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export interface NavigationViewState {
  expanded?: boolean;
  focusNodeIndex?: number;
  currDisplayMode?: "overlay" | "compact" | "inline";
  currInitWidth?: number;
}

export class NavigationView extends React.Component<NavigationViewProps, NavigationViewState> {
  static defaultProps: NavigationViewProps = {
    position: "left",
    isTenFt: false,
    autoResize: true,
    initWidth: 48,
    expandedWidth: 320,
    navigationTopNodes: 0 ? [] : [
      <SplitViewCommand icon={"\uE716"} />,
      <SplitViewCommand label="Print" icon={"\uE2F6"} />
    ],
    navigationBottomNodes: 0 ? [] : [
      <SplitViewCommand label="Settings" icon={"\uE713"} />,
      <SplitViewCommand label="CalendarDay" icon={"\uE161"} />
    ],
    // background: "none",
    displayMode: "compact"
  };

  state: NavigationViewState = {
    expanded: false,
    focusNodeIndex: this.props.focusNavigationNodeIndex,
    currDisplayMode: this.props.displayMode,
    currInitWidth: this.props.initWidth
  };

  SplitViewCommands: SplitViewCommand[] = [];

  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  componentDidMount() {
    if (this.props.autoResize) {
      this.autoResize();
      window.addEventListener("resize", this.autoResize);
    }
  }

  componentWillMount() {
    this.updateProps2State(this.props);
  }

  shouldComponentUpdate(nextProps: NavigationViewProps, nextState: NavigationViewState, nextContext: { theme: ReactUWP.ThemeType }) {
    return !shallowEqual(nextProps, this.props) || !shallowEqual(nextState, this.state) || !shallowEqual(!nextContext, this.context);
  }

  componentWillUnmount() {
    if (this.props.autoResize) {
      window.removeEventListener("resize", this.autoResize);
    }
  }

  autoResize = (e?: Event) => {
    if (window.innerWidth < 1280) {
      if (this.state.currDisplayMode !== "compact") {
        this.setState({
          currDisplayMode: "compact",
          currInitWidth: 0
        });
      }
    } else {
      if (this.state.currDisplayMode === "compact") {
        this.setState({
          currDisplayMode: "inline",
          currInitWidth: 48
        });
      }
    }
  }

  updateProps2State = ({ defaultExpanded }: NavigationViewProps) => {
    if (defaultExpanded !== this.state.expanded) {
      this.setState({ expanded: defaultExpanded });
    }
  }

  toggleExpanded = (expanded?: boolean) => {
    if (typeof expanded === "boolean" && expanded !== this.state.expanded) {
      this.setState({ expanded });
    } else {
      this.setState((prevState, prevProps) => ({  expanded: !prevState.expanded }));
    }
  }

  getNewNodeProps = (currNode: any, index: number, expanded?: boolean, haveExpandedNode?: boolean) => {
    const { onClick } = currNode.props;
    const { focusNodeIndex } = this.state;
    return {
      key: `${index} ${expanded}`,
      visited: focusNodeIndex === void(0) ? void(0) : focusNodeIndex === index,
      onClick: (e: any) => {
        this.setState({
          focusNodeIndex: index,
          expanded: haveExpandedNode ? true : this.state.expanded
        });
        if (onClick) onClick(e);
      }
    };
  }

  render() {
    const {
      topIcon,
      initWidth,
      navigationTopNodes,
      navigationBottomNodes,
      expandedWidth,
      children,
      position,
      paneStyle,
      contentStyle,
      defaultExpanded,
      displayMode,
      pageTitle,
      background,
      isTenFt,
      autoResize,
      focusNavigationNodeIndex,
      ...attributes
    } = this.props;
    const { theme } = this.context;
    const { expanded, focusNodeIndex, currDisplayMode } = this.state;
    const styles = getStyles(this);
    let nodeIndex: number = -1;

    return (
      <div
        {...attributes}
        style={{
          ...styles.root,
          ...theme.prepareStyles(attributes.style)
        }}
      >
        <div style={styles.paneParent}>
          <div style={styles.pane}>
            <div style={styles.paneTop}>
              <div style={styles.topIcon}>
                {React.cloneElement(topIcon || (
                  <IconButton
                    style={styles.iconButton}
                    hoverStyle={{ background: theme.baseLow }}
                    activeStyle={{ background: theme.baseMediumLow }}
                  >
                    {"\uE700"}
                  </IconButton>
                ), {
                  onClick: (e: any) => {
                    this.toggleExpanded();
                    if (topIcon && topIcon.props.onClick) topIcon.props.onclick(e);
                  }
                })}
                <p style={styles.pageTitle}>
                  {pageTitle}
                </p>
              </div>
              <div style={styles.paneTopIcons}>
                {navigationTopNodes && navigationTopNodes.map((node: any, index) => {
                  let currNode = node as any;
                  const haveExpandedNode = "expanded" in node;
                  if (node.default) currNode = node.default;
                  if (haveExpandedNode && expanded) currNode = node.expanded;
                  ++nodeIndex;
                  return (
                    <SlideInOut
                      appearAnimate={false}
                      mode="in"
                      direction={position === "left" ? "right" : "left"}
                      key={`${index}`}
                      style={{ height: 48 }}
                    >
                      {React.cloneElement(currNode, this.getNewNodeProps(currNode, nodeIndex, Boolean(expanded && haveExpandedNode), haveExpandedNode))}
                    </SlideInOut>
                  );
                })}
              </div>
            </div>
            <div style={styles.paneBottomIcons}>
              {navigationBottomNodes && navigationBottomNodes.map((node: any, index) => {
                let currNode = node as any;
                const haveExpandedNode = "expanded" in node;
                if (node.default) currNode = node.default;
                if (haveExpandedNode && expanded) currNode = node.expanded;
                ++nodeIndex;
                return (
                  <SlideInOut
                    appearAnimate={false}
                    mode="in"
                    direction={position === "left" ? "right" : "left"}
                    key={`${index}`}
                    style={{ height: 48 }}
                  >
                    {React.cloneElement(currNode, this.getNewNodeProps(currNode, nodeIndex, Boolean(expanded && haveExpandedNode), haveExpandedNode))}
                  </SlideInOut>
                );
              })}
            </div>
          </div>
        </div>
        <div style={styles.contentView}>{children}</div>
      </div>
    );
  }
}

function getStyles(NavigationView: NavigationView): {
  root?: React.CSSProperties;
  pageTitle?: React.CSSProperties;
  paneParent?: React.CSSProperties;
  contentView?: React.CSSProperties;
  topIcon?: React.CSSProperties;
  pane?: React.CSSProperties;
  paneTop?: React.CSSProperties;
  paneTopIcons?: React.CSSProperties;
  paneBottomIcons?: React.CSSProperties;
  iconButton?: React.CSSProperties;
} {
  const {
    context,
    props: { expandedWidth, paneStyle, contentStyle, background, navigationTopNodes, navigationBottomNodes },
    state: { currInitWidth, expanded, currDisplayMode }
  } = NavigationView;
  const isOverLay = currDisplayMode === "overlay";
  const isInline = currDisplayMode === "inline";
  const isCompact = currDisplayMode === "compact";
  const { theme } = context;
  const { prepareStyles } = theme;
  let minHeight = isInline ? 0 : 48;
  if (navigationTopNodes) minHeight += 48 * navigationTopNodes.length;
  if (navigationBottomNodes) minHeight += 48 * navigationBottomNodes.length;
  const currBackground = background || theme.altHigh;
  const transition = "width .25s ease-in-out";

  return {
    root: prepareStyles({
      display: isCompact ? "flex" : "inline-block",
      fontSize: 16,
      color: theme.baseMediumHigh,
      position: "relative"
    }),
    topIcon: prepareStyles({
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start",
      width: isInline ? "100%" : expandedWidth,
      background: currBackground,
      flex: "0 0 auto",
      zIndex: 1
    }),
    pageTitle: prepareStyles({
      opacity: (expanded || isInline) ? 1 : 0,
      width: isInline ? expandedWidth : "100%",
      wordWrap: "normal",
      whiteSpace: "nowrap",
      overflow: isInline ? void 0 : "hidden",
      textOverflow: "ellipsis"
    }),
    paneParent: prepareStyles({
      display: "inline-block",
      verticalAlign: "top",
      width: isInline ? "100%" : (isOverLay ? currInitWidth : (expanded ? expandedWidth : currInitWidth)),
      height: isInline ? currInitWidth : "100%",
      zIndex: isOverLay || isInline ? 1 : void 0,
      background: isInline ? theme.altHigh : void 0,
      transition
    }),
    pane: prepareStyles({
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      justifyContent: "space-between",
      background: currBackground,
      overflow: isInline ? void 0 : "hidden",
      width: expanded ? expandedWidth : (isInline ? 0 : 48),
      ...(isInline ? {
        position: "absolute",
        top: 0,
        left: 0,
        background: theme.altHigh
      } : void 0),
      height: "100%",
      transition,
      ...prepareStyles(paneStyle)
    }),
    paneTop: prepareStyles({
      display: "flex",
      flexDirection: "column",
      width: "100%",
      flex: "0 0 auto"
    }),
    paneTopIcons: prepareStyles({
      background: currBackground,
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      width: (isInline && !expanded) ? 0 : expandedWidth,
      flex: "0 0 auto",
      zIndex: 1
    }),
    paneBottomIcons: prepareStyles({
      background: currBackground,
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      width: (isInline && !expanded) ? 0 : expandedWidth,
      flex: "0 0 auto",
      zIndex: 1
    }),
    contentView: prepareStyles({
      display: "inline-block",
      background: theme.altHigh,
      minHeight,
      left: isOverLay ? 0 : void 0,
      top: isOverLay ? 0 : void 0,
      ...contentStyle
    }),
    iconButton: {
      cursor: "pointer",
      fontSize: 16,
      width: 48,
      height: 48,
      background: "none"
    }
  };
}

export default NavigationView;
