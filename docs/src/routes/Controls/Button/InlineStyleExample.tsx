import * as React from "react";

import Button from "react-uwp/src/controls/Button";

export default class InlineStyleExample extends React.PureComponent<void, void> {
  render() {
    const defaultBtnStyle: React.CSSProperties = {
      margin: 4
    };
    return (
      <div>
        <Button style={{ fontSize: 12, padding: "2px 4px", ...defaultBtnStyle }}>
          Small Button 
        </Button>
        <Button style={{ ...defaultBtnStyle }}>
          Button
        </Button>
        <Button style={{ fontSize: 32, ...defaultBtnStyle }}>
          Big Button
        </Button>
      </div>
    );
  }
}
