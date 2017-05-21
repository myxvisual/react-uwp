import * as React from "react";

import Button from "react-uwp/Button";

export default class SimpleExample extends React.Component<{}, void> {
  render() {
    const defaultBtnStyle: React.CSSProperties = {
      margin: 4
    };
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
      </div>
    );
  }
}
