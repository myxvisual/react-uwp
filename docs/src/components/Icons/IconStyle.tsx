import * as React from "react";
import * as PropTypes from "prop-types";

export interface DataProps {
  width?: string | number;
  height?: string | number;
}

export interface IconStyleProps extends DataProps, React.HTMLAttributes<SVGElement> {}

export default class IconStyle extends React.Component<IconStyleProps> {
  static defaultProps: IconStyleProps = {
    width: 100
  };

  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  render() {
    const {
      ...attributes
    } = this.props;
    const { theme } = this.context;

    return (
      <svg
        {...attributes}
        viewBox="0 0 118.05 96.76"
      >
        <rect
          fill="none"
          stroke={theme.accent}
          strokeMiterlimit="10"
          strokeWidth="10px"
          x="68.45" y="26.46"
          width="44.6"
          height="44.6"
        />
        <rect fill={theme.chromeLow} x="38.97" width="53.67" height="53.67"/>
        <path fill={theme[theme.isDarkTheme ? "accentDarker1" : "accentLighter1"]} d="M38.38,26H26.94L0,96.76H12.92l6.51-18.53H45.51l6.91,18.53h12.9ZM32.44,42.1l9.25,25.45H23.27Z"/>
      </svg>
    );
  }
}
