import * as React from "react";
import * as PropTypes from "prop-types";

import Button from "react-uwp/Button";

export default class SimpleExample extends React.Component {
  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  render() {
    const { theme } = this.context;
    return (
      <div>
        <Button>Normal Button</Button>

        <Button
          style={{
            padding: 20,
            width: 320,
            color: "#fff",
            margin: 10,
            background: theme.listAccentLow
          }}
          hoverStyle={{
            background: theme.accent
          }}
        >
          Custom Style Button
        </Button>
      </div>
    );
  }
}
