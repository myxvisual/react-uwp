import * as React from "react";
import Link, { LinkProps } from "../Link";

export class HyperLink extends React.PureComponent<LinkProps, void> {
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
