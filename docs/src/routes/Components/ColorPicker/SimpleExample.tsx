import * as React from "react";
import * as PropTypes from "prop-types";

import ColorPicker from "react-uwp/ColorPicker";

export default class SimpleExample extends React.Component<{}, void> {
  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  render() {
    return (
      <div
        style={this.context.theme.prepareStyles({
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end"
          })
        }
      >
        <ColorPicker size={100} defaultColor="yellowgreen" />
        <ColorPicker size={200} defaultColor="blue" />
        <ColorPicker defaultColor="red" />
      </div>
    );
  }
}
