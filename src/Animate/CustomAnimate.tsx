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
  wrapperStyle?: React.CSSProperties;
  component?: any;
}

export interface CustomAnimateProps extends DataProps {}

export default class CustomAnimate extends React.Component<CustomAnimateProps, void> {
  static defaultProps: CustomAnimateProps = {
    appearAnimate: true,
    children: <span>CustomAnimate</span>,
    enterDelay: 0,
    leaveDelay: 0,
    mode: "in-out",
    speed: 500,
    animate: void 0,
    component: "span"
  };

  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };
  customAnimateChild: CustomAnimateChild;

  initializeAnimation = () => {
    this.customAnimateChild.initializeAnimation();
  }

  animate = () => {
    this.customAnimateChild.animate();
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
      ...others
    } = this.props;

    return (
      <ReactTransitionGroup
        {...others as any}
        style={this.context.theme.prepareStyles({ overflow: "hidden", ...wrapperStyle })}
        component={component}
      >
        {React.Children.map(children, (child: any, index) => (
          <CustomAnimateChild
            ref={customAnimateChild => this.customAnimateChild = customAnimateChild}
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
