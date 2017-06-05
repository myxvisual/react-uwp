import * as React from "react";
import * as PropTypes from "prop-types";

import Icon from "../Icon";

export interface ListItem extends React.HTMLAttributes<HTMLDivElement> {
  titleNode?: string | React.ReactNode;
  expanded?: boolean;
  disabled?: boolean;
  focus?: boolean;
  visited?: boolean;
  hoverStyle?: CSSStyleDeclaration;
  children?: ListItem[];
}

export interface DataProps {
  listSource?: ListItem[];
  iconDirection?: "left" | "right";
  listItemHeight?: number;
  childPadding?: number;
  iconPadding?: number;
  titleNodeStyle?: React.CSSProperties;
  onChangeListItem?: (listSource: ListItem[]) => void;
  rootStyle?: React.CSSProperties;
  showFocus?: boolean;
  background?: string;
}

export interface TreeViewProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export interface TreeViewState {
  init?: boolean;
  currListItems?: ListItem[];
  visitedList?: ListItem;
  showFocus?: boolean;
}

const emptyFunc = () => {};
export class TreeView extends React.Component<TreeViewProps, TreeViewState> {
  static defaultProps: TreeViewProps = {
    listSource: [],
    listItemHeight: 40,
    childPadding: 40,
    iconPadding: 10,
    iconDirection: "left",
    onChangeListItem: emptyFunc,
    rootStyle: { width: 400 },
    background: "none"
  };

  state: TreeViewState = {
    init: true,
    currListItems: this.props.listSource,
    visitedList: null,
    showFocus: this.props.showFocus
  };

  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  componentWillReceiveProps(nexProps: TreeViewProps) {
    this.setState({
      currListItems: nexProps.listSource,
      showFocus: nexProps.showFocus
    });
  }

  handelClick = (e: React.MouseEvent<HTMLDivElement>, list: ListItem) => {
    list.expanded = !list.expanded;
    if (this.state.visitedList && !list.children) {
      this.state.visitedList.visited = false;
    }
    list.visited = true;
    this.setState({
      init: false,
      visitedList: list.children ? this.state.visitedList : list,
      showFocus: false
    });
    this.props.onChangeListItem(this.state.currListItems);
  }

