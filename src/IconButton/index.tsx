import * as React from "react";
import * as PropTypes from "prop-types";

import ElementState from "../ElementState";
import Icon from "../Icon";

export interface DataProps {
  hoverStyle?: React.CSSProperties;
  activeStyle?: React.CSSProperties;
  size?: number;
}

export interface IconButtonProps extends DataProps, React.HTMLAttributes<HTMLButtonElement> {}

export default class IconButton extends React.Component<IconButtonProps, void> {
  static defaultProps: IconButtonProps = {
    size: 48
  };
  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  render() {
    const { style, hoverStyle, activeStyle, children, size, ...attributes } = this.props;
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
        hoverStyle={{
          background: theme[theme.isDarkTheme ? "accentDarker1" : "accentLighter1"],
          ...hoverStyle
        }}
        activeStyle={{
          background: theme.accent,
          color: "#fff",
          ...activeStyle
        }}
      >
        <button>
          <Icon>{children}</Icon>
        </button>
      </ElementState>
    );
  }
}
