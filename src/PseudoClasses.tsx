import * as React from "react";
import { findDOMNode } from "react-dom";
import * as PropTypes from "prop-types";

import ElementState, { ElementStateProps } from "./ElementState";
import spreadObject from "./common/spreadObject";

const pseudoClassesNames = ["&:hover", "&:active", "&:visited", "&:focus", "&:disabled"];

export interface PseudoClassesProps {
  children?: React.ReactElement<any>;
  style?: React.CSSProperties;
  [key: string]: any;
}

export class PseudoClasses extends React.Component<PseudoClassesProps> {
  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  rootElm: Element = null;

  componentDidMount() {
    const { context: { theme }, props: { style, children } } = this;
    if (theme.useInlineStyle || style) {
      this.rootElm = findDOMNode(this) as Element;
    }
  }

  render () {
    const { style, children, ...attributes } = this.props;

    if (this.context.theme.useInlineStyle && style) {
      const { primaryObject, secondaryObject } = spreadObject(style, pseudoClassesNames);
      return (
        <ElementState
          {...attributes}
          ref={elementState => this.rootElm = elementState ? elementState.rootElm : null}
          style={primaryObject}
          {...{
            hoverStyle: secondaryObject["&:hover"],
            activeStyle: secondaryObject["&:active"],
            visitedStyle: secondaryObject["&:visited"],
            focusStyle: secondaryObject["&:focus"],
            disabledStyle: secondaryObject["&:disabled"]
          }}
        >
          {children}
        </ElementState>
      );
    } else {
      return React.cloneElement(children, {
        ...children.props,
        ...attributes,
        style
      });
    }
  }
}

export default PseudoClasses;
