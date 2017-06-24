import * as React from "react";
import * as PropTypes from "prop-types";

import ProgressBar from "react-uwp/ProgressBar";

const baseStyle: React.CSSProperties = {
  margin: "10px 0",
  display: "block"
};
export default class SimpleExample extends React.Component {
  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  render() {
    return (
      <div>
        <ProgressBar style={baseStyle} />
        <ProgressBar isIndeterminate style={baseStyle} />
      </div>
    );
  }
}
