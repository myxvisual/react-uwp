import { useTheme } from './hooks/useTheme';
import * as React from "react";

import CustomAnimate, { CustomAnimateProps as CustomAnimateProps } from "./Animate.CustomAnimate";

export interface DataProps extends CustomAnimateProps {
  position?: string;
  direction?: "top" | "bottom" | "left" | "right";
}

const SlideInOut: React.FC<DataProps> = ({
  position = "100%",
  direction = "bottom",
  wrapperStyle,
  ...others
}) => {
  const getTransform = () => {
    switch(direction) {
      case "top":
      case "bottom":
        return `translate3d(0, ${position}, 0)`;
      case "left":
      case "right":
        return `translate3d(${position}, 0, 0)`;
      default:
        return `translate3d(0, ${position}, 0)`;
    }
  };

  return <CustomAnimate
    leaveStyle={{
      transform: getTransform(),
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

export default SlideInOut;
