import * as React from "react";
import * as PropTypes from "prop-types";

import IconButton from "react-uwp/IconButton";

export default class SimpleExample extends React.Component<{}, void> {
  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  render() {
    return (
      <div>
        <IconButton>Text</IconButton>
      </div>
    );
  }
}
