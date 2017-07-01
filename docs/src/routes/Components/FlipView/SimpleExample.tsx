import * as React from "react";
import * as PropTypes from "prop-types";

import FlipView from "react-uwp/FlipView";
import { WrapperState } from "components/Wrapper";

const imageNames = [
  "banteng-2330138_1280.jpg",
  "chipmunk-2318395_1280.jpg",
  "dog-2332240_1280.jpg",
  "eyes-2344284_1280.jpg",
  "kitten-2307601_1280.jpg",
  "monkey-2320471_1280.jpg",
  "rest-2335341_1280.jpg"
];
export default class SimpleExample extends React.Component<WrapperState> {
  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  render() {
    const isPhoneScreen = window.innerHeight < 1024;
    const flipViewStyle: React.CSSProperties = {
      width: isPhoneScreen ? 320 : 640,
      height: isPhoneScreen ? 160 : 320,
      margin: "16px auto"
    };

    return (
      <div>
        <FlipView style={flipViewStyle}>
          {imageNames.slice(0, 3).map((imageName, index) => (
            <img
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover"
              }}
              src={require("./images/" + imageName)}
              key={`${index}`}
            />
          ))}
        </FlipView>
        <FlipView style={flipViewStyle} direction="vertical">
          {imageNames.slice(3).map((imageName, index) => (
            <img
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover"
              }}
              src={require("./images/" + imageName)}
              key={`${index}`}
            />
          ))}
        </FlipView>
      </div>
    );
  }
}
