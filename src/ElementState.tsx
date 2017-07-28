import * as React from "react";
import * as ReactDOM from "react-dom";
import * as PropTypes from "prop-types";

import setStyleToElement from "./common/setStyleToElement";

export interface DataProps {
  children?: React.ReactElement<any>;
  style?: React.CSSProperties;
  hoverStyle?: React.CSSProperties;
  focusStyle?: React.CSSProperties;
  activeStyle?: React.CSSProperties;
  visitedStyle?: React.CSSProperties;
  disabledStyle?: React.CSSProperties;
  onHover?: (e?: any) => void;
  onFocus?: (e?: any) => void;
  onActive?: (e?: any) => void;
  onVisited?: (e?: any) => void;
  unHover?: (e?: any) => void;
  unFocus?: (e?: any) => void;
  unActive?: (e?: any) => void;
  unVisited?: (e?: any) => void;
  onMouseEnter?: (e?: any) => void;
  onMouseLeave?: (e?: any) => void;
  onMouseDown?: (e?: any) => void;
  onMouseUp?: (e?: any) => void;
  onClick?: (e?: any) => void;
}

export interface Attributes {
  [key: string]: any;
}

export interface ElementStateProps extends DataProps, Attributes {}
const emptyFunc = () => {};
export default class ElementState extends React.Component<ElementStateProps, {}> {
  static defaultProps: ElementStateProps = {
    onHover: emptyFunc,
    onFocus: emptyFunc,
    onActive: emptyFunc,
    onVisited: emptyFunc,
    unHover: emptyFunc,
    unFocus: emptyFunc,
    unActive: emptyFunc,
    unVisited: emptyFunc,
    onMouseEnter: emptyFunc,
    onMouseLeave: emptyFunc,
    onMouseDown: emptyFunc,
    onMouseUp: emptyFunc,
    onClick: emptyFunc
  };

  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  rootElm: HTMLElement;
  originStyle: CSSStyleDeclaration;
  visitedStyle: React.CSSProperties = {};

  componentDidMount() {
    this.rootElm = ReactDOM.findDOMNode(this) as any;
    this.originStyle = { ...this.rootElm.style };
  }

  componentDidUpdate() {
    this.rootElm = ReactDOM.findDOMNode(this) as any;
    this.originStyle = { ...this.rootElm.style };
  }

  setStyle = (style: React.CSSProperties) => {
    setStyleToElement(
      this.rootElm,
      this.context.theme.prefixStyle({ ...this.props.style, ...style })
    );
  }

  hover = () => {
    let child: any = this.props.children;
    this.setStyle(this.props.hoverStyle);
    this.props.onMouseEnter();
    this.props.onHover();
  }
  unHover = () => {
    this.resetStyle();
    this.props.onMouseLeave();
    this.props.unHover();
  }

  active = () => {
    this.setStyle(this.props.activeStyle);
    this.props.onMouseDown();
    this.props.onActive();
  }
  unActive = () => {
    this.setStyle(this.props.hoverStyle);
    this.props.onMouseUp();
    this.props.unActive();
  }

  focus = () => {
    this.setStyle(this.props.focusStyle);
    this.props.onFocus();
  }
  unFocus = () => {
    this.resetStyle();
    this.props.unFocus();
  }

  visited = () => {
    this.setStyle(this.props.visitedStyle);
    this.props.onClick();
    this.props.onVisited();
    this.visitedStyle = this.props.visitedStyle;
  }
  unVisited = () => {
    this.resetStyle(true);
    this.props.onClick();
    this.props.unVisited();
  }

  resetStyle = (resetVisited = false) => {
    if (resetVisited) {
      this.visitedStyle = void 0;
    }
    setStyleToElement(this.rootElm, { ...this.props.style, ...this.visitedStyle }, true);
  }

  render() {
    const {
      style,
      hoverStyle,
      focusStyle,
      activeStyle,
      visitedStyle,
      disabledStyle,
      onMouseEnter,
      onMouseLeave,
      onMouseDown,
      onMouseUp,
      onClick,
      onHover,
      onFocus,
      onActive,
      onVisited,
      unHover,
      unFocus,
      unActive,
      unVisited,
      visited,
      children,
      disabled,
      ...attributes
    } = this.props;

    return React.cloneElement(children as React.ReactElement<any>, {
      ...attributes,
      style: this.context.theme.prefixStyle({
        transition: "all .25s",
        ...style,
        ...(disabled ? disabledStyle : void 0)
      }),
      onMouseEnter: (hoverStyle && !disabled) ? this.hover : onMouseEnter,
      onMouseLeave: (hoverStyle && !disabled) ? this.unHover : onMouseLeave,
      onMouseDown: (activeStyle && !disabled) ? this.active : onMouseDown,
      onMouseUp: (activeStyle && !disabled) ? this.unActive : onMouseUp,
      onClick: (visitedStyle && !disabled) ? this.visited : onClick,
      onFocus: (focusStyle && !disabled) ? this.focus : onFocus
    });
  }
}
