import * as React from "react";
import * as PropTypes from "prop-types";

import ElementState from "../ElementState";

import iconsType from "./icons";
const icons: {
  [key: string]: string;
} = iconsType;

export interface DataProps {
  hoverStyle?: React.CSSProperties;
}
export interface IconProps extends DataProps, React.HTMLAttributes<HTMLSpanElement> {}
export interface IconState {
 hovered?: boolean;
}

const emptyFunc = () => {};
export default class Icon extends React.Component<IconProps, IconState> {
  static defaultProps: IconProps = {
    onMouseEnter: emptyFunc,
    onMouseLeave: emptyFunc
  };

  state: IconState = {
    hovered: false
  };

  context: { theme: ReactUWP.ThemeType };
  static contextTypes = { theme: PropTypes.object };

  handleMouseEnter = (e: React.MouseEvent<HTMLSpanElement>) => {
    this.props.onMouseEnter(e);
    this.setState({
      hovered: true
    });
  }

  handleMouseLeave = (e: React.MouseEvent<HTMLSpanElement>) => {
    this.props.onMouseLeave(e);
    this.setState({
      hovered: false
    });
  }

  render() {
    const { style, hoverStyle, children, ...attributes } = this.props;
    const { theme } = this.context;
    const { hovered } = this.state;

    return (
      <span
        {...attributes}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        style={theme.prepareStyles({
          textAlign: "center",
          fontFamily: theme.iconFontFamily,
          transition: "all .25s",
          border: "none",
          outline: "none",
          userSelect: "none",
          lineHeight: style ? (
            typeof style.height === "number" ? `${style.height}px` : style.height
          ) : void 0,
          fontSize: "inherit",
          cursor: "inherit",
          color: "inherit",
          ...(hovered ? hoverStyle : {}),
          ...style
        })}
      >
        {icons[children as any] || children}
      </span>
    );
  }
}

export { icons, Icon };

