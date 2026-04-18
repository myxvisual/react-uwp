import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import { TransitionGroup as ReactTransitionGroup } from "react-transition-group";

import CustomAnimateChild from "./Animate.CustomAnimateChild";

export interface DataProps {
  /**
   * If true, animate in end component `componentDidAppear`.
   */
  appearAnimate?: boolean;
  /**
   * Set component animate mode, if `in`, animate just run on component end in.
   */
  mode?: "in" | "out" | "in-out";
  /**
   * Set component leave style.
   */
  leaveStyle?: React.CSSProperties;
  /**
   * Set component enter style.
   */
  enterStyle?: React.CSSProperties;
  /**
   * Set animation speed.
   */
  speed?: number;
  /**
   * Set transitionTimingFunction for animation.
   */
  transitionTimingFunction?: string;
  /**
   * Set animate `enter` delay.
   */
  enterDelay?: number;
  /**
   * Set animate `leave` delay.
   */
  leaveDelay?: number;
  /**
   * Set wrapper component.
   */
  component?: any;
  /**
   * Add `Wrapper` element for component.
   */
  useWrapper?: boolean;
  /**
   * set `Wrapper` element style.
   */
  wrapperStyle?: React.CSSProperties;
  /**
   * set to root element style.
   */
  style?: React.CSSProperties;
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
export interface CustomAnimateHandle {
  setLeaveStyle: () => void;
  setEnterStyle: () => void;
}

const CustomAnimate = forwardRef<CustomAnimateHandle, CustomAnimateProps>((props, ref) => {
  const {
    leaveStyle = { opacity: 0 },
    enterStyle = { opacity: 1 },
    appearAnimate = true,
    enterDelay = 0,
    leaveDelay = 0,
    mode = "in-out",
    speed = 500,
    component = "span",
    useWrapper = true,
    children,
    style,
    transitionTimingFunction,
    wrapperStyle,
    ...others
  } = props;

  const customAnimateChildArray = useRef<CustomAnimateChild[]>([]);

  // 暴露实例方法
  useImperativeHandle(ref, () => ({
    setLeaveStyle: () => {
      customAnimateChildArray.current.forEach(child => child.setLeaveStyle());
    },
    setEnterStyle: () => {
      customAnimateChildArray.current.forEach(child => child.setEnterStyle());
    }
  }));

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
          ref={customAnimateChild => {
            if (customAnimateChild) {
              customAnimateChildArray.current[index] = customAnimateChild;
            }
          }}
          key={child.key}
          enterDelay={enterDelay}
          leaveDelay={leaveDelay}
          mode={mode}
          style={style}
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
});

CustomAnimate.displayName = 'CustomAnimate';

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
