import * as React from "react";
import * as PropTypes from "prop-types";
import { codes } from "keycode";

import AddBlurEvent from "../common/AddBlurEvent";
import shallowEqual from "../common/shallowEqual";
import SlideInOut from "../Animate/SlideInOut";
import IconButton from "../IconButton";
import SplitViewCommand from "../SplitViewCommand";

export { SplitViewCommand };

export interface NavigationComplexNode {
  default?: React.ReactNode;
  expanded?: React.ReactNode;
}

export type NavigationNode = SplitViewCommand | React.ReactNode;

export interface DataProps {
  /**
   * Set Navigation background.
   */
  background?: string;
  /**
   * Set Navigation width.
   */
  initWidth?: number;
  /**
   * Set Navigation expanded width.
   */
  expandedWidth?: number;
  /**
   * Control Navigation expanded.
   */
  defaultExpanded?: boolean;
  /**
   * Replace TopIcon, default is NavButton.
   */
  topIcon?: React.ReactElement<any>;
  /**
   * Set NavigationView to controlled component.
   */
  isControlled?: boolean;
  /**
   * Normal usage `SplitViewCommand[]`, different status use `{ default?: React.ReactNode, expanded?: React.ReactNode }`.
   */
  navigationTopNodes?: Array<NavigationNode | NavigationComplexNode>;
  /**
   * Normal usage `SplitViewCommand[]`, different status use `{ default?: React.ReactNode, expanded?: React.ReactNode }`.
   */
  navigationBottomNodes?: Array<NavigationNode | NavigationComplexNode>;
  /**
   * Three display control Navigation show mode.
   */
  displayMode?: "overlay" | "compact" | "minimal";
  /**
   * The page title.
   */
  pageTitle?: string;
  /**
   * The pane view style.
   */
  paneStyle?: React.CSSProperties;
  /**
   * Usage TenFt Mode.
   */
  isTenFt?: boolean;
  /**
   * Auto change mode by window `onResize`.
   */
  autoResize?: boolean;
  /**
   * Default focus `SplitViewCommand` item by `index`.
   */
  focusNavigationNodeIndex?: number;
}

export interface NavigationViewProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export interface NavigationViewState {
  expanded?: boolean;
  focusNodeIndex?: number;
  currDisplayMode?: "overlay" | "compact" | "minimal";
  currInitWidth?: number;
}

export class NavigationView extends React.Component<NavigationViewProps, NavigationViewState> {
  static defaultProps: NavigationViewProps = {
    isTenFt: false,
    autoResize: true,
    initWidth: 48,
    expandedWidth: 320,
    displayMode: "compact"
  };

  state: NavigationViewState = {
    expanded: false,
    focusNodeIndex: this.props.focusNavigationNodeIndex,
    currDisplayMode: this.props.displayMode,
    currInitWidth: this.props.initWidth
  };

  addBlurEvent = new AddBlurEvent();
  paneElm: HTMLDivElement;

  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  componentWillMount() {
    this.updateProps2State(this.props);
  }

  addBlurEventMethod = () => {
    this.addBlurEvent.setConfig({
      addListener: this.state.expanded,
      clickExcludeElm: this.paneElm,
      blurCallback: () => {
        this.setState({
          expanded: false
        });
      },
      blurKeyCodes: [codes.esc]
    });
  }

  componentDidMount() {
    if (this.props.autoResize) {
      this.autoResize();
      window.addEventListener("resize", this.autoResize);
    }
    if (!this.props.isControlled) this.addBlurEventMethod();
  }

  componentDidUpdate() {
    if (!this.props.isControlled) this.addBlurEventMethod();
  }

  shouldComponentUpdate(nextProps: NavigationViewProps, nextState: NavigationViewState, nextContext: { theme: ReactUWP.ThemeType }) {
    return !shallowEqual(nextProps, this.props) || !shallowEqual(nextState, this.state) || !shallowEqual(!nextContext, this.context);
  }

  componentWillUnmount() {
    if (this.props.autoResize) {
      window.removeEventListener("resize", this.autoResize);
    }
    this.addBlurEvent.cleanEvent();
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
          currDisplayMode: "minimal",
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
      visited: focusNodeIndex === void 0 ? void 0 : focusNodeIndex === index,
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
      style,
      topIcon,
      initWidth,
      navigationTopNodes,
      navigationBottomNodes,
      expandedWidth,
      children,
      paneStyle,
      defaultExpanded,
      displayMode,
      pageTitle,
      background,
      isTenFt,
      autoResize,
      isControlled,
      focusNavigationNodeIndex,
      className,
      ...attributes
    } = this.props;
    const { theme } = this.context;
    const { expanded, focusNodeIndex, currDisplayMode } = this.state;
    const inlineStyles = getStyles(this);
    const styles = theme.prepareStyles({
      className: "navigation-view",
      styles: inlineStyles
    });
    let nodeIndex: number = -1;
    const isCompact = currDisplayMode === "compact";

