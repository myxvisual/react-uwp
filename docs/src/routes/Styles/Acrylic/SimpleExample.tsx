import * as React from "react";
import * as PropTypes from "prop-types";

import AutoSuggestBox from "react-uwp/AutoSuggestBox";

export default class SimpleExample extends React.Component {
  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  render() {
    const { theme } = this.context;
    const itemStyle: React.CSSProperties = {
      color: theme.baseHigh,
      fontSize: 14,
      fontWeight: "lighter",
      textAlign: "center",
      width: 320,
      height: 320,
      lineHeight: "320px",
      margin: 10,
      outline: "none",
      border: `1px solid ${theme.listAccentLow}`
    };
    return (
      <div
        style={theme.prefixStyle({
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          flexWrap: "wrap",
          width: "100%",
          padding: "160px 0",
          background: theme.desktopBackground
        })}
      >
        <span style={{ ...itemStyle, background: theme.acrylicTexture40.background }}>
          theme.acrylicTexture40.background
        </span>
        <span style={{ ...itemStyle, background: theme.acrylicTexture60.background }}>
          theme.acrylicTexture60.background
        </span>
        <span style={{ ...itemStyle, background: theme.acrylicTexture80.background }}>
          theme.acrylicTexture80.background
        </span>
      </div>
    );
  }
}