  renderTree = (): React.ReactNode => {
    const { init, currListItems, showFocus } = this.state;
    const { theme } = this.context;
    const { prepareStyles } = theme;
    const { iconDirection, listItemHeight } = this.props;
    const isRight = iconDirection === "right";
    const styles = getStyles(this);
    const { childPadding, iconPadding } = this.props;
    const renderList = ((list: ListItem, index: number, isChild?: boolean): React.ReactNode => {
      const { titleNode, expanded, disabled, visited, focus, children, hoverStyle, ...attributes } = list;
      const haveChild = Array.isArray(children) && children.length !== 0;
      const fadeAccent = theme.listAccentLow;
      const isVisited = ((visited && !haveChild) || (visited && haveChild && init));
      return (
        <div
          style={{
            paddingLeft: isChild ? (isRight ? 10 : childPadding) : void 0
          }}
          key={`${index}`}
        >
          <div
            style={{
              color: disabled ? theme.baseLow : void 0,
              ...styles.title
            } as any}
            onMouseEnter={disabled ? void 0 : e => {
              const bgNode = e.currentTarget.querySelector(".react-uwp-tree-view-bg") as HTMLDivElement;
              const titleNode = e.currentTarget.querySelector(".react-uwp-tree-view-title") as HTMLDivElement;
              Object.assign(bgNode.style, {
                background: isVisited ? theme.accent : theme.baseLow
              } as CSSStyleDeclaration);
              Object.assign(titleNode.style, hoverStyle as any);
            }}
            onMouseLeave={disabled ? void 0 : e => {
              const bgNode = e.currentTarget.querySelector(".react-uwp-tree-view-bg") as HTMLDivElement;
              const titleNode = e.currentTarget.querySelector(".react-uwp-tree-view-title") as HTMLDivElement;
              Object.assign(bgNode.style, {
                background: isVisited ? fadeAccent : "none"
              } as CSSStyleDeclaration);
              Object.assign(titleNode.style, attributes.style as any);
            }}
          >
            <div
              {...attributes}
              onClick={disabled && attributes ? emptyFunc : attributes.onClick}
              className="react-uwp-tree-view-title"
              style={{
                cursor: disabled ? "not-allowed" : "pointer",
                paddingLeft: haveChild ? iconPadding : 0,
                ...styles.titleNode,
                ...attributes.style
                } as any}
              >
              {titleNode}
            </div>
            {haveChild && (
              <Icon
                onClick={disabled ? void(0) : (e) => {
                  this.handelClick(e as any, list);
                }}
                style={prepareStyles({
                  cursor: disabled ? "not-allowed" : "pointer",
                  color: disabled ? theme.baseLow : void 0,
                  width: isRight ? void 0 : 14,
                  marginRight: 1,
                  fontSize: listItemHeight / 2,
                  zIndex: 1,
                  transform: `rotateZ(${expanded ? "-180deg" : (isRight ? "0deg" : "-90deg")})`
                })}
              >
                {"\uE011"}
              </Icon>
            )}
            <div
              {...attributes}
              onClick={disabled && attributes ? emptyFunc : attributes.onClick}
              style={prepareStyles({
                cursor: disabled ? "not-allowed" : "pointer",
                transition: "all 0.25s",
                zIndex: 0,
                background: (focus && showFocus) ? theme.accent : (
                  isVisited ? fadeAccent : "none"
                ),
                ...styles.bg,
                ...attributes.style
              } as any)}
              className="react-uwp-tree-view-bg"
            />
          </div>
          {haveChild && (
            <div
              style={theme.prepareStyles({
                height: "auto",
                overflow: expanded ? void 0 : "hidden",
                opacity: expanded ? 1 : 0,
                transform: `translateY(${expanded ? 0 : -10 }px)`,
                transformOrigin: "top",
                transition: "all .25s"
              })}
            >
              {expanded && children.map((list: ListItem[], index: number) => renderList(list, index, true))}
            </div>
          )}
        </div>
      );
    });

    return currListItems.map((list, index) => renderList(list, index));
  }

  render() {
    const {
      listSource,
      iconDirection,
      listItemHeight,
      onChangeListItem,
      rootStyle,
      titleNodeStyle,
      childPadding,
      iconPadding,
      showFocus,
      background,
      ...attributes
    } = this.props;
    const { currListItems } = this.state;
    const styles = getStyles(this);

    return (
      <div {...attributes} style={styles.root}>
        {currListItems ? this.renderTree() : null}
      </div>
    );
  }
}

function getStyles(treeView: TreeView): {
  root?: React.CSSProperties;
  title?: React.CSSProperties;
  titleNode?: React.CSSProperties;
  icon?: React.CSSProperties;
  bg?: React.CSSProperties;
} {
  const { context, props: { iconDirection, listItemHeight, style, titleNodeStyle, background } } = treeView;
  const isRight = iconDirection === "right";
  const { theme } = context;
  const { prepareStyles } = theme;
  return {
    root: prepareStyles({
      fontSize: 14,
      overflowX: "hidden",
      overflowY: "auto",
      color: theme.baseMediumHigh,
      background: background,
      padding: "0 20px",
      ...prepareStyles(style)
    } as any),
    title: prepareStyles({
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
      width: "100%",
      position: "relative",
      fontSize: 14,
      display: "flex",
      height: listItemHeight,
      flexDirection: `row${isRight ? "" : "-reverse"}` as any,
      alignItems: "center",
      justifyContent: isRight ? "space-between" : "flex-end",
      transition: "all .25s 0s ease-in-out"
    }),
    titleNode: prepareStyles({
      color: "inherit",
      zIndex: 1,
      width: "100%",
      overflow: "hidden",
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
      ...titleNodeStyle
    }),
    bg: {
      position: "absolute",
      top: 0,
      left: "-100%",
      width: "400%",
      height: "100%"
    }
  } as any;
}

export default TreeView;
