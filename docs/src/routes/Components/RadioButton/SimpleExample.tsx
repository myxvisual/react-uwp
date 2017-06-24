import * as React from "react";
import * as PropTypes from "prop-types";

import RadioButton from "react-uwp/RadioButton";

const baseStyle: React.CSSProperties = {
  margin: "10px 10px 10px 0"
};
export default class SimpleExample extends React.Component {
  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  render() {
    return (
      <div>
        <RadioButton defaultChecked style={baseStyle} label="Checked" />

        <RadioButton style={baseStyle} label="UnChecked" />

        <RadioButton style={baseStyle} label="Disabled" disabled />

        <RadioButton defaultChecked size={40} style={baseStyle} label="Custom Size" />
      </div>
    );
  }
}
