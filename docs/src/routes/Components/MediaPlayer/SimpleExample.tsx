import * as React from "react";
import * as PropTypes from "prop-types";

import MediaPlayer from "react-uwp/MediaPlayer";

export default class SimpleExample extends React.Component<{}, void> {
  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  render() {
    return <MediaPlayer url="https://www.youtube.com/watch?v=vcBGj4R7Fo0" />;
  }
}
