import * as React from "react";
import * as PropTypes from "prop-types";


import Toggle from "react-uwp/Toggle";
import DropDownMenu from "react-uwp/DropDownMenu";
import Button from "react-uwp/Button";

import CustomAnimate from "react-uwp/Animate/CustomAnimate";
import FadeInOut from "react-uwp/Animate/FadeInOut";
import ScaleInOut from "react-uwp/Animate/ScaleInOut";

export interface DataProps {}

export interface AnimateProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export interface AnimateState {
  animateName?: "Fade" | "Scale" | "Slide";
  speed?: number;
  numb?: number;
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

const time = [
  "500",
  "1000",
  "2000"
];
export default class Animate extends React.Component<AnimateProps, AnimateState> {
  static defaultProps: AnimateProps = {};

  state: AnimateState = {
    animateName: "Scale",
    speed: 1000,
    numb: 0
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

  render() {
    const {
      ...attributes
    } = this.props;
    const { animateName, speed, numb } = this.state;
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
        <AnimateWrapper speed={speed} key={`${animateName} ${speed}`}>
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
          defaultValue={speed.toString()}
          values={animateSpeeds}
          onChangeValue={this.handleChooseAnimateSpeed}
        />
        <div>
          <AnimateWrapper speed={speed} mode="in-out" wrapperStyle={{ display: "inline-block", width: 200, height: 200 }}>
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
