import { useTheme } from './hooks/useTheme';
import * as React from "react";

import CustomAnimate, { CustomAnimateProps as CustomAnimateProps } from "./Animate.CustomAnimate";

export interface DataProps extends CustomAnimateProps {
  minScale?: number;
  maxScale?: number;
}

const ScaleInOut: React.FC<DataProps> = ({
  leaveStyle = { transform: "scale(0)" },
  enterStyle = { transform: "scale(1)" },
  ...props
}) => {
  return <CustomAnimate leaveStyle={leaveStyle} enterStyle={enterStyle} {...props} />;
}

export default ScaleInOut;
