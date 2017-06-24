import * as React from "react";
import * as PropTypes from "prop-types";

import TimePicker from "react-uwp/TimePicker";

export default class SimpleExample extends React.Component {
  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  render() {
    return (
      <div>
        <TimePicker />
      </div>
    );
  }
}