    const renderContent =  (
      <div
        {...(isCompact ? void 0 : attributes)}
        style={styles.root.style}
        className={theme.classNames(styles.root.className, className)}
      >
        <div {...styles.paneParent} ref={paneElm => this.paneElm = paneElm}>
          <div {...styles.pane}>
            <div {...styles.paneTop}>
              <div {...styles.topIcon}>
                {React.cloneElement(topIcon || (
                  <IconButton
                    style={inlineStyles.iconButton}
                    hoverStyle={{ background: theme.baseLow }}
                    activeStyle={{ background: theme.baseMediumLow }}
                  >
                    GlobalNavButton
                  </IconButton>
                ), isControlled ? void 0 : {
                  onClick: (e: any) => {
                    this.toggleExpanded();
                    if (topIcon && topIcon.props.onClick) topIcon.props.onclick(e);
                  }
                })}
                <p {...styles.pageTitle}>
                  {pageTitle}
                </p>
              </div>
              <div {...styles.paneTopIcons}>
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
                      direction="right"
                      key={`${index}`}
                      style={{ height: 48 }}
                    >
                      {React.cloneElement(currNode, this.getNewNodeProps(currNode, nodeIndex, Boolean(expanded && haveExpandedNode), haveExpandedNode))}
                    </SlideInOut>
                  );
                })}
              </div>
            </div>
            <div {...styles.paneBottomIcons}>
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
                    direction="right"
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
        {isCompact ? (
          <div
            style={{
              width: "100%",
              height: "100%",
              overflow: "hidden"
            }}
          >
            {children}
          </div>
        ) : children}
      </div>
    );

    return renderContent;
  }
}

function getStyles(NavigationView: NavigationView): {
  root?: React.CSSProperties;
  pageTitle?: React.CSSProperties;
  paneParent?: React.CSSProperties;
  topIcon?: React.CSSProperties;
  pane?: React.CSSProperties;
  paneTop?: React.CSSProperties;
  paneTopIcons?: React.CSSProperties;
  paneBottomIcons?: React.CSSProperties;
  iconButton?: React.CSSProperties;
} {
  const {
    context,
    props: { expandedWidth, style, paneStyle, background, navigationTopNodes, navigationBottomNodes },
    state: { currInitWidth, expanded, currDisplayMode }
  } = NavigationView;
  const isOverLay = currDisplayMode === "overlay";
  const isMinimal = currDisplayMode === "minimal";
  const isCompact = currDisplayMode === "compact";
  const { theme } = context;
  const { prefixStyle } = theme;
  let minHeight = isMinimal ? 0 : 48;
  if (navigationTopNodes) minHeight += 48 * navigationTopNodes.length;
  if (navigationBottomNodes) minHeight += 48 * navigationBottomNodes.length;
  const currBackground = background || (theme.useFluentDesign ? theme.acrylicTexture40.background : theme.altHigh);
  const transition = "width .25s ease-in-out";

  return {
    root: prefixStyle({
      display: isCompact ? "flex" : "inline-block",
      fontSize: 16,
      color: theme.baseHigh,
      height: isCompact ? "100%" : void 0,
      position: "relative",
      ...style
    }),
    topIcon: prefixStyle({
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start",
      width: isMinimal ? "100%" : expandedWidth,
      background: currBackground,
      flex: "0 0 auto",
      zIndex: 1
    }),
    pageTitle: prefixStyle({
      paddingLeft: 2,
      opacity: (expanded || isMinimal) ? 1 : 0,
      width: isMinimal ? expandedWidth : "100%",
      wordWrap: "normal",
      whiteSpace: "nowrap",
      overflow: isMinimal ? void 0 : "hidden",
      textOverflow: "ellipsis"
    }),
    paneParent: prefixStyle({
      display: "inline-block",
      verticalAlign: "top",
      width: isMinimal ? "100%" : (isOverLay ? currInitWidth : (expanded ? expandedWidth : currInitWidth)),
      flex: "0 0 auto",
      height: isMinimal ? currInitWidth : "100%",
      zIndex: isOverLay || isMinimal ? 1 : void 0,
      position: isOverLay ? "absolute" : void 0,
      top: isOverLay ? 0 : void 0,
      background: isMinimal ? currBackground : void 0,
      transition
    }),
    pane: prefixStyle({
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      justifyContent: "space-between",
      background: currBackground,
      overflow: isMinimal ? void 0 : "hidden",
      width: expanded ? expandedWidth : (isMinimal ? 0 : currInitWidth),
      ...(isMinimal ? {
        position: "absolute",
        top: 0,
        left: 0,
        background: currBackground
      } as React.CSSProperties : void 0),
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
    }
  };
}

export default NavigationView;
