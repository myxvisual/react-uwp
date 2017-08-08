import * as React from "react";
import * as PropTypes from "prop-types";

export interface DataProps {
  width?: string | number;
  height?: string | number;
}

export interface IconComponentsProps extends DataProps, React.HTMLAttributes<SVGElement> {}

export default class IconComponents extends React.Component<IconComponentsProps> {
  static defaultProps: IconComponentsProps = {
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
        viewBox="0 0 123.97 78.61"
    >
        <rect
          fill={theme.accent}
          x="83.11"
          y="20.37"
          width="36.35"
          height="36.35"
        />
        <path
          fill={theme.altMedium}
          d="M115,24.87V52.23H87.61V24.87H115m9-9H78.61V61.23H124V15.87Z"
        />
        <rect
          fill={theme.accent}
          opacity={0.75}
          x="22.68"
          width="78.61"
          height="78.61"
        />
        <rect
          fill={theme[theme.isDarkTheme ? "accentDarker1" : "accentLighter1"]}
          y="15.87"
          width="45.35"
          height="45.35"
        />
        <polyline
          fill="none"
          stroke={theme.altHigh}
          strokeMiterlimit="10"
          strokeWidth="11px"
          points="13.23 38.17 21.54 46.49 35.15 32.88"
        />
      </svg>
    );
  }
}
