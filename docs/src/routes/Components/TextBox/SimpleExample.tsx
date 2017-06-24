import * as React from "react";
import * as PropTypes from "prop-types";

import TextBox from "react-uwp/TextBox";
import Icon from "react-uwp/Icon";

const baseStyle: React.CSSProperties = {
  margin: "10px 0"
};
export default class SimpleExample extends React.Component {
  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  render() {
    return (
      <div>
        <TextBox
          style={baseStyle}
          placeholder="TextBox with PlaceHolder"
        />

        <TextBox
          style={baseStyle}
          background="none"
          defaultValue="Default Value"
        />

        <TextBox
          style={baseStyle}
          background="none"
          placeholder="TextBox with Left Node"
          leftNode={<Icon style={{ margin: "0 8px" }}>HeartFillLegacy</Icon>}
        />

        <TextBox
          style={baseStyle}
          background="none"
          placeholder="TextBox with Right Node"
          rightNode={<Icon style={{ margin: "0 8px" }}>Emoji2Legacy</Icon>}
        />

        <TextBox
          style={baseStyle}
          placeholder="TextBox with Two Nodes"
          leftNode={<Icon style={{ margin: "0 4px" }}>HeartFillLegacy</Icon>}
          rightNode={<Icon style={{ margin: "0 4px" }}>Emoji2Legacy</Icon>}
        />
      </div>
    );
  }
}
