import * as React from "react";

import Separator, { SeparatorProps } from "../Separator";

export interface AppBarSeparatorProps extends SeparatorProps {}

export default class AppBarSeparator extends React.Component<AppBarSeparatorProps, void> {
  render() {
    return (
      <Separator
        direction="column"
        style={{
          height: 28,
          width: 2,
          margin: "10px 0",
          ...this.props.style
        }}
      />
    );
  }
};
