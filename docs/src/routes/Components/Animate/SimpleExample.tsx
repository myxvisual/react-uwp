import * as React from "react";
import * as PropTypes from "prop-types";

import Button from "react-uwp/Button";
import { FadeInOut, SlideInOut, ScaleInOut, CustomAnimate } from "react-uwp/Animate";

export default class SimpleExample extends React.Component {
  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  render() {
    const baseStyle: React.CSSProperties = {
      margin: 10
    };
    return (
      <div>
        <FadeInOut speed={1000}>
          <Button style={baseStyle}>
            FadeInOut
          </Button>
        </FadeInOut>

        <SlideInOut speed={1000}>
          <Button style={baseStyle}>
            SlideInOut
          </Button>
        </SlideInOut>

        <ScaleInOut speed={1000}>
          <Button style={baseStyle}>
            ScaleInOut
          </Button>
        </ScaleInOut>

        <CustomAnimate
          leaveStyle={{
            transform: "rotateY(180deg) rotateX(80deg)",
            transformStyle: "preserve-3d",
            opacity: 0
          }}
          enterStyle={{
            transform: "rotateY(0)",
            opacity: 1
          }}
          speed={1000}
        >
          <Button style={baseStyle}>
            CustomAnimate
          </Button>
        </CustomAnimate>

        <CustomAnimate
          leaveStyle={{
            transform: "rotateY(180deg) rotateX(80deg)",
            transformStyle: "preserve-3d",
            opacity: 0
          }}
          enterStyle={{
            transform: "rotateY(0)",
            opacity: 1
          }}
          appearAnimate={false}
          speed={1000}
        >
          <Button style={baseStyle}>
            CustomAnimate (appearAnimate: false)
          </Button>
        </CustomAnimate>
      </div>
    );
  }
}
