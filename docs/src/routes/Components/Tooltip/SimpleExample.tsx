import * as React from "react";
import * as PropTypes from "prop-types";

import Tooltip from "react-uwp/Tooltip";

export default class SimpleExample extends React.Component<{}, void> {
  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  render() {
    return (
      <div>
        <Tooltip />
      </div>
    );
  }
}
