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
  animatedStyle?: React.CSSProperties;
  mode?: "in" | "out" | "in-out";
  speed?: number;
  animate?: boolean;
  children?: any;
  useWrapper?: boolean;
  wrapperStyle?: React.CSSProperties;
  component?: any;
}

export interface CustomAnimateProps extends DataProps {}

function FirstChild(props: any) {
  const childrenArray = React.Children.toArray(props.children);
  return childrenArray[0] || null;
}
export default class CustomAnimate extends React.Component<CustomAnimateProps, void> {
  static defaultProps: CustomAnimateProps = {
    appearAnimate: true,
    enterDelay: 0,
    leaveDelay: 0,
    mode: "in-out",
    speed: 500,
    animate: void 0,
    component: "span",
    useWrapper: true
  };

  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };
  customAnimateChildArray: CustomAnimateChild[] = [];

  initializeAnimation = () => {
    for (const customAnimateChild of this.customAnimateChildArray) {
      customAnimateChild.initializeAnimation();
    }
  }

  animate = () => {
    for (const customAnimateChild of this.customAnimateChildArray) {
      customAnimateChild.animate();
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
      animatedStyle,
      animate,
      transitionTimingFunction,
      wrapperStyle,
      component,
      useWrapper,
      ...others
    } = this.props;

    return (
      <ReactTransitionGroup
        {...others as any}
        style={this.context.theme.prepareStyles({
          display: "inline-block",
          verticalAlign: "middle",
          overflow: "hidden",
          ...wrapperStyle
        })}
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
            style={style}
            animatedStyle={animatedStyle}
            animate={animate}
            transitionTimingFunction={transitionTimingFunction}
          >
            {child}
          </CustomAnimateChild>
        ))}
      </ReactTransitionGroup>
    );
  }
}

const slideBottomInProps = {
  style: {
    transform: "translateY(100%)",
    opacity: 0
  },
  animatedStyle: {
    transform: "translateY(0)",
    opacity: 1
  },
  speed: 500,
  useWrapper: true
};

const slideTopInProps = {
  style: {
    transform: "translateY(-100%)",
    opacity: 0
  },
  animatedStyle: {
    transform: "translateY(0)",
    opacity: 1
  },
  speed: 500,
  useWrapper: true
};

const slideLeftInProps = {
  style: {
    transform: "translateX(-100%)",
    opacity: 0
  },
  animatedStyle: {
    transform: "translateX(0)",
    opacity: 1
  },
  speed: 500,
  useWrapper: true
};

const slideRightInProps = {
  style: {
    transform: "translateX(100%)",
    opacity: 0
  },
  animatedStyle: {
    transform: "translateX(0)",
    opacity: 1
  },
  speed: 500,
  useWrapper: true
};

const scaleInProps = {
  style: {
    transform: "scale(0)",
    opacity: 0
  },
  animatedStyle: {
    transform: "scale(1)",
    opacity: 1
  },
  speed: 500,
  useWrapper: true
};

const fadeInProps = {
  style: {
    opacity: 0
  },
  animatedStyle: {
    opacity: 1
  },
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
