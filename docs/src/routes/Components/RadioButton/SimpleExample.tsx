import * as React from "react";
import * as PropTypes from "prop-types";

import RadioButton from "react-uwp/RadioButton";

const baseStyle: React.CSSProperties = {
  margin: 10
};
export default class SimpleExample extends React.Component<{}, void> {
  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  render() {
    return (
      <div>
        <RadioButton isChecked style={baseStyle} label="Checked" />

        <RadioButton style={baseStyle} label="UnChecked" />

        <RadioButton style={baseStyle} label="Disabled" disabled />

        <RadioButton isChecked size={40} style={baseStyle} label="Custom Size" />
      </div>
    );
  }
}
