import * as React from "react";
import * as PropTypes from "prop-types";

import Icon from "react-uwp/Icon";

export default class SimpleExample extends React.Component<{}, void> {
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
      fontSize: 32,
      color: theme.accent
    };
    return (
      <div>
        <Icon {...{ style, hoverStyle }}>HeartFillLegacy</Icon>
        <Icon {...{ style, hoverStyle }}>{"\uE001"}</Icon>
        <Icon {...{ style, hoverStyle }}>&#xE10F;</Icon>
      </div>
    );
  }
}
