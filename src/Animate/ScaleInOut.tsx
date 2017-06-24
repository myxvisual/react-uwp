import * as React from "react";

import CustomAnimate, { CustomAnimateProps as CustomAnimateProps } from "./CustomAnimate";

export interface DataProps extends CustomAnimateProps {
  minScale?: number;
  maxScale?: number;
}

export class ScaleInOut extends React.Component<DataProps> {
  static defaultProps: DataProps = {
    leaveStyle: { transform: "scale(0)" },
    enterStyle: { transform: "scale(1)" }
  };

  render() {
    return <CustomAnimate {...this.props} />;
  }
}

export default ScaleInOut;
