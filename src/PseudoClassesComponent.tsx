import * as React from "react";
import * as PropTypes from "prop-types";

import ElementState, { ElementStateProps } from "./ElementState";
import spreadObject from "./common/spreadObject";

const pseudoClassesNames = ["&:hover", "&:active", "&:visited", "&:focus", "&:disabled"];

export class PseudoClassesComponent extends React.Component<any> {
  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  render () {
    const { style, children, ...attributes } = this.props;

    if (style) {
      const { primaryObject, secondaryObject } = spreadObject(this.props, pseudoClassesNames);
      return (
        <ElementState
          {...attributes}
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
      return (
        <ElementState {...attributes}>
          {children}
        </ElementState>
      );
    }
  }
}

export default PseudoClassesComponent;
