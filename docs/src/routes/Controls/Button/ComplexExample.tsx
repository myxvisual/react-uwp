import * as React from "react";

import Button from "react-uwp/src/controls/Button";

export default class ComplexExample extends React.PureComponent<{}, {}> {
  render() {
    const defaultBtnStyle: React.CSSProperties = {
      margin: 4
    };
    return (
      <div>
        <Button
          style={defaultBtnStyle}
          icon="RatingStarFillZeroWidthLegacy"
        >
          Favorite
        </Button>
        <Button
          style={defaultBtnStyle}
          icon="HeartFillZeroWidthLegacy"
          iconPosition="right"
        >
          Like
        </Button>
      </div>
    );
  }
}
