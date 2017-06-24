import * as React from "react";
import * as PropTypes from "prop-types";

import ColorPicker from "react-uwp/ColorPicker";

export default class SimpleExample extends React.Component {
  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  render() {
    return (
      <div>
        <ColorPicker defaultColor="red" />
      </div>
    );
  }
}
