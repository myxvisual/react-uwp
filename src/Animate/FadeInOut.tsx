import * as React from "react";

import CustomAnimate, { CustomAnimateProps as CustomAnimateProps } from "./CustomAnimate";

export interface DataProps extends CustomAnimateProps {}

export class FadeInOut extends React.Component<DataProps> {
  static defaultProps: DataProps = {
    leaveStyle: { opacity: 0 },
    enterStyle: { opacity: 1 }
  };

  render() {
    return <CustomAnimate {...this.props} />;
  }
}

export default FadeInOut;
