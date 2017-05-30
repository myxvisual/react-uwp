import * as React from "react";
import * as PropTypes from "prop-types";

import Link, { LinkProps } from "../Link";

export class HyperLink extends React.Component<LinkProps, void> {
  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  render() {
    return (
      <Link
        {...{
          style: { textDecoration: "underline" },
          ...this.props
        }}
      />
    );
  }
}

export default HyperLink;
