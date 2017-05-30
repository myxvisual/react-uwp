import * as React from "react";

import CustomAnimate, { DataProps as CustomAnimateProps } from "./CustomAnimate";

export interface DataProps extends CustomAnimateProps {
  minScale?: number;
  maxScale?: number;
}

export class ScaleInOut extends React.Component<DataProps, void> {
  static defaultProps: DataProps = {
    style: { transform: "scale(0)" },
    animatedStyle: { transform: "scale(1)" }
  };

  render() {
    return <CustomAnimate {...this.props} />;
  }
}

export default ScaleInOut;
