import * as React from "react";

import shallowEqual from "../../common/shallowEqual";

import SlideInOut from "../Animate/SlideInOut";
import ThemeType from "../../styles/ThemeType";
import IconButton from "../IconButton";
import SplitViewCommand from "../SplitViewCommand";

const defaultProps: NavPaneProps = __DEV__ ? require("./devDefaultProps").default : {};

export interface TNode {
  default?: any;
  opened?: any;
}
export interface DataProps {
  expandedWidth?: number;
  initWidth?: number;
  defaultOpened?: boolean;
  topIcon?: any;
  topNodes?: Array<TNode>;
  bottomNodes?: Array<TNode>;
  displayMode?: "overlay" | "compact" | "inline";
  pageTitle?: string;
  position?: "left" | "right";
  paneStyle?: React.CSSProperties;
  paneViewStyle?: React.CSSProperties;
  background?: string;
  isTenFt?: boolean;
  autoResize?: boolean;
  focusIndex?: number;
}

export interface NavPaneProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export interface NavPaneState {
  opened?: boolean;
  focusNodeIndex?: number;
  currDisplayMode?: "overlay" | "compact" | "inline";
  currInitWidth?: number;
}

export default class NavPane extends React.Component<NavPaneProps, NavPaneState> {
  static defaultProps: NavPaneProps = {
    ...defaultProps,
    position: "left",
    isTenFt: false,
    autoResize: true,
    expandedWidth: 320,
    initWidth: 48,
    topNodes: __DEV__ ? [] : [
      <SplitViewCommand icon={"\uE716"} />,
      <SplitViewCommand label="Print" icon={"\uE2F6"} />
    ],
    bottomNodes: __DEV__ ? [] : [
      <SplitViewCommand label="Settings" icon={"\uE713"} />,
      <SplitViewCommand label="CalendarDay" icon={"\uE161"} />
    ],
    pageTitle: "PageTitle",
    // background: "none",
    displayMode: "compact",
    children: "Inside Component"
  };

  state: NavPaneState = {
    opened: false,
    focusNodeIndex: this.props.focusIndex,
    currDisplayMode: this.props.displayMode,
    currInitWidth: this.props.initWidth
  };

  SplitViewCommands: SplitViewCommand[] = [];

  static contextTypes = { theme: React.PropTypes.object };
  context: { theme: ThemeType };

  componentDidMount() {
    this.autoResize();
    if (this.props.autoResize) {
      window.addEventListener("resize", this.autoResize);
    }
  }

  componentWillMount() {
    this.updateProps2State(this.props);
  }

  shouldComponentUpdate(nextProps: NavPaneProps, nextState: NavPaneState, nextContext: { theme: ThemeType }) {
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

  updateProps2State = ({ defaultOpened }: NavPaneProps) => {
    if (defaultOpened !== this.state.opened) {
      this.setState({ opened: defaultOpened });
    }
  }

  toggleOpened = (opened?: boolean) => {
    if (typeof opened === "boolean" && opened !== this.state.opened) {
      this.setState({ opened });
    } else {
      this.setState((prevState, prevProps) => ({  opened: !prevState.opened }));
    }
  }

  getNewNodeProps = (currNode: any, index: number, opened?: boolean, haveOpenNode?: boolean) => {
    const { onClick } = currNode.props;
    const { focusNodeIndex } = this.state;
    return {
      key: `${index} ${opened}`,
      visited: focusNodeIndex === void(0) ? void(0) : focusNodeIndex === index,
      onClick: (e: any) => {
        this.setState({
          focusNodeIndex: index,
          opened: haveOpenNode ? true : this.state.opened
        });
        if (onClick) onClick(e);
      }
    };
  }

  render() {
    // tslint:disable-next-line:no-unused-variable
    const { topIcon, initWidth, topNodes, bottomNodes, expandedWidth, children, position, paneStyle, paneViewStyle, defaultOpened, displayMode, pageTitle, background, isTenFt, autoResize, focusIndex, ...attributes } = this.props;
    const { theme } = this.context;
    const { opened, focusNodeIndex, currDisplayMode } = this.state;
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
                    style={{ fontSize: 16, width: 48, height: 48, background: "none" }}
                    hoverStyle={{ background: theme.baseLow }}
                    activeStyle={{ background: theme.baseMediumLow }}
                  >
                    {"\uE700"}
                  </IconButton>
                ), {
                  onClick: (e) => {
                    this.toggleOpened();
                    if (topIcon && topIcon.props.onClick) topIcon.props.onclick(e);
                  }
                })}
                <p style={theme.prepareStyles({ transition: "all 0.25s", opacity: (opened || currDisplayMode === "compact") ? 1 : 0 })}>
                  {pageTitle}
                </p>
              </div>
              <div style={styles.paneTopItems}>
                {topNodes.map((node, index) => {
                  let currNode = node as any;
                  const haveOpenNode = "opened" in node;
                  if (node.default) currNode = node.default;
                  if (haveOpenNode && opened) currNode = node.opened;
                  ++nodeIndex;
                  return (
                    <SlideInOut
                      appearAnimate={false}
                      mode="in"
                      direction={position === "left" ? "right" : "left"}
                      key={`${index}`}
                      style={{ height: 48 }}
                    >
                      {React.cloneElement(currNode, this.getNewNodeProps(currNode, nodeIndex, Boolean(opened && haveOpenNode), haveOpenNode))}
                    </SlideInOut>
                  );
                })}
              </div>
            </div>
            <div style={styles.paneBottom}>
              {bottomNodes.map((node, index) => {
                let currNode = node as any;
                const haveOpenNode = "opened" in node;
                if (node.default) currNode = node.default;
                if (haveOpenNode && opened) currNode = node.opened;
                ++nodeIndex;
                return (
                  <SlideInOut
                    appearAnimate={false}
                    mode="in"
                    direction={position === "left" ? "right" : "left"}
                    key={`${index}`}
                    style={{ height: 48 }}
                  >
                    {React.cloneElement(currNode, this.getNewNodeProps(currNode, nodeIndex, Boolean(opened && haveOpenNode), haveOpenNode))}
                  </SlideInOut>
                );
              })}
            </div>
          </div>
        </div>
        <div style={styles.paneView}>{children}</div>
      </div>
    );
  }
}

