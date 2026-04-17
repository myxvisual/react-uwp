import * as React from "react";

import Separator, { SeparatorProps } from "./Separator";

export interface AppBarSeparatorProps extends SeparatorProps {}

const AppBarSeparator: React.FC<AppBarSeparatorProps> = (props) => {
  const { direction = "column", style, ...attributes } = props;
  return (
    <Separator
      direction={direction}
      style={{
        margin: "10px 0",
        ...style
      }}
      {...attributes}
    />
  );
};

export default AppBarSeparator;
