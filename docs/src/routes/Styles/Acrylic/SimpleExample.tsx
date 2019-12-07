import * as React from "react";
import * as PropTypes from "prop-types";

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
      width: 200,
      height: 200,
      lineHeight: "200px",
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
        <span style={{ ...itemStyle, ...theme.acrylicTexture20.style }}>
          theme.acrylicTexture20.style
        </span>
        <span style={{ ...itemStyle, ...theme.acrylicTexture40.style }}>
          theme.acrylicTexture40.style
        </span>
        <span style={{ ...itemStyle, ...theme.acrylicTexture60.style }}>
          theme.acrylicTexture60.style
        </span>
        <span style={{ ...itemStyle, ...theme.acrylicTexture80.style }}>
          theme.acrylicTexture80.style
        </span>
        <span style={{ ...itemStyle, ...theme.acrylicTexture100.style }}>
          theme.acrylicTexture100.style
        </span>
      </div>
    );
  }
}
