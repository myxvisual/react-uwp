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
  useSingleChild?: boolean;
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
    useSingleChild: false
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
      useSingleChild,
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
        component={useSingleChild ? FirstChild : component}
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
