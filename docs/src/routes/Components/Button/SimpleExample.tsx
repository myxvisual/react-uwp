import * as React from "react";
import * as PropTypes from "prop-types";

import Button from "react-uwp/Button";

export default class SimpleExample extends React.Component<{}, void> {
  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };
  render() {
    const defaultBtnStyle: React.CSSProperties = {
      margin: 4
    };
    const { theme } = this.context;
    return (
      <div>
        <Button style={defaultBtnStyle}>
          Button
        </Button>

        <Button style={defaultBtnStyle} disabled>
          Disable Button
        </Button>

        <Button style={defaultBtnStyle} tooltip="Tooltip">
          Tooltip Button
        </Button>

        <Button
          style={{
            border: `2px solid ${theme.listLow}`,
            ...defaultBtnStyle
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
