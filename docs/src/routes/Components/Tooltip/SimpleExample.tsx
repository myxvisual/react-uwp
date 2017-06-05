import * as React from "react";
import * as PropTypes from "prop-types";

import Tooltip from "react-uwp/Tooltip";
import IconButton from "react-uwp/IconButton";

export default class SimpleExample extends React.Component<{}, void> {
  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  render() {
    return (
      <div>
        <Tooltip content="Heart">
          <IconButton>HeartFillZeroWidthLegacy</IconButton>
        </Tooltip>

        <Tooltip
          content="Auto Close"
          autoClose
          autoCloseTimeout={1000}
        >
          <p>Auto Close after showed in 1000ms</p>
        </Tooltip>

        <Tooltip
          content="Bottom Margin 0"
          verticalPosition="bottom"
          margin={0}
        >
          <IconButton>EmojiLegacy</IconButton>
        </Tooltip>
      </div>
    );
  }
}
