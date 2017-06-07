import * as React from "react";

import CustomAnimate, { DataProps as CustomAnimateProps } from "./CustomAnimate";

export interface DataProps extends CustomAnimateProps {
  position?: string;
  direction?: "top" | "bottom" | "left" | "right";
}

export class ScaleInOut extends React.Component<DataProps, void> {
  static defaultProps: DataProps = {
    position: "100%",
    direction: "bottom"
  };

  render() {
    const { position, direction, ...others } = this.props;
    return <CustomAnimate
      style={{
        transform: `translate3d(0, ${position}, 0)`
      }}
      animatedStyle={{
        transform: `translate3d(0, 0, 0)`
      }}
      {...others}
    />;
  }
}

export default ScaleInOut;
