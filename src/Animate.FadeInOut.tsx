import { useTheme } from './hooks/useTheme';
import * as React from "react";

import CustomAnimate, { CustomAnimateProps as CustomAnimateProps } from "./Animate.CustomAnimate";

export interface DataProps extends CustomAnimateProps {}

const FadeInOut: React.FC<DataProps> = ({
  leaveStyle = { opacity: 0 },
  enterStyle = { opacity: 1 },
  ...props
}) => {
  return <CustomAnimate leaveStyle={leaveStyle} enterStyle={enterStyle} {...props} />;
}

export default FadeInOut;
