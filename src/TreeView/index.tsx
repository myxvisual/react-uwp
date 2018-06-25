import * as React from "react";
import * as PropTypes from "prop-types";

import Icon from "../Icon";

export interface TreeItem {
  /**
   * Set TreeView item title.
   */
  title?: string;
  /**
   * Set TreeView ReactNode to item title.
   */
  titleNode?: React.ReactNode;
  /**
   * Disabled TreeView item.
   */
  disabled?: boolean;
  /**
   * Init Item is `Visited`,only effective for the first loaded.
   */
  visited?: boolean;
  /**
   * Set Item is expanded.
   */
  expanded?: boolean;
  /**
   * Init Item is `Focus`,only effective for the first loaded.
   */
  focus?: boolean;
  /**
   * Hidden TreeView item.
   */
  hidden?: boolean;
  /**
   * Set TreeView Children.
   */
  children?: TreeItem[];
  /**
   * Set TreeView item init style.
   */
  style?: React.CSSProperties;
  /**
   * Set TreeView item hovered style.
   */
  hoverStyle?: React.CSSProperties;
  /**
   * Set TreeView item onclick callback.
   */
  onClick?: (e: MouseEvent) => void;
}

export interface DataProps {
  /**
   * Set TreView data source.
   */
  listSource?: TreeItem[] | string[];
  /**
   * Set TreView icon direction.
   */
  iconDirection?: "left" | "right";
  /**
   * Set TreView item height.
   */
  itemHeight?: number;
  /**
   * Set TreView item padding.
   */
  itemPadding?: number;
  /**
   * Set TreView icon padding.
   */
  iconPadding?: number;
  /**
   * onChoose Tree item callback.
   */
  onChooseTreeItem?: (listItem: TreeItem) => void;
  /**
   * Set Tree header item icon.
   */
  headerIcon?: React.ReactNode;
  /**
   * Set Tree item children icon.
   */
  itemIcon?: React.ReactNode;
  /**
   * Set TreeView custom background.
   */
  background?: string;
  /**
   * Set first loaded show focus item ro not.
   */
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
    itemHeight: 32,
    iconPadding: 2,
    iconDirection: "left",
    onChooseTreeItem: emptyFunc,
    showFocus: true
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
    const { prefixStyle } = theme;
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
      let behindElm: HTMLDivElement = null;
      const haveChild = Array.isArray(children) && children.length !== 0;
      const isRight = iconDirection === "right";
      const isVisited = (visited && !haveChild) || (visited && init);

      const inlineStyles = hidden ? null : {
        root: {
          paddingLeft: isChild ? (isRight ? itemHeight / 2.8 : itemPadding || itemHeight * 2 / 3) : void 0
        } as React.CSSProperties,
        title: {
          color: disabled ? theme.baseLow : void 0,
          ...styles.title
        },
        titleNode: {
          cursor: disabled ? "not-allowed" : "pointer",
          pointerEvents: disabled ? "none" : void 0,
          paddingLeft: isRight ? 0 : (haveChild ? iconPadding : itemHeight / 8),
          fontSize: itemHeight / 2.25,
          height: "100%",
          lineHeight: `${itemHeight}px`,
          ...styles.titleNode,
          ...style
        },
        icon: {
          cursor: disabled ? "not-allowed" : "pointer",
          color: disabled ? theme.baseLow : void 0,
          fontSize: itemHeight / 2,
          lineHeight: `${itemHeight / 2}px`,
          width: itemHeight / 2,
          height: itemHeight / 2,
          flex: "0 0 auto",
          zIndex: 1,
          transform: `rotateZ(${expanded ? "-180deg" : (isRight ? "0deg" : "-90deg")})`
        },
        behindBG: {
          cursor: disabled ? "not-allowed" : "pointer",
          transition: "all 0.25s",
          zIndex: 0,
          background: (focus && showFocus) ? theme.accent : (
            isVisited ? theme.listAccentLow : "none"
          ),
          ...styles.behindBG
        },
        child: haveChild ? theme.prefixStyle({
          height: "auto",
          overflow: expanded ? void 0 : "hidden",
          opacity: expanded ? 1 : 0,
          transform: `translateY(${expanded ? 0 : -10 }px)`,
          transformOrigin: "top",
          transition: "all .25s"
        }) : void 0
      };
      const listStyles = hidden ? null : theme.prepareStyles({
        className: "tree-view",
        styles: inlineStyles
      });

      return hidden ? null : (
        <div
          {...listStyles.root}
          key={`${index}`}
        >
          <div
            {...listStyles.title}
            onMouseEnter={disabled ? void 0 : e => {
              if (behindElm) {
                Object.assign(behindElm.style, {
                  background: isVisited ? theme.accent : theme.baseLow,
                  ...(hoverStyle as any)
                } as CSSStyleDeclaration);
              }
            }}
            onMouseLeave={disabled ? void 0 : e => {
              if (behindElm) {
                Object.assign(behindElm.style, {
                  background: isVisited ? theme.listAccentLow : "none"
                } as CSSStyleDeclaration);
              }
            }}
          >
            <div
              onClick={disabled ? void 0 : e => {
                this.setChooseItem(item);
                if (onClick) onClick(e as any);
              }}
              {...listStyles.titleNode}
            >
              {titleNode}
            </div>
            {haveChild ? headerIcon : itemIcon}
            {(headerIcon || itemIcon ? (headerIcon && itemIcon) : true) && haveChild && (
              <Icon
                onClick={disabled ? void 0 : e => {
                  this.setChooseItem(item);
                }}
                {...listStyles.icon}
              >
                ScrollChevronDownLegacy
              </Icon>
            )}
            <div
              onClick={disabled ? void 0 : e => {
                this.setChooseItem(item);
                if (onClick) onClick(e as any);
              }}
              className={listStyles.behindBG.className}
              style={{
                ...listStyles.behindBG.style,
                background: (focus && showFocus) ? theme.accent : (
                  isVisited ? theme.listAccentLow : "none"
                )
              } as React.CSSProperties}
              ref={elm => behindElm = elm}
            />
          </div>
          {haveChild && (
            <div {...listStyles.child}>
              {expanded && children.map((item: TreeItem, index: number) => renderList(item, index, true, indexArray))}
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
      className,
      style,
      ...attributes
    } = this.props;
    const styles = getStyles(this);

    return (
      <div
        {...attributes}
        {...this.context.theme.prepareStyle({
          style: styles.root,
          className: "tree-view",
          extendsClassName: className
        })}
      >
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
  behindBG?: React.CSSProperties;
} {
  const { context, props: { iconDirection, itemHeight, style, background } } = treeView;
  const isRight = iconDirection === "right";
  const { theme } = context;
  const { prefixStyle } = theme;
  return {
    root: prefixStyle({
      fontSize: 14,
      overflowX: "hidden",
      overflowY: "auto",
      color: theme.baseMediumHigh,
      background: background || (theme.useFluentDesign ? theme.acrylicTexture60.background : "none"),
      width: itemHeight * 10,
      padding: "0 16px",
      ...style
    }),
    title: prefixStyle({
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
    titleNode: prefixStyle({
      color: "inherit",
      zIndex: 1,
      width: "100%",
      overflow: "hidden",
      whiteSpace: "nowrap",
      textOverflow: "ellipsis"
    }),
    behindBG: {
      position: "absolute",
      top: 0,
      left: "-100%",
      width: "400%",
      height: "100%"
    }
  } as any;
}

export default TreeView;
