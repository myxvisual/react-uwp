import * as React from "react";
import * as ReactDOM from "react-dom";
import * as PropTypes from "prop-types";

export interface DataProps {
  children?: React.ReactElement<any>;
  style?: React.CSSProperties;
  hoverStyle?: React.CSSProperties;
  focusStyle?: React.CSSProperties;
  activeStyle?: React.CSSProperties;
  visitedStyle?: React.CSSProperties;
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

export interface ElementStateState {
  currFocus?: boolean;
  currHovered?: boolean;
  currActive?: boolean;
  currVisited?: boolean;
}

export interface ElementStateProps extends DataProps, Attributes {}
const emptyFunc = () => {};
export default class ElementState extends React.Component<ElementStateProps, ElementStateState> {
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
  state: ElementStateState = {};

  context: { theme: ReactUWP.ThemeType };

  hover = () => {
    this.props.onMouseEnter();
    this.props.onHover();
    this.setState((prevState, prevProps) => ({ currHovered: true }));
  }
  unHover = () => {
    this.props.onMouseLeave();
    this.props.unHover();
    this.setState((prevState, prevProps) => ({ currHovered: false }));
  }

  active = () => {
    this.props.onMouseDown();
    this.props.onActive();
    this.setState((prevState, prevProps) => ({ currActive: true }));
  }
  unActive = () => {
    this.props.onMouseUp();
    this.props.unActive();
    this.setState((prevState, prevProps) => ({ currActive: false }));
  }

  focus = () => {
    this.props.onFocus();
    this.setState((prevState, prevProps) => ({ currFocus: true }));
  }
  unFocus = () => {
    this.props.unFocus();
    this.setState((prevState, prevProps) => ({ currFocus: false }));
  }

  visited = () => {
    this.props.onClick();
    this.props.onVisited();
    this.setState((prevState, prevProps) => ({ currVisited: true }));
  }
  unVisited = () => {
    this.props.onClick();
    this.props.unVisited();
  }

  render() {
    const {
      style,
      hoverStyle,
      focusStyle,
      activeStyle,
      visitedStyle,
      onMouseEnter,
      onMouseLeave,
      onMouseDown,
      onMouseUp,
      onClick,
      onHover, // tslint:disable-line:no-unused-variable
      onFocus,
      onActive, // tslint:disable-line:no-unused-variable
      onVisited, // tslint:disable-line:no-unused-variable
      unHover, // tslint:disable-line:no-unused-variable
      unFocus, // tslint:disable-line:no-unused-variable
      unActive, // tslint:disable-line:no-unused-variable
      unVisited, // tslint:disable-line:no-unused-variable
      visited, // tslint:disable-line:no-unused-variable
      children,
      ...attributes
    } = this.props;
    const { currHovered, currFocus, currVisited, currActive } = this.state;

    return React.cloneElement(children as any, {
      ...attributes,
      style: this.context.theme.prepareStyles({
        transition: "all .25s",
        ...style,
        ...(currHovered ? hoverStyle : void 0),
        ...(currFocus ? focusStyle : void 0),
        ...(currActive ? activeStyle : void 0),
        ...(currVisited ? visitedStyle : void 0)
      }),
      onMouseEnter: hoverStyle ? this.hover : onMouseEnter,
      onMouseLeave: hoverStyle ? this.unHover : onMouseLeave,
      onMouseDown: activeStyle ? this.active : onMouseDown,
      onMouseUp: activeStyle ? this.unActive : onMouseUp,
      onClick: visitedStyle ? this.visited : onClick,
      onFocus: focusStyle ? this.focus : onFocus
    });
  }
}
