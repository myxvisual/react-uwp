import * as React from "react";
import { TransitionGroup as ReactTransitionGroup } from "react-transition-group";
import * as PropTypes from "prop-types";

import CustomAnimateChild from "./CustomAnimateChild";

export interface DataProps {
  transitionTimingFunction?: string;
  appearAnimate?: boolean;
  enterDelay?: number;
  leaveDelay?: number;
  style?: React.CSSProperties;
  leaveStyle?: React.CSSProperties;
  enterStyle?: React.CSSProperties;
  mode?: "in" | "out" | "in-out";
  speed?: number;
  children?: any;
  useWrapper?: boolean;
  wrapperStyle?: React.CSSProperties;
  component?: any;
}

export interface CustomAnimateProps extends DataProps {}

const baseStyle = {
  display: "inline-block",
  verticalAlign: "middle"
};

function FirstChild(props: any) {
  const childrenArray = React.Children.toArray(props.children);
  return childrenArray[0] || null;
}
export class CustomAnimate extends React.Component<CustomAnimateProps, void> {
  static defaultProps: CustomAnimateProps = {
    appearAnimate: true,
    enterDelay: 0,
    leaveDelay: 0,
    mode: "in-out",
    speed: 500,
    component: "span",
    useWrapper: true
  };

  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };
  customAnimateChildArray: CustomAnimateChild[] = [];

  setLeaveStyle = () => {
    for (const customAnimateChild of this.customAnimateChildArray) {
      customAnimateChild.setLeaveStyle();
    }
  }

  setEnterStyle = () => {
    for (const customAnimateChild of this.customAnimateChildArray) {
      customAnimateChild.setEnterStyle();
    }
  }

  render() {
    const {
      appearAnimate,
      children,
      enterDelay,
      leaveDelay,
      mode,
      speed,
      style,
      leaveStyle,
      enterStyle,
      transitionTimingFunction,
      wrapperStyle,
      component,
      useWrapper,
      ...others
    } = this.props;

    return (
      <ReactTransitionGroup
        {...others as any}
        style={{
          ...baseStyle,
          ...(useWrapper ? wrapperStyle : leaveStyle)
        }}
        component={useWrapper ? component : FirstChild}
      >
        {React.Children.map(children, (child: any, index) => (
          <CustomAnimateChild
            ref={customAnimateChild => this.customAnimateChildArray[index] = customAnimateChild}
            key={child.key}
            enterDelay={enterDelay}
            leaveDelay={leaveDelay}
            mode={mode}
            speed={speed}
            appearAnimate={appearAnimate}
            leaveStyle={style ? { ...style, ...leaveStyle } : leaveStyle}
            enterStyle={style ? { ...style, ...enterStyle } : enterStyle}
            transitionTimingFunction={transitionTimingFunction}
          >
            {useWrapper ? <span style={{ ...baseStyle, width: "100%" }}>
              {child}
            </span> : child}
          </CustomAnimateChild>
        ))}
      </ReactTransitionGroup>
    );
  }
}

const slideBottomInProps: CustomAnimateProps = {
  leaveStyle: {
    transform: "translateY(100%)",
    opacity: 0
  },
  enterStyle: {
    transform: "translateY(0)",
    opacity: 1
  },
  wrapperStyle: { overflow: "hidden" },
  speed: 500,
  useWrapper: true
} as CustomAnimateProps;

const slideTopInProps: CustomAnimateProps = {
  leaveStyle: {
    transform: "translateY(-100%)",
    opacity: 0
  },
  enterStyle: {
    transform: "translateY(0)",
    opacity: 1
  },
  wrapperStyle: { overflow: "hidden" },
  speed: 500,
  useWrapper: true
} as CustomAnimateProps;

const slideLeftInProps: CustomAnimateProps = {
  leaveStyle: {
    transform: "translateX(-100%)",
    opacity: 0
  },
  enterStyle: {
    transform: "translateX(0)",
    opacity: 1
  },
  wrapperStyle: { overflow: "hidden" },
  speed: 500,
  useWrapper: true
};

const slideRightInProps: CustomAnimateProps = {
  leaveStyle: {
    transform: "translateX(100%)",
    opacity: 0
  },
  enterStyle: {
    transform: "translateX(0)",
    opacity: 1
  },
  wrapperStyle: { overflow: "hidden" },
  appearAnimate: true,
  speed: 500,
  useWrapper: true
};

const scaleInProps: CustomAnimateProps = {
  leaveStyle: {
    transform: "scale(0)",
    opacity: 0
  },
  enterStyle: {
    transform: "scale(1)",
    opacity: 1
  },
  appearAnimate: true,
  speed: 500,
  useWrapper: true
};

const fadeInProps: CustomAnimateProps = {
  leaveStyle: {
    opacity: 0
  },
  enterStyle: {
    opacity: 1
  },
  appearAnimate: true,
  speed: 500,
  useWrapper: true
};

export {
  fadeInProps,
  scaleInProps,
  slideTopInProps,
  slideBottomInProps,
  slideLeftInProps,
  slideRightInProps
};

export default CustomAnimate;
