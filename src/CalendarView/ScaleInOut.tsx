import * as React from "react";
import { TransitionGroup as ReactTransitionGroup } from "react-transition-group";

import ScaleInOutChild from "./ScaleInOutChild";

export interface DataProps {
  [key: string]: any;
}
export interface ScaleInOutProps extends DataProps {
  appearAnimate?: boolean;
  childAttributes?: React.HTMLAttributes<HTMLDivElement>;
  enterDelay?: number;
  leaveDelay?: number;
  maxScale?: number;
  minScale?: number;
  mode?: "in" | "out" | "both";
  speed?: number;
}

export interface ScaleInOutState {}

export default class ScaleInOut extends React.Component<ScaleInOutProps, ScaleInOutState> {
  static defaultProps: ScaleInOutProps = {
    appearAnimate: true,
    children: <div>ScaleInOut</div>,
    enterDelay: 0,
    leaveDelay: 0,
    maxScale: 1,
    minScale: 0,
    mode: "both",
    speed: 500
  };

  render() {
    const {
      appearAnimate,
      childAttributes,
      children,
      enterDelay,
      leaveDelay,
      maxScale,
      minScale,
      mode,
      speed,
      style,
      ...others
    } = this.props;
    const styles = getStyles(this);

    return (
      <ReactTransitionGroup
        {...others as any}
        style={styles.root}
        component="div"
      >
        {React.Children.map(children, (child: any, index) => (
          <ScaleInOutChild
            key={child.key}
            minScale={minScale}
            maxScale={maxScale}
            enterDelay={enterDelay}
            leaveDelay={leaveDelay}
            mode={mode}
            speed={speed}
            appearAnimate={appearAnimate}
            {...childAttributes}
          >
            {child}
          </ScaleInOutChild>
        ))}
      </ReactTransitionGroup>
    );
  }
}

function getStyles(ScaleInOut: ScaleInOut): {
  root?: React.CSSProperties;
} {
  const {
    props: { style, speed }
  } = ScaleInOut;

  return {
    root: {
      position: "relative",
      overflow: "inherit",
      transition: `transform ${speed}ms 0s ease-in-out`,
      ...style
    }
  };
}
