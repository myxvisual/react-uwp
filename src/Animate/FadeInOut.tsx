import * as React from "react";

import CustomAnimate, { DataProps as CustomAnimateProps } from "./CustomAnimate";

export interface DataProps extends CustomAnimateProps {}

export class FadeInOut extends React.Component<DataProps, void> {
  static defaultProps: DataProps = {
    style: { opacity: 0 },
    animatedStyle: { opacity: 1 }
  };

  render() {
    return <CustomAnimate {...this.props} />;
  }
}

export default FadeInOut;
