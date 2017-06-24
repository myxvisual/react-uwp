import * as React from "react";
import * as PropTypes from "prop-types";

import Button from "react-uwp/Button";

export default class SimpleExample extends React.Component {
  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };
  render() {
    const baseStyle: React.CSSProperties = {
      margin: "10px 10px 10px 0"
    };
    const { theme } = this.context;
    return (
      <div>
        <Button style={baseStyle}>
          Button
        </Button>

        <Button style={baseStyle} disabled>
          Disable Button
        </Button>

        <Button style={baseStyle} tooltip="Tooltip">
          Tooltip Button
        </Button>

        <Button
          style={{
            border: `2px solid ${theme.listLow}`,
            ...baseStyle
          }}
          background="none"
          activeStyle={{
            background: "none",
            border: `2px solid ${theme.baseMedium}`
          }}
        >
          Button without Background
        </Button>
      </div>
    );
  }
}
