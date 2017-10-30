import * as React from "react";
import * as PropTypes from "prop-types";

import Icon from "react-uwp/Icon";

export default class SimpleExample extends React.Component {
  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  render() {
    const { theme } = this.context;
    const style: React.CSSProperties = {
      fontSize: 24,
      color: theme.baseHigh,
      margin: 10,
      cursor: "default"
    };
    const hoverStyle: React.CSSProperties = {
      transform: "scale(1.25)",
      color: theme.accent
    };
    return (
      <div style={{ margin: "10px 0" }}>
        <Icon key="0" {...{ style, hoverStyle }}>HeartFillLegacy</Icon>
        <Icon key="1" {...{ style, hoverStyle }}>{"\uE001"}</Icon>
        <Icon key="2" {...{ style, hoverStyle }} useSVGElement>&#xE10F;</Icon>
      </div>
    );
  }
}
