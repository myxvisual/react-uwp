import * as React from "react";
import * as PropTypes from "prop-types";

import AppBarButton, { DataProps as AppBarButtonProps } from "react-uwp/AppBarButton";
export default class SimpleExample extends React.Component<{}, void> {
  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  render() {
    const { theme } = this.context;

    const baseStyle: React.CSSProperties = {
      background: theme.chromeLow,
      margin: 8
    };
    return (
      <div>
        <AppBarButton
          style={baseStyle}
          icon="Shuffle"
          label="Shuffle"
        />

        <AppBarButton
          style={baseStyle}
          icon="HeartFillLegacy"
          label="Love"
          labelPosition="right"
          hoverStyle={{ background: "yellowgreen" }}
        />

        <AppBarButton
          style={baseStyle}
          icon="EmojiLegacy"
          label="Emoji"
          labelPosition="collapsed"
        />
      </div>
    );
  }
}
