import * as React from "react";
import * as PropTypes from "prop-types";

import Slider from "react-uwp/Slider";

const baseStyle: React.CSSProperties = { margin: 10 };
export default class SimpleExample extends React.Component {
  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  render() {
    return (
      <div style={{ margin: "10px 0" }}>
        <Slider style={baseStyle} />
        <Slider style={{ ...baseStyle, height: 120 }} displayMode="vertical" initValue={0.75} />

        <Slider
          style={baseStyle}
          initValue={250}
          maxValue={500}
        />

        <Slider
          style={baseStyle}
          showValueInfo
          initValue={.8}
          numberToFixed={2}
          customControllerStyle={{
            background: this.context.theme.baseHigh
          }}
          barBackground="yellowgreen"
          unit="px"
        />
      </div>
    );
  }
}
