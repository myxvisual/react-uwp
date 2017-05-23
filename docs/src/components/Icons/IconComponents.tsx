import * as React from "react";
import * as PropTypes from "prop-types";

import ThemeType from "react-uwp/styles/ThemeType";

export interface DataProps {}

export interface IconComponentsProps extends DataProps, React.HTMLAttributes<SVGElement> {}

export default class IconComponents extends React.Component<IconComponentsProps, void> {
  static defaultProps: IconComponentsProps = {};

  static contextTypes = { theme: PropTypes.object };
  context: { theme: ThemeType };

  render() {
    const {
      ...attributes
    } = this.props;
    const { theme } = this.context;
    const styles = getStyles(this);

    return (
      <svg
        {...attributes}
        viewBox="0 0 123.97 78.61"
        style={styles.root}
      >
        <g>
          <rect
            fill="#4ec0f9"
            x="83.11"
            y="20.37"
            width="36.35"
            height="36.35"
          />
          <path
            fill="#171717"
            d="M115,24.87V52.23H87.61V24.87H115m9-9H78.61V61.23H124V15.87Z"
          />
          <rect
            fill="#008cff"
            opacity={0.75}
            x="22.68"
            width="78.61"
            height="78.61"
          />
          <rect
            fill="#134bb5"
            y="15.87"
            width="45.35"
            height="45.35"
          />
          <polyline
            fill="none"
            stroke="#171717"
            strokeMiterlimit="10"
            strokeWidth="11px"
            points="13.23 38.17 21.54 46.49 35.15 32.88"
          />
        </g>
      </svg>
    );
  }
}

function getStyles(iconComponents: IconComponents): {
  root?: React.CSSProperties;
} {
  const {
    context: { theme },
    props: { style }
  } = iconComponents;
  const { prepareStyles } = theme;

  return {
    root: prepareStyles({
      ...style
    })
  };
}
