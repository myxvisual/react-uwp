import * as React from "react";
import * as PropTypes from "prop-types";

import ProgressBar from "react-uwp/ProgressBar";

export default class SimpleExample extends React.Component<{}, void> {
  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  render() {
    return <ProgressBar />;
  }
}
