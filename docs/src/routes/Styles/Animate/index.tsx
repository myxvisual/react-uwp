import * as React from "react";
import * as PropTypes from "prop-types";


import Toggle from "react-uwp/Toggle";
import DropDownMenu from "react-uwp/DropDownMenu";
import Button from "react-uwp/Button";
import Slider from "react-uwp/Slider";

import CustomAnimate from "react-uwp/Animate/CustomAnimate";
import FadeInOut from "react-uwp/Animate/FadeInOut";
import ScaleInOut from "react-uwp/Animate/ScaleInOut";

export interface DataProps {}

export interface AnimateProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export interface AnimateState {
  animateName?: "Fade" | "Scale" | "Slide";
  speed?: number;
  numb?: number;
  transitionTimingFunction?: string;
}

const animateNames = [
  "Fade",
  "Scale",
  "Slide"
];

const animateSpeeds = [
  "500",
  "1000",
  "2000"
];

const transitionTimingFunctions = [
  "ease",
  "ease-in",
  "ease-out",
  "ease-in-out",
  "cubic-bezier(0.4, 0, 1, 1)",
  "cubic-bezier(0.47, 0, 0.75, 0.72)",
  "cubic-bezier(0.645, 0.045, 0.355, 1)"
];

export default class Animate extends React.Component<AnimateProps, AnimateState> {
  static defaultProps: AnimateProps = {};

  state: AnimateState = {
    animateName: "Scale",
    speed: 850,
    numb: 0,
    transitionTimingFunction: "ease"
  };

  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  handleChooseAnimateMethod = (animateName: any) => {
    this.setState({ animateName });
  }

  handleChooseAnimateSpeed = (speed: any) => {
    speed = +speed;
    this.setState({ speed });
  }

  handleChooseTransitionTimingFunction = (transitionTimingFunction: any) => {
    this.setState({ transitionTimingFunction });
  }

  render() {
    const {
      ...attributes
    } = this.props;
    const { animateName, speed, numb, transitionTimingFunction } = this.state;
    const { theme } = this.context;
    const styles = getStyles(this);
    let AnimateWrapper: any = FadeInOut;
    switch (animateName) {
      case "Fade": {
        AnimateWrapper = FadeInOut;
        break;
      }
      case "Scale": {
        AnimateWrapper = ScaleInOut;
        break;
      }
      default: {
        break;
      }
    }

    return (
      <div
        {...attributes}
        style={styles.root}
      >
        <AnimateWrapper
          speed={speed}
          key={`${animateName} ${speed}`}
          transitionTimingFunction={transitionTimingFunction}
        >
          <div style={{ display: "inline-block", fontSize: 160, fontWeight: "lighter" }}>
            Animate
          </div>
        </AnimateWrapper>
        <DropDownMenu
          defaultValue={animateName}
          values={animateNames}
          onChangeValue={this.handleChooseAnimateMethod}
        />
        <DropDownMenu
          itemWidth={280}
          defaultValue={transitionTimingFunction}
          values={transitionTimingFunctions}
          onChangeValue={this.handleChooseTransitionTimingFunction}
        />
        <p>Speed:</p>
        <Slider
          showValueInfo
          minValue={150}
          initValue={speed}
          maxValue={4000}
          onChangeValue={this.handleChooseAnimateSpeed}
        />
        <div>
          <AnimateWrapper
            speed={speed}
            mode="in-out"
            wrapperStyle={{ display: "inline-block", width: 200, height: 200 }}
            transitionTimingFunction={transitionTimingFunction}
          >
            <div style={{ display: "block", width: 200, overflow: "hidden", fontSize: 140, fontWeight: "lighter" }} key={`${numb}`}>
              {numb}
            </div>
          </AnimateWrapper>
        </div>
        <Button onClick={() => { this.setState((preState, preProps) => ({ numb: preState.numb + 1 })); } }>
          +
        </Button>
        <Button onClick={() => { this.setState((preState, preProps) => ({ numb: preState.numb - 1 })); } }>
          -
        </Button>
      </div>
    );
  }
}

function getStyles(animate: Animate): {
  root?: React.CSSProperties;
} {
  const {
    context: { theme },
    props: { style }
  } = animate;
  const { prepareStyles } = theme;

  return {
    root: prepareStyles({
      ...style
    })
  };
}
