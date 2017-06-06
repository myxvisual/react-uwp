import * as React from "react";
import * as PropTypes from "prop-types";

import FloatNav from "react-uwp/FloatNav";

export default class SimpleExample extends React.Component<{}, void> {
  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  render() {
    return (
      <div>
        <FloatNav />
      </div>
    );
  }
}
