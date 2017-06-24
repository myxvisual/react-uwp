import * as React from "react";
import * as PropTypes from "prop-types";

import RatingControl from "react-uwp/RatingControl";

const baseStyle: React.CSSProperties = {
  margin: "10px 0",
  display: "block"
};
export default class SimpleExample extends React.Component {
  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  render() {
    return (
      <div>
        <RatingControl style={baseStyle} />

        <RatingControl
          style={baseStyle}
          iconStyle={{ fontSize: 48 }}
          iconRatedStyle={{ color: "yellowgreen" }}
          icon="HeartFillLegacy"
          defaultRating={1.25}
          maxRating={4}
        />

        <RatingControl
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
