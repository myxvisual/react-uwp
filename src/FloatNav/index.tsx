import * as React from "react";
import * as PropTypes from "prop-types";

import ThemeType from "../styles/ThemeType";

export interface Item {
  showNode?: any;
  title?: string;
  href?: string;
  color?: string;
}

export interface DataProps {
  focusItem?: number;
  onFocusIndex?: (index: number) => void;
  topNode?: React.ReactElement<any> | React.ReactElement<any>[];
  bottomNode?: React.ReactElement<any> | React.ReactElement<any>[];
  isFloatRight?: boolean;
  items?: Item[];
  floatNavWidth?: number;
}

export interface FloatNavProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export interface FloatNavState {
  currFocusItem?: number;
  hoverItem?: number;
  hoverIndexArray?: boolean[];
}

export default class FloatNav extends React.Component<FloatNavProps, FloatNavState> {
  static defaultProps: FloatNavProps = {
    onFocusIndex: () => {},
    items: [],
    width: 40,
    isFloatRight: true,
    floatNavWidth: 240
  };

  state: FloatNavState = {
    currFocusItem: this.props.focusItem,
    hoverItem: null,
    hoverIndexArray: []
  };

  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  componentWillReceiveProps(nextProps: FloatNavProps) {
    this.setState({
      currFocusItem: nextProps.focusItem
    });
  }

  shouldComponentUpdate(nextProps: FloatNavProps, nextState: FloatNavState) {
    return nextProps !== this.props || nextState !== this.state;
  }

  focusIndex = (currFocusItem: number) => this.setState({ currFocusItem });

  getFocusIndex = () => this.state.currFocusItem;

  getItems = () => this.props.items;

  render() {
    const {
      items,
      onFocusIndex,
      topNode,
      bottomNode,
      isFloatRight,
      floatNavWidth,
      width,
      focusItem,
      ...attributes
    } = this.props;
    const { theme } = this.context;
    const { currFocusItem, hoverItem, hoverIndexArray } = this.state;
    const itemStyle = theme.prepareStyles({
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      background: theme.altHigh,
      transition: "all .25s 0s cubic-bezier(.04, .89, .44, 1.07)",
      fontSize: 12
    });

    return (
      <div
        {...attributes}
        style={theme.prepareStyles({
          width: 40,
          background: theme.altHigh,
          ...attributes.style
        })}
      >
        <div
          {...attributes}
          style={theme.prepareStyles({
            width,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: isFloatRight ? "flex-end" : "flex-start"
          })}
        >
          {React.Children.map(topNode, (child: React.ReactElement<any>, index) => (
            <div
              key={`${index}`}
              style={theme.prepareStyles({
                ...itemStyle,
                width,
                height: width
              })}
            >
              {React.cloneElement(child, { style: { ...child.props.style, width, height: width } })}
            </div>
          ))}
          {items.map((item, index) => {
            const { showNode, color, title } = item;
            const isFirst = currFocusItem === index;
            const isHovered = hoverItem === index;
            const padding = Number.parseInt(width.toString()) / 2;
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
                onClick={() => { onFocusIndex(index); }}
                style={theme.prepareStyles({
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: isFloatRight ? "row" : "row-reverse",
                  alignItems: "center",
                  justifyContent: isHovered ? "space-between" : "center",
                  boxSizing: "border-box",
                  transition: "all .25s 0s ease-in-out",
                  color: hoverIndexArray[index] ? "#fff" : theme.baseHigh,
                  textDecoration: "none",
                  background: (isFirst || isHovered) ? (theme.accent || color) : theme.altHigh,
                  width: hoverIndexArray[index] ? floatNavWidth : width,
                  height: width
                })}
                key={`${index}`}
              >
                {isHovered && <span style={{ cursor: "default", color: "#fff", margin: `0 ${padding}px` }}>{title}</span>}
                {typeof showNode === "string"
                  ?
                  <div
                    style={theme.prepareStyles({
                      transition: [
                        "width cubic-bezier(.04, .89, .44, 1.07),",
                        "opacity cubic-bezier(.04, .89, .44, 1.07),",
                        "visibility cubic-bezier(.04, .89, .44, 1.07)"
                      ].join(""),
                      width,
                      height: padding,
                      background: `url(${showNode}) no-repeat center center / contain`,
                      filter: isHovered ? "brightness(100)" : void 0
                    })}
                  />
                  : React.cloneElement(showNode, { style: { ...showNode.props.style, width, height: width } })
                }
              </a>
            );
          })}
          {React.Children.map(bottomNode, (child: React.ReactElement<any>, index) => (
            <div
              key={`${index}`}
              style={theme.prepareStyles({
                ...itemStyle,
                width,
                height: width
              })}
            >
              {React.cloneElement(child, { style: { ...child.props.style, width, height: width } })}
            </div>
          ))}
        </div>
      </div>
    );
  }
}
