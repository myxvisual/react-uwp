import * as React from "react";

import CustomAnimate, { CustomAnimateProps as CustomAnimateProps } from "./CustomAnimate";

export interface DataProps extends CustomAnimateProps {
  position?: string;
  direction?: "top" | "bottom" | "left" | "right";
}

export class ScaleInOut extends React.Component<DataProps> {
  static defaultProps: DataProps = {
    position: "100%",
    direction: "bottom"
  };

  render() {
    const { position, direction, wrapperStyle, ...others } = this.props;
    return <CustomAnimate
      leaveStyle={{
        transform: `translate3d(0, ${position}, 0)`,
        opacity: 0
      }}
      enterStyle={{
        transform: `translate3d(0, 0, 0)`,
        opacity: 1
      }}
      wrapperStyle={{ overflow: "hidden", ...wrapperStyle }}
      {...others}
    />;
  }
}

export default ScaleInOut;
