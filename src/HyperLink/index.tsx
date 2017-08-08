import * as React from "react";
import * as PropTypes from "prop-types";

import Link from "../Link";
export interface DataProps {
  /**
   * `ref` to link, other attributes is applied to `HTMLAnchorElement`.
   */
  ref?: string;
  href?: string;
  target?: string;
}

export interface HyperLinkProps extends DataProps, React.HTMLAttributes<HTMLAnchorElement> {}

export class HyperLink extends React.Component<HyperLinkProps> {
  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  render() {
    return (
      <Link
        {...{
          style: { textDecoration: "underline", ...this.props.style },
          ...this.props
        }}
      />
    );
  }
}

export default HyperLink;
