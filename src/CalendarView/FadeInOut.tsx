import * as React from "react";
import { TransitionGroup as ReactTransitionGroup } from "react-transition-group";

import FadeInOutChild from "./FadeInOutChild";

export interface DataProps {
  [key: string]: any;
}

export interface FadeInOutProps extends DataProps {
  appearAnimate?: boolean;
  childAttributes?: React.HTMLAttributes<HTMLDivElement>;
  enterDelay?: number;
  leaveDelay?: number;
  maxValue?: number;
  minValue?: number;
  mode?: "in" | "out" | "both";
  speed?: number;
}

export default class FadeInOut extends React.Component<FadeInOutProps> {
  static defaultProps: FadeInOutProps = {
    appearAnimate: true,
    children: <div>FadeInOut</div>,
    enterDelay: 0,
    leaveDelay: 0,
    maxValue: 1,
    minValue: 0,
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
      maxValue,
      minValue,
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
      >
        {React.Children.map(children, (child: any, index) => (
          <FadeInOutChild
            key={child.key}
            minValue={minValue}
            maxValue={maxValue}
            enterDelay={enterDelay}
            leaveDelay={leaveDelay}
            mode={mode}
            speed={speed}
            appearAnimate={appearAnimate}
            {...childAttributes}
          >
            {child}
          </FadeInOutChild>
        ))}
      </ReactTransitionGroup>
    );
  }
}

function getStyles(FadeInOut: FadeInOut): {
  root?: React.CSSProperties;
} {
  const {
    props: { style }
  } = FadeInOut;

  return {
    root: {
      overflow: "hidden",
      ...style
    }
  };
}