function getStyles(navPane: NavPane): {
  root?: React.CSSProperties;
  paneParent?: React.CSSProperties;
  paneView?: React.CSSProperties;
  topIcon?: React.CSSProperties;
  pane?: React.CSSProperties;
  paneTop?: React.CSSProperties;
  paneTopItems?: React.CSSProperties;
  paneBottom?: React.CSSProperties;
  view?: React.CSSProperties;
} {
  const {
    context,
    props: { expandedWidth, paneStyle, paneViewStyle, background },
    state: { currInitWidth, opened, currDisplayMode }
  } = navPane;
  const isOverLay = currDisplayMode === "overlay";
  const isCompact = currDisplayMode === "compact";
  const { theme } = context;
  const { prepareStyles } = theme;

  return {
    root: prepareStyles({
      display: "flex",
      flex: "0 0 auto",
      flexDirection: isCompact ? "column" : "row",
      alignItems: "flex-start",
      justifyContent: "flex-start",
      fontSize: 16,
      color: theme.baseMediumHigh,
      // background: isCompact ? (background || theme.altHigh) : theme.altHigh,
      position: "relative"
    }),
    paneParent: prepareStyles({
      display: "flex",
      flex: "0 0 auto",
      width: opened ? expandedWidth : currInitWidth,
      transition: "all .25s 0s ease-in-out",
      height: isCompact ? 0 : "100%",
      ...(isOverLay ? {
        position: "absolute",
        left: 0,
        top: 0
      } : {})
    }),
    pane: prepareStyles({
      flex: "0 0 auto",
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      justifyContent: "space-between",
      background: (opened || !isCompact) ? theme.altHigh : background || theme.altHigh,
      width: opened ? expandedWidth : (isCompact ? 0 : currInitWidth),
      height: "100%",
      transition: "width .25s 0s ease-in-out",
      ...(isOverLay ? {
        position: "absolute",
        left: 0,
        top: 0
      } : {}),
      ...prepareStyles(paneStyle)
    }),
    topIcon: prepareStyles({
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start",
      background: background || theme.altHigh,
      width: isCompact ? "100vw" : (opened ? "100%" : 48)
    }),
    paneTop: prepareStyles({
      display: "flex",
      flexDirection: "column",
      width: "100%",
      flex: "0 0 auto"
    }),
    paneTopItems: prepareStyles({
      display: "flex",
      flexDirection: "column",
      flex: "0 0 auto",
      overflow: "hidden",
      width: opened ? "100%" : (isCompact ? 0 : currInitWidth)
    }),
    paneBottom: prepareStyles({
      display: "flex",
      flexDirection: "column",
      flex: "0 0 auto",
      overflow: "hidden",
      width: opened ? "100%" : (isCompact ? 0 : currInitWidth)
    }),
    paneView: prepareStyles({
      background: "none",
      height: "100%",
      width: (isCompact || isOverLay) ? "100%" : `calc(100% - ${(opened && !isOverLay) ? expandedWidth : currInitWidth}px)`,
      position: isOverLay ? "absolute" : void(0),
      left: isOverLay ? 0 : void(0),
      ...paneViewStyle
    })
  };
}
