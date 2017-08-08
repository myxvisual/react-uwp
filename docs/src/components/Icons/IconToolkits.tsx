import * as React from "react";
import * as PropTypes from "prop-types";

export interface DataProps {
  width?: string | number;
  height?: string | number;
}

export interface IconToolkitsProps extends DataProps, React.HTMLAttributes<SVGElement> {}

export default class IconToolkits extends React.Component<IconToolkitsProps> {
  static defaultProps: IconToolkitsProps = {
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
        <rect fill={theme.accent} y="15.12" width="67.27" height="79.37" />
        <polygon fill={theme.chromeLow} points="67.28 0 19.65 0 19.65 80.88 86.93 80.88 86.93 19.65 67.28 0" />
        <rect fill={theme[theme.isDarkTheme ? "accentDarker1" : "accentLighter1"]} x="78.54" y="57.43" width="51.4" height="51.4" />
        <polygon fill={theme.altHigh} points="113.78 78.22 108.2 83.79 108.2 67.28 100.27 67.28 100.27 83.79 94.7 78.22 89.09 83.83 104.24 98.98 119.39 83.83 113.78 78.22" />
      </svg>
    );
  }
}
