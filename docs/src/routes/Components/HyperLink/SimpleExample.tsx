import * as React from "react";
import * as PropTypes from "prop-types";

import HyperLink from "react-uwp/HyperLink";

export default class SimpleExample extends React.Component {
  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  render() {
    return (
      <HyperLink style={{ margin: "10px 0" }} href="/" target="_blank">
        Link to Home Page
      </HyperLink>
    );
  }
}
