import * as React from "react";
import * as PropTypes from "prop-types";

export interface DataProps {
  width?: string | number;
  height?: string | number;
}

export interface IconLayoutProps extends DataProps, React.HTMLAttributes<SVGElement> {}

export default class IconLayout extends React.Component<IconLayoutProps> {
  static defaultProps: IconLayoutProps = {
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
        viewBox="0 0 168.57 116.41"
      >
        <rect fill={theme[theme.isDarkTheme ? "accentDarker1" : "accentLighter1"]} x="23.43" width="145.13" height="85.42" />
        <rect fill={theme.accent} y="42.33" width="89.2" height="60.47" />
        <rect fill={theme.chromeLow} x="79.37" y="61.23" width="36.28" height="55.18" />
      </svg>
    );
  }
}
