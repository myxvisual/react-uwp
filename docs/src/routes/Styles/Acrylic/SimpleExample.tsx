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
    const styles = {
      root: theme.prefixStyle({
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        flexWrap: "wrap",
        width: "100%",
        padding: "160px 0",
        background: theme.desktopBackground
      }),
      acrylic20: { ...itemStyle, ...theme.acrylicTexture20.style },
      acrylic40: { ...itemStyle, ...theme.acrylicTexture40.style },
      acrylic60: { ...itemStyle, ...theme.acrylicTexture60.style },
      acrylic80: { ...itemStyle, ...theme.acrylicTexture80.style },
      acrylic100: { ...itemStyle, ...theme.acrylicTexture100.style }
    };
    const classes = theme.prepareStyles({ styles });

    return (
      <div {...classes.root}>
        <span {...classes.acrylic20}>
          theme.acrylicTexture20.style
        </span>
        <span {...classes.acrylic40}>
          theme.acrylicTexture40.style
        </span>
        <span {...classes.acrylic60}>
          theme.acrylicTexture60.style
        </span>
        <span {...classes.acrylic80}>
          theme.acrylicTexture80.style
        </span>
        <span {...classes.acrylic100}>
          theme.acrylicTexture100.style
        </span>
      </div>
    );
  }
}
