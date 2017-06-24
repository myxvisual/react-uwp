import * as React from "react";
import * as PropTypes from "prop-types";

import IconButton from "react-uwp/IconButton";

export default class SimpleExample extends React.Component {
  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  render() {
    const { theme } = this.context;
    return (
      <div>
        <IconButton>
          GlobalNavButton
        </IconButton>

        <IconButton disabled style={{ margin: 10 }}>
          SettingsLegacy
        </IconButton>

        <IconButton
          style={{ background: theme.listAccentLow, color: "#fff" }}
          hoverStyle={{ background: theme.listAccentHigh }}
          activeStyle={{ background: theme.accent }}
        >
          HeartFillLegacy
        </IconButton>
      </div>
    );
  }
}
