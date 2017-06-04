import * as React from "react";
import * as PropTypes from "prop-types";

import RatingsControl from "react-uwp/RatingsControl";

const blockStyle: React.CSSProperties = {
  display: "block"
};
export default class SimpleExample extends React.Component<{}, void> {
  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  render() {
    return (
      <div>
        <RatingsControl style={blockStyle} />

        <RatingsControl
          style={blockStyle}
          icon="HeartFillLegacy"
          defaultRating={1}
          maxRating={4}
        />

        <RatingsControl
          style={blockStyle}
          icon="HighlightLegacy"
          isReadOnly
          label="ReadOnly"
          defaultRating={2.5}
          maxRating={3}
        />
      </div>
    );
  }
}
