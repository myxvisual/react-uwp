import * as React from "react";

import Separator, { SeparatorProps } from "../Separator";

export interface AppBarSeparatorProps extends SeparatorProps {}

export default class AppBarSeparator extends React.Component<AppBarSeparatorProps, void> {
  static defaultProps: AppBarSeparatorProps = {
    direction: "column"
  };

  render() {
    return (
      <Separator
        direction={this.props.direction}
        style={{
          margin: "10px 0",
          ...this.props.style
        }}
      />
    );
  }
}
