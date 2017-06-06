import * as React from "react";
import * as PropTypes from "prop-types";

import Icon from "../Icon";

export interface TreeItem {
  title?: string;
  titleNode?: React.ReactNode;
  disabled?: boolean;
  visited?: boolean;
  expanded?: boolean;
  focus?: boolean;
  hidden?: boolean;
  children?: TreeItem[];
  style?: React.CSSProperties;
  hoverStyle?: React.CSSProperties;
  onClick?: (e: MouseEvent) => void;
}

export interface DataProps {
  listSource?: TreeItem[] | string[];
  iconDirection?: "left" | "right";
  itemHeight?: number;
  itemPadding?: number;
  iconPadding?: number;
  onChooseTreeItem?: (listItem: TreeItem) => void;
  headerIcon?: React.ReactNode;
  itemIcon?: React.ReactNode;
  background?: string;
  showFocus?: boolean;
}

export interface TreeViewProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export interface TreeViewState {
  init?: boolean;
  chooseTreeItem?: TreeItem;
}

const emptyFunc = () => {};
export class TreeView extends React.Component<TreeViewProps, TreeViewState> {
  static defaultProps: TreeViewProps = {
    listSource: [],
    itemHeight: 40,
    itemPadding: 20,
    iconPadding: 2,
    iconDirection: "left",
    onChooseTreeItem: emptyFunc,
    showFocus: true,
    background: "none"
  };

  state: TreeViewState = {
    init: true
  };

  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  setChooseItem = (chooseTreeItem: TreeItem) => {
    const { onChooseTreeItem, listSource } = this.props;
    if (this.state.chooseTreeItem && chooseTreeItem !== this.state.chooseTreeItem) {
      this.state.chooseTreeItem.visited = false;
    }
    chooseTreeItem.visited = true;
    if (chooseTreeItem.children) {
      chooseTreeItem.expanded = !chooseTreeItem.expanded;
    }
    this.setState({ chooseTreeItem, init: false });
    this.props.onChooseTreeItem(chooseTreeItem);
  }

  renderTree = (): React.ReactNode => {
    const { theme } = this.context;
    const { prepareStyles } = theme;
    const {
      iconDirection,
      showFocus,
      itemHeight,
      iconPadding,
      itemPadding,
      headerIcon,
      itemIcon,
      listSource
    } = this.props;

    const { init, chooseTreeItem } = this.state;
    const styles = getStyles(this);

    const renderList = ((item: TreeItem, index: number, isChild?: boolean, prevIndexArray: number[] = []): React.ReactNode => {
      const indexArray = prevIndexArray.concat(index);
      if (typeof item === "string" || typeof item === "number") {
        let lastIndex: number = indexArray.splice(-1)[0];
        let itemParent: any = listSource;
        for (const numb of indexArray) {
          itemParent = itemParent.children ? itemParent.children[numb] : itemParent[numb];
        }
        const newData = { title: item };
        if (itemParent.children) {
          itemParent.children[lastIndex as any] = newData;
        } else {
          itemParent[lastIndex as any] = newData;
        }
        item = newData;
      }
      let {
        title,
        titleNode,
        expanded,
        disabled,
        visited,
        focus,
        children,
        hidden,
        onClick,
        style,
        hoverStyle
      } = item;
      titleNode = title || titleNode;
      const haveChild = Array.isArray(children) && children.length !== 0;
      const isRight = iconDirection === "right";
      const isVisited = (visited && !haveChild) || (visited && init);

      return hidden ? null : (
        <div
          style={{
            paddingLeft: isChild ? (isRight ? 10 : itemPadding) : void 0
          }}
          key={`${index}`}
        >
          <div
            style={theme.prepareStyles({
              color: disabled ? theme.baseLow : void 0,
              ...styles.title
            })}
            onMouseEnter={disabled ? void 0 : e => {
              Object.assign((e.currentTarget.children[0] as HTMLDivElement).style, hoverStyle);
              const bgNode = e.currentTarget.parentElement.querySelector(".react-uwp-tree-view-bg") as HTMLDivElement;
              Object.assign(bgNode.style, {
                background: isVisited ? theme.accent : theme.baseLow
              } as CSSStyleDeclaration);
            }}
            onMouseLeave={disabled ? void 0 : e => {
              Object.assign((e.currentTarget.children[0] as HTMLDivElement).style, style);
              const bgNode = e.currentTarget.parentElement.querySelector(".react-uwp-tree-view-bg") as HTMLDivElement;
              Object.assign(bgNode.style, {
                background: isVisited ? theme.listAccentLow : "none"
              } as CSSStyleDeclaration);
            }}
          >
            <div
              onClick={disabled ? void 0 : (e) => {
                if (onClick) onClick(e as any);
                this.setChooseItem(item);
              }}
              style={{
                cursor: disabled ? "not-allowed" : "pointer",
                paddingLeft: haveChild ? iconPadding : 0,
                height: "100%",
                lineHeight: `${itemHeight}px`,
                ...styles.titleNode,
                ...style
              }}
            >
              {titleNode}
            </div>
            {haveChild ? headerIcon : itemIcon}
            {(headerIcon || itemIcon ? (headerIcon && itemIcon) : true) && haveChild && (
              <Icon
                onClick={disabled ? void 0 : (e) => {
                  this.setChooseItem(item);
                }}
                style={prepareStyles({
                  cursor: disabled ? "not-allowed" : "pointer",
                  color: disabled ? theme.baseLow : void 0,
                  fontSize: itemHeight / 2,
                  lineHeight: `${itemHeight / 2}px`,
                  width: itemHeight / 2,
                  height: itemHeight / 2,
                  flex: "0 0 auto",
                  zIndex: 1,
                  transform: `rotateZ(${expanded ? "-180deg" : (isRight ? "0deg" : "-90deg")})`
                })}
              >
                ScrollChevronDownLegacy
              </Icon>
            )}
            <div
              onClick={disabled ? void 0 : (e) => {
                if (onClick) onClick(e as any);
                this.setChooseItem(item);
              }}
              style={prepareStyles({
                cursor: disabled ? "not-allowed" : "pointer",
                transition: "all 0.25s",
                zIndex: 0,
                background: (focus && showFocus) ? theme.accent : (
                  isVisited ? theme.listAccentLow : "none"
                ),
                ...styles.bg
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
              {expanded && children.map((item: TreeItem[], index: number) => renderList(item, index, true, indexArray))}
            </div>
          )}
        </div>
      );
    });

    return (listSource as any).map((list: any, index: number) => renderList(list, index));
  }

  render() {
    const {
      listSource,
      iconDirection,
      itemHeight,
      onChooseTreeItem,
      itemPadding,
      iconPadding,
      showFocus,
      background,
      headerIcon,
      itemIcon,
      ...attributes
    } = this.props;
    const styles = getStyles(this);

    return (
      <div {...attributes} style={styles.root}>
        {listSource ? this.renderTree() : null}
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
  const { context, props: { iconDirection, itemHeight, style, background } } = treeView;
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
      width: 320,
      padding: "0 16px",
      ...prepareStyles(style)
    }),
    title: prepareStyles({
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
      width: "100%",
      position: "relative",
      fontSize: 14,
      display: "flex",
      height: itemHeight,
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
      textOverflow: "ellipsis"
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
