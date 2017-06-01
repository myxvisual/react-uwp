import * as React from "react";
import * as PropTypes from "prop-types";

import ElementState from "../ElementState";
import Icon from "../Icon";

export interface DataProps {
  hoverStyle?: React.CSSProperties;
  activeStyle?: React.CSSProperties;
  size?: number;
  disabled?: boolean;
}

export interface IconButtonProps extends DataProps, React.HTMLAttributes<HTMLButtonElement> {}

export default class IconButton extends React.Component<IconButtonProps, void> {
  static defaultProps: IconButtonProps = {
    size: 48
  };
  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  render() {
    const {
      style,
      hoverStyle,
      activeStyle,
      children,
      size,
      disabled,
      ...attributes
    } = this.props;
    const { theme } = this.context;

    return (
      <ElementState
        {...attributes}
        style={{
          display: "inline-block",
          fontFamily: "Segoe MDL2 Assets",
          transition: "background .25s 0s ease-in-out",
          userSelect: "none",
          background: "none",
          border: "none",
          outline: "none",
          fontSize: size / 2,
          width: size,
          height: size,
          cursor: "pointer",
          color: theme.baseHigh,
          padding: 4,
          flexShrink: 0,
          ...style
        }}
        hoverStyle={disabled ? void 0 : hoverStyle || {
          background: theme.listLow
        }}
        activeStyle={disabled ? void 0 : activeStyle || {
          background: theme.baseLow
        }}
      >
        <button>
          <Icon>{children}</Icon>
        </button>
      </ElementState>
    );
  }
}
