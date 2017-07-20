import * as React from "react";
import * as PropTypes from "prop-types";

export interface ExpandedItem {
  /**
   * Set ReactNode to item.
   */
  iconNode?: React.ReactElement<any>;
  /**
   * Set title to item.
   */
  title?: string;
  /**
   * onClick callback.
   */
  onClick?: (e?: React.MouseEvent<HTMLAnchorElement>) => void;
  /**
   * Set focus focus color to item.
   */
  href?: string;
  /**
   * Set focus focus color to item.
   */
  focusColor?: string;
}
import IconButton from "../IconButton";

export interface DataProps {
  /**
   * Set Float expanded position.
   */
  isFloatRight?: boolean;
  /**
   * Set custom default width.
   */
  initWidth?: number;
  /**
   * Set custom expanded width.
   */
  expandedWidth?: number;
  /**
   * Set custom ReactNode to top.
   */
  topNode?: React.ReactElement<any> | React.ReactElement<any>[];
  /**
   * Set custom ReactNode to Bottom.
   */
  bottomNode?: React.ReactElement<any> | React.ReactElement<any>[];
  /**
   * Set custom expanded items.
   */
  expandedItems?: ExpandedItem[];
  /**
   * HightLight expanded item ny index.
   */
  focusItemIndex?: number;
  /**
   * HightLight expanded item ny index.
   */
  onFocusItem?: (itemIndex?: number) => void;
}

export interface FloatNavProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export interface FloatNavState {
  currFocusItemIndex?: number;
  hoverItem?: number;
  hoverIndexArray?: boolean[];
}

const emptyFunc = () => {};
export class FloatNav extends React.Component<FloatNavProps, FloatNavState> {
  static defaultProps: FloatNavProps = {
    onFocusItem: emptyFunc,
    expandedItems: [],
    initWidth: 48,
    isFloatRight: true,
    expandedWidth: 240
  };

  state: FloatNavState = {
    currFocusItemIndex: this.props.focusItemIndex,
    hoverItem: null,
    hoverIndexArray: []
  };

  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  componentWillReceiveProps(nextProps: FloatNavProps) {
    this.setState({
      currFocusItemIndex: nextProps.focusItemIndex
    });
  }

  shouldComponentUpdate(nextProps: FloatNavProps, nextState: FloatNavState) {
    return nextProps !== this.props || nextState !== this.state;
  }

  focusIndex = (currFocusItemIndex: number) => this.setState({ currFocusItemIndex });

  getFocusIndex = () => this.state.currFocusItemIndex;

  getItems = () => this.props.expandedItems;

  render() {
    const {
      expandedItems,
      onFocusItem,
      topNode,
      bottomNode,
      isFloatRight,
      expandedWidth,
      initWidth,
      focusItemIndex,
      ...attributes
    } = this.props;
    const { theme } = this.context;
    const { currFocusItemIndex, hoverItem, hoverIndexArray } = this.state;
    const itemStyle = theme.prefixStyle({
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      background: theme.altHigh,
      transition: "all .25s 0s cubic-bezier(.04, .89, .44, 1.07)",
      fontSize: 12
    });
    const staticButtonStyle: React.CSSProperties = {
      background: theme.accent,
      color: "#fff"
    };

    return (
      <div
        {...attributes}
        style={theme.prefixStyle({
          width: 48,
          background: theme.altHigh,
          ...attributes.style
        })}
      >
        <div
          {...attributes}
          style={theme.prefixStyle({
            width: initWidth,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: isFloatRight ? "flex-end" : "flex-start"
          })}
        >
          {React.Children.map(topNode, (child: React.ReactElement<any>, index) => (
            <div
              key={`${index}`}
              style={theme.prefixStyle({
                ...itemStyle,
                width: initWidth,
                height: initWidth
                // ...(child.type === IconButton ? staticButtonStyle : void 0)
              })}
            >
              {React.cloneElement(child, { style: { ...child.props.style, width: initWidth, height: initWidth } })}
            </div>
          ))}
          {expandedItems.map((item, index) => {
            const { iconNode, focusColor, title, href, onClick } = item;
            const isFirst = currFocusItemIndex === index;
            const isHovered = hoverItem === index;
            const padding = initWidth / 2;
            return (
              <a
                onMouseEnter={(e) => {
                  hoverIndexArray[index] = true;
                  this.setState({ hoverItem: index, hoverIndexArray });
                }}
                onMouseLeave={() => {
                  hoverIndexArray[index] = false;
                  this.setState({ hoverItem: void(0), hoverIndexArray });
                }}
                href={href}
                onClick={e => { onFocusItem(index); if (onClick) onClick(e); }}
                style={theme.prefixStyle({
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: isFloatRight ? "row" : "row-reverse",
                  alignItems: "center",
                  justifyContent: isHovered ? "space-between" : "center",
                  boxSizing: "border-box",
                  transition: "all .25s 0s ease-in-out",
                  color: hoverIndexArray[index] ? "#fff" : theme.baseHigh,
                  textDecoration: "none",
                  background: (isFirst || isHovered) ? (theme.accent || focusColor) : theme.altHigh,
                  width: hoverIndexArray[index] ? expandedWidth : initWidth,
                  height: initWidth
                })}
                key={`${index}`}
              >
                {isHovered && <span style={{ cursor: "default", color: "#fff", margin: `0 ${padding}px`, whiteSpace: "nowrap" }}>{title}</span>}
                {iconNode.type === IconButton ? (
                  React.cloneElement(iconNode, {
                    style: { color: hoverIndexArray[index] || isFirst ? "#fff" : theme.baseHigh }
                  })
                ) : iconNode}
              </a>
            );
          })}
          {React.Children.map(bottomNode, (child: React.ReactElement<any>, index) => (
            <div
              key={`${index}`}
              style={theme.prefixStyle({
                ...itemStyle,
                width: initWidth,
                height: initWidth
                // ...(child.type === IconButton ? staticButtonStyle : void 0)
              })}
            >
              {React.cloneElement(child, { style: { ...child.props.style, width: initWidth, height: initWidth } })}
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default FloatNav;
