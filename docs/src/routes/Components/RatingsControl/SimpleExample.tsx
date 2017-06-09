import * as React from "react";
import * as PropTypes from "prop-types";

import RatingsControl from "react-uwp/RatingsControl";

const baseStyle: React.CSSProperties = {
  margin: "10px 0",
  display: "block"
};
export default class SimpleExample extends React.Component<{}, void> {
  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  render() {
    return (
      <div>
        <RatingsControl style={baseStyle} />

        <RatingsControl
          style={baseStyle}
          iconStyle={{ fontSize: 48 }}
          iconRatedStyle={{ color: "yellowgreen" }}
          icon="HeartFillLegacy"
          defaultRating={1.25}
          maxRating={4}
        />

        <RatingsControl
          style={baseStyle}
          icon="HighlightLegacy"
          isReadOnly
          label="ReadOnly"
          defaultRating={2.5}
          maxRating={7}
        />
      </div>
    );
  }
}
