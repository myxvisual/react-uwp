import * as React from "react";
import * as PropTypes from "prop-types";

import Slider from "react-uwp/Slider";

export default class SimpleExample extends React.Component<{}, void> {
  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  render() {
    return (
      <div>
        <Slider />

        <Slider
          showValueInfo
          initValue={250}
          maxValue={500}
          unit="px"
        />

        <Slider
          showValueInfo
          initValue={.8}
          numberToFixed={2}
          customControllerStyle={{
            background: this.context.theme.baseHigh
          }}
          barBackground="yellowgreen"
        />
      </div>
    );
  }
}
