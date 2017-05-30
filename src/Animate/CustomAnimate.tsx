import * as React from "react";
import * as ReactTransitionGroup from "react-addons-transition-group";

import CustomAnimateChild from "./CustomAnimateChild";

export interface DataProps {
  appearAnimate?: boolean;
  childAttributes?: React.HTMLAttributes<HTMLDivElement>;
  enterDelay?: number;
  leaveDelay?: number;
  style?: React.CSSProperties;
  animateStyle?: React.CSSProperties;
  mode?: "in" | "out" | "both";
  speed?: number;
}

export interface CustomAnimateProps extends DataProps {
  [key: string]: any;
}

export default class CustomAnimate extends React.Component<CustomAnimateProps, void> {
  static defaultProps: CustomAnimateProps = {
    appearAnimate: true,
    children: <div>CustomAnimate</div>,
    enterDelay: 0,
    leaveDelay: 0,
    mode: "both",
    speed: 250
  };

  render() {
    const {
      appearAnimate,
      children,
      enterDelay,
      leaveDelay,
      mode,
      speed,
      style,
      animateStyle,
      ...others
    } = this.props;

    return (
      <ReactTransitionGroup {...others as any}>
        {React.Children.map(children, (child: any, index) => (
          <CustomAnimateChild
            key={child.key}
            enterDelay={enterDelay}
            leaveDelay={leaveDelay}
            mode={mode}
            speed={speed}
            appearAnimate={appearAnimate}
            style={style}
            animateStyle={animateStyle}
          >
            {child}
          </CustomAnimateChild>
        ))}
      </ReactTransitionGroup>
    );
  }
}
