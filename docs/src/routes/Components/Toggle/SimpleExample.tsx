import * as React from "react";
import * as PropTypes from "prop-types";

import Toggle from "react-uwp/Toggle";

const baseStyle: React.CSSProperties = {
  margin: "10px 10px 10px 0"
};
export default class SimpleExample extends React.Component {
  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  render() {
    return (
      <div>
        <Toggle style={baseStyle} />

        <Toggle style={baseStyle} label="Toggle Button with Label" />

        <Toggle style={baseStyle} size={26} label="Custom Size" />
      </div>
    );
  }
}
